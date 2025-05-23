// Página para adicionar item ao inventário
// pages/inventory/add.js

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { getItems } from '../../services/items';
import { addItem } from '../../services/inventory';
import ConfirmModal from '../../components/ConfirmModal';

export default function AddItem() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState('');
  const [groupMembers, setGroupMembers] = useState('');
  const [notes, setNotes] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems();
        setItems(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar itens:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedItem) {
      alert('Selecione um item para adicionar ao inventário');
      return;
    }
    setShowConfirm(true);
  };

  const confirmAdd = async () => {
    setSubmitting(true);
    try {
      await addItem({
        item_id: selectedItem,
        group_members: groupMembers,
        notes: notes
      });
      
      router.push('/inventory');
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      setError(error.message);
      setShowConfirm(false);
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Adicionar Item | Tibia Inventory Tracker</title>
      </Head>

      <div className="add-item-container">
        <h2 className="page-title">Adicionar Item ao Inventário</h2>

        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Carregando itens disponíveis...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button 
              className="tibia-button" 
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="tibia-form tibia-panel">
            <div className="form-group">
              <label htmlFor="item">Item:</label>
              <select 
                id="item" 
                value={selectedItem} 
                onChange={(e) => setSelectedItem(e.target.value)}
                required
                className="tibia-select"
              >
                <option value="">Selecione um item</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedItem && (
              <div className="selected-item-preview">
                {items.find(item => item.id.toString() === selectedItem) && (
                  <>
                    <img 
                      src={items.find(item => item.id.toString() === selectedItem).image_url} 
                      alt={items.find(item => item.id.toString() === selectedItem).name} 
                    />
                    <div>
                      <h4>{items.find(item => item.id.toString() === selectedItem).name}</h4>
                      <p>{items.find(item => item.id.toString() === selectedItem).description}</p>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="group-members">Membros do Grupo:</label>
              <input 
                type="text" 
                id="group-members" 
                value={groupMembers} 
                onChange={(e) => setGroupMembers(e.target.value)}
                placeholder="Ex: Player1, Player2, Player3"
                className="tibia-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Observações:</label>
              <textarea 
                id="notes" 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Informações adicionais sobre o drop"
                className="tibia-textarea"
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => router.push('/inventory')}
                className="tibia-button secondary"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="tibia-button"
                disabled={!selectedItem || submitting}
              >
                Adicionar Item
              </button>
            </div>
          </form>
        )}

        {showConfirm && (
          <ConfirmModal
            title="Confirmar Adição"
            message={`Deseja adicionar ${items.find(item => item.id.toString() === selectedItem)?.name} ao inventário?`}
            onConfirm={confirmAdd}
            onCancel={() => setShowConfirm(false)}
            isLoading={submitting}
          />
        )}
      </div>

      <style jsx>{`
        .add-item-container {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        .page-title {
          color: var(--accent-color);
          margin-bottom: 20px;
          font-size: 1.8rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }
        
        .error-message {
          background-color: rgba(139, 0, 0, 0.3);
          border: 1px solid #8B0000;
          color: #FFA07A;
          padding: 20px;
          border-radius: 4px;
          text-align: center;
        }
        
        .tibia-form {
          max-width: 600px;
          margin: 0 auto;
          padding: 25px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: var(--text-color);
          font-weight: bold;
        }
        
        .selected-item-preview {
          display: flex;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.2);
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
          animation: fadeIn 0.3s ease-in-out;
        }
        
        .selected-item-preview img {
          width: 64px;
          height: 64px;
          margin-right: 15px;
          background-color: rgba(0, 0, 0, 0.3);
          padding: 5px;
          border-radius: 4px;
        }
        
        .selected-item-preview h4 {
          margin: 0 0 5px;
          color: var(--accent-color);
        }
        
        .selected-item-preview p {
          margin: 0;
          font-size: 0.9rem;
          color: var(--text-color);
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 30px;
        }
        
        @media (max-width: 768px) {
          .tibia-form {
            padding: 15px;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .form-actions button {
            width: 100%;
          }
        }
      `}</style>
    </Layout>
  );
}

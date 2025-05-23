// Página para marcar item como vendido
// pages/inventory/[id]/sell.js

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { getInventory, sellItem } from '../../../services/inventory';
import ConfirmModal from '../../../components/ConfirmModal';

export default function SellItem() {
  const router = useRouter();
  const { id } = router.query;
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sellPrice, setSellPrice] = useState('');
  const [sellNotes, setSellNotes] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      
      try {
        const inventory = await getInventory();
        const foundItem = inventory.find(item => item.id.toString() === id);
        
        if (!foundItem) {
          setError('Item não encontrado no inventário');
          setLoading(false);
          return;
        }
        
        if (foundItem.is_sold) {
          setError('Este item já foi vendido');
          setLoading(false);
          return;
        }
        
        setItem(foundItem);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar item:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!sellPrice || isNaN(parseFloat(sellPrice)) || parseFloat(sellPrice) <= 0) {
      alert('Informe um preço de venda válido');
      return;
    }
    
    setShowConfirm(true);
  };

  const confirmSell = async () => {
    setSubmitting(true);
    try {
      await sellItem(id, {
        sell_price: parseFloat(sellPrice),
        sell_notes: sellNotes
      });
      
      router.push('/inventory');
    } catch (error) {
      console.error('Erro ao marcar item como vendido:', error);
      setError(error.message);
      setShowConfirm(false);
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Marcar como Vendido | Tibia Inventory Tracker</title>
      </Head>

      <div className="sell-item-container">
        <h2 className="page-title">Marcar Item como Vendido</h2>

        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Carregando item...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button 
              className="tibia-button" 
              onClick={() => router.push('/inventory')}
            >
              Voltar para o Inventário
            </button>
          </div>
        ) : (
          <>
            <div className="item-preview tibia-panel">
              <div className="item-image">
                <img src={item.image_url} alt={item.item_name} />
              </div>
              <div className="item-details">
                <h3>{item.item_name}</h3>
                <p>{item.item_description}</p>
                
                {item.group_members && (
                  <div className="item-info">
                    <strong>Grupo:</strong> {item.group_members}
                  </div>
                )}
                
                {item.notes && (
                  <div className="item-info">
                    <strong>Observações:</strong> {item.notes}
                  </div>
                )}
                
                <div className="item-date">
                  Adicionado em {new Date(item.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="tibia-form tibia-panel">
              <div className="form-group">
                <label htmlFor="sell-price">Preço de Venda (gp):</label>
                <input 
                  type="number" 
                  id="sell-price" 
                  value={sellPrice} 
                  onChange={(e) => setSellPrice(e.target.value)}
                  placeholder="Ex: 10000"
                  min="1"
                  required
                  className="tibia-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="sell-notes">Detalhes da Venda:</label>
                <textarea 
                  id="sell-notes" 
                  value={sellNotes} 
                  onChange={(e) => setSellNotes(e.target.value)}
                  placeholder="Informações sobre a venda, divisão de valores, etc."
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
                  disabled={!sellPrice || submitting}
                >
                  Marcar como Vendido
                </button>
              </div>
            </form>
          </>
        )}

        {showConfirm && (
          <ConfirmModal
            title="Confirmar Venda"
            message={`Deseja marcar ${item.item_name} como vendido por ${parseInt(sellPrice).toLocaleString()} gp?`}
            onConfirm={confirmSell}
            onCancel={() => setShowConfirm(false)}
            isLoading={submitting}
          />
        )}
      </div>

      <style jsx>{`
        .sell-item-container {
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
        
        .item-preview {
          display: flex;
          margin-bottom: 20px;
          padding: 20px;
        }
        
        .item-image {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 20px;
          background-color: rgba(0, 0, 0, 0.3);
          padding: 5px;
          border-radius: 4px;
        }
        
        .item-image img {
          max-width: 100%;
          max-height: 100%;
        }
        
        .item-details {
          flex: 1;
        }
        
        .item-details h3 {
          margin: 0 0 10px;
          color: var(--accent-color);
          font-size: 1.3rem;
        }
        
        .item-details p {
          margin: 0 0 15px;
          color: var(--text-color);
        }
        
        .item-info {
          margin-bottom: 10px;
          font-size: 0.9rem;
        }
        
        .item-info strong {
          color: var(--accent-color);
        }
        
        .item-date {
          font-size: 0.8rem;
          color: rgba(245, 222, 179, 0.7);
          margin-top: 15px;
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
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 30px;
        }
        
        @media (max-width: 768px) {
          .item-preview {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          
          .item-image {
            margin-right: 0;
            margin-bottom: 15px;
          }
          
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

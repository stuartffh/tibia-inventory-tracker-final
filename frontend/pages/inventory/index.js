// Página de inventário
// pages/inventory/index.js

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { getInventory, deleteItem } from '../../services/inventory';
import ConfirmModal from '../../components/ConfirmModal';

export default function Inventory() {
  const router = useRouter();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'available', 'sold'

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await getInventory();
        setInventory(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar inventário:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      await deleteItem(itemToDelete.id);
      setInventory(inventory.filter(item => item.id !== itemToDelete.id));
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Erro ao remover item:', error);
      setError(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const filteredInventory = inventory.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'available') return !item.is_sold;
    if (filter === 'sold') return item.is_sold;
    return true;
  });

  return (
    <Layout>
      <Head>
        <title>Inventário | Tibia Inventory Tracker</title>
      </Head>

      <div className="inventory-container">
        <div className="page-header">
          <h2 className="page-title">Inventário</h2>
          <Link href="/inventory/add" className="tibia-button">
            Adicionar Item
          </Link>
        </div>

        <div className="filter-container tibia-panel">
          <div className="filter-buttons">
            <button 
              className={`filter-button ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todos
            </button>
            <button 
              className={`filter-button ${filter === 'available' ? 'active' : ''}`}
              onClick={() => setFilter('available')}
            >
              Disponíveis
            </button>
            <button 
              className={`filter-button ${filter === 'sold' ? 'active' : ''}`}
              onClick={() => setFilter('sold')}
            >
              Vendidos
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Carregando inventário...</p>
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
        ) : filteredInventory.length === 0 ? (
          <div className="empty-inventory tibia-panel">
            <p>Nenhum item encontrado no inventário.</p>
            <Link href="/inventory/add" className="tibia-button">
              Adicionar Primeiro Item
            </Link>
          </div>
        ) : (
          <div className="inventory-grid">
            {filteredInventory.map((item) => (
              <div key={item.id} className={`inventory-item tibia-panel ${item.is_sold ? 'sold' : ''}`}>
                <div className="item-header">
                  <div className="item-image">
                    <img src={item.image_url} alt={item.item_name} />
                  </div>
                  <div className="item-title">
                    <h3>{item.item_name}</h3>
                    {item.is_sold && (
                      <span className="sold-badge">Vendido</span>
                    )}
                  </div>
                </div>
                
                <div className="item-details">
                  <p className="item-description">{item.item_description}</p>
                  
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
                  
                  {item.is_sold && (
                    <>
                      <div className="item-info">
                        <strong>Preço de Venda:</strong> {item.sell_price.toLocaleString()} gp
                      </div>
                      
                      {item.sell_notes && (
                        <div className="item-info">
                          <strong>Detalhes da Venda:</strong> {item.sell_notes}
                        </div>
                      )}
                    </>
                  )}
                  
                  <div className="item-date">
                    Adicionado em {new Date(item.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                
                <div className="item-actions">
                  {!item.is_sold && (
                    <button 
                      className="tibia-button"
                      onClick={() => router.push(`/inventory/${item.id}/sell`)}
                    >
                      Marcar como Vendido
                    </button>
                  )}
                  
                  <button 
                    className="tibia-button danger"
                    onClick={() => handleDeleteClick(item)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showDeleteConfirm && itemToDelete && (
          <ConfirmModal
            title="Confirmar Remoção"
            message={`Tem certeza que deseja remover ${itemToDelete.item_name} do inventário? Esta ação não pode ser desfeita.`}
            onConfirm={confirmDelete}
            onCancel={() => {
              setShowDeleteConfirm(false);
              setItemToDelete(null);
            }}
            isLoading={deleting}
          />
        )}
      </div>

      <style jsx>{`
        .inventory-container {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .page-title {
          color: var(--accent-color);
          margin: 0;
          font-size: 1.8rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .filter-container {
          margin-bottom: 20px;
          padding: 15px;
        }
        
        .filter-buttons {
          display: flex;
          gap: 10px;
        }
        
        .filter-button {
          background-color: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-color);
          color: var(--text-color);
          padding: 8px 15px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .filter-button:hover {
          background-color: rgba(139, 69, 19, 0.3);
        }
        
        .filter-button.active {
          background-color: var(--accent-color);
          color: #000;
          font-weight: bold;
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
        
        .empty-inventory {
          text-align: center;
          padding: 40px 20px;
        }
        
        .empty-inventory p {
          margin-bottom: 20px;
          font-size: 1.1rem;
        }
        
        .inventory-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .inventory-item {
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        
        .inventory-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        }
        
        .inventory-item.sold {
          border: 1px solid rgba(255, 215, 0, 0.5);
          background-color: rgba(139, 69, 19, 0.2);
        }
        
        .item-header {
          display: flex;
          align-items: center;
          padding: 15px;
          background-color: rgba(0, 0, 0, 0.3);
          border-bottom: 1px solid var(--border-color);
        }
        
        .item-image {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
        }
        
        .item-image img {
          max-width: 100%;
          max-height: 100%;
        }
        
        .item-title {
          flex: 1;
        }
        
        .item-title h3 {
          margin: 0 0 5px;
          color: var(--accent-color);
          font-size: 1.2rem;
        }
        
        .sold-badge {
          display: inline-block;
          background-color: rgba(255, 215, 0, 0.3);
          color: #FFD700;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: bold;
        }
        
        .item-details {
          padding: 15px;
          flex: 1;
        }
        
        .item-description {
          margin-top: 0;
          margin-bottom: 15px;
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
        
        .item-actions {
          display: flex;
          gap: 10px;
          padding: 15px;
          background-color: rgba(0, 0, 0, 0.2);
          border-top: 1px solid var(--border-color);
        }
        
        .item-actions button {
          flex: 1;
        }
        
        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          
          .inventory-grid {
            grid-template-columns: 1fr;
          }
          
          .item-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </Layout>
  );
}

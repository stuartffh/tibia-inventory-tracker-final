// Página principal (Dashboard)
// pages/index.js

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { getDashboardData } from '../services/reports';
import Link from 'next/link';

export default function Home() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Dashboard | Tibia Inventory Tracker</title>
      </Head>

      <div className="dashboard">
        <h2 className="page-title">Dashboard</h2>

        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Carregando dados...</p>
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
          <>
            <div className="stats-grid">
              <div className="stat-card tibia-panel">
                <h3>Total de Itens</h3>
                <p className="stat-value">{dashboardData.totalItems}</p>
              </div>
              
              <div className="stat-card tibia-panel">
                <h3>Itens Dropados</h3>
                <p className="stat-value">{dashboardData.unsoldItems}</p>
              </div>
              
              <div className="stat-card tibia-panel">
                <h3>Itens Vendidos</h3>
                <p className="stat-value">{dashboardData.soldItems}</p>
              </div>
              
              <div className="stat-card tibia-panel">
                <h3>Valor Total</h3>
                <p className="stat-value">{dashboardData.totalValue.toLocaleString()} gp</p>
              </div>
            </div>

            <div className="actions-container tibia-panel">
              <h3>Ações Rápidas</h3>
              <div className="actions-buttons">
                <Link href="/inventory/add" className="tibia-button">
                  Adicionar Item
                </Link>
                <Link href="/inventory" className="tibia-button">
                  Ver Inventário
                </Link>
                <Link href="/reports" className="tibia-button">
                  Ver Relatórios
                </Link>
              </div>
            </div>

            {dashboardData.recentItems.length > 0 && (
              <div className="recent-items tibia-panel">
                <h3>Itens Recentes</h3>
                <div className="items-list">
                  {dashboardData.recentItems.map((item) => (
                    <div key={item.id} className="item-card">
                      <div className="item-image">
                        <img src={item.image_url} alt={item.item_name} />
                      </div>
                      <div className="item-details">
                        <h4>{item.item_name}</h4>
                        <p>
                          {item.is_sold 
                            ? `Vendido por ${item.sell_price.toLocaleString()} gp` 
                            : 'Disponível no inventário'}
                        </p>
                        <p className="item-date">
                          {new Date(item.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .dashboard {
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
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .stat-card {
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        }
        
        .stat-card h3 {
          margin-top: 0;
          color: var(--text-color);
          font-size: 1.1rem;
        }
        
        .stat-value {
          font-size: 2rem;
          color: var(--accent-color);
          margin: 10px 0 0;
          font-weight: bold;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .actions-container {
          margin-bottom: 30px;
          padding: 20px;
        }
        
        .actions-container h3 {
          margin-top: 0;
          margin-bottom: 15px;
          color: var(--text-color);
        }
        
        .actions-buttons {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }
        
        .recent-items {
          padding: 20px;
        }
        
        .recent-items h3 {
          margin-top: 0;
          margin-bottom: 15px;
          color: var(--text-color);
        }
        
        .items-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 15px;
        }
        
        .item-card {
          display: flex;
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .item-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
          background-color: rgba(139, 69, 19, 0.2);
        }
        
        .item-image {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.3);
        }
        
        .item-image img {
          max-width: 100%;
          max-height: 100%;
        }
        
        .item-details {
          flex: 1;
          padding: 10px 15px;
        }
        
        .item-details h4 {
          margin: 0 0 5px;
          color: var(--accent-color);
          font-size: 1.1rem;
        }
        
        .item-details p {
          margin: 0 0 5px;
          font-size: 0.9rem;
        }
        
        .item-date {
          color: rgba(245, 222, 179, 0.7);
          font-size: 0.8rem !important;
        }
        
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .items-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Layout>
  );
}

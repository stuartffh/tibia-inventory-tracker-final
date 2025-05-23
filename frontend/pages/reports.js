// Página de relatórios
// pages/reports.js

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { getPeriodReport } from '../services/reports';

export default function Reports() {
  const [period, setPeriod] = useState('today');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        const data = await getPeriodReport(period);
        setReportData(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar relatório:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchReportData();
  }, [period]);

  return (
    <Layout>
      <Head>
        <title>Relatórios | Tibia Inventory Tracker</title>
      </Head>

      <div className="reports-container">
        <h2 className="page-title">Relatórios</h2>

        <div className="period-selector tibia-panel">
          <div className="period-buttons">
            <button 
              className={`period-button ${period === 'today' ? 'active' : ''}`}
              onClick={() => setPeriod('today')}
            >
              Hoje
            </button>
            <button 
              className={`period-button ${period === 'week' ? 'active' : ''}`}
              onClick={() => setPeriod('week')}
            >
              Última Semana
            </button>
            <button 
              className={`period-button ${period === 'month' ? 'active' : ''}`}
              onClick={() => setPeriod('month')}
            >
              Último Mês
            </button>
            <button 
              className={`period-button ${period === 'all' ? 'active' : ''}`}
              onClick={() => setPeriod('all')}
            >
              Todo Período
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Carregando relatório...</p>
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
          <div className="report-content">
            <div className="report-summary tibia-panel">
              <div className="summary-item">
                <h3>Itens Dropados</h3>
                <p className="summary-value">{reportData.droppedItems.length}</p>
              </div>
              
              <div className="summary-item">
                <h3>Itens Vendidos</h3>
                <p className="summary-value">{reportData.soldItems.length}</p>
              </div>
              
              <div className="summary-item">
                <h3>Valor Total</h3>
                <p className="summary-value">{reportData.totalValue.toLocaleString()} gp</p>
              </div>
            </div>

            {reportData.droppedItems.length > 0 && (
              <div className="report-section tibia-panel">
                <h3 className="section-title">Itens Dropados no Período</h3>
                <div className="items-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Grupo</th>
                        <th>Data</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.droppedItems.map((item) => (
                        <tr key={item.id} className={item.is_sold ? 'sold-item' : ''}>
                          <td className="item-cell">
                            <div className="item-info">
                              <img src={item.image_url} alt={item.item_name} />
                              <span>{item.item_name}</span>
                            </div>
                          </td>
                          <td>{item.group_members || '-'}</td>
                          <td>{new Date(item.created_at).toLocaleDateString('pt-BR')}</td>
                          <td>
                            {item.is_sold ? (
                              <span className="sold-badge">Vendido</span>
                            ) : (
                              <span className="available-badge">Disponível</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {reportData.soldItems.length > 0 && (
              <div className="report-section tibia-panel">
                <h3 className="section-title">Itens Vendidos no Período</h3>
                <div className="items-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Preço</th>
                        <th>Data da Venda</th>
                        <th>Detalhes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.soldItems.map((item) => (
                        <tr key={item.id}>
                          <td className="item-cell">
                            <div className="item-info">
                              <img src={item.image_url} alt={item.item_name} />
                              <span>{item.item_name}</span>
                            </div>
                          </td>
                          <td className="price-cell">{item.sell_price.toLocaleString()} gp</td>
                          <td>{new Date(item.sold_at).toLocaleDateString('pt-BR')}</td>
                          <td>{item.sell_notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {reportData.droppedItems.length === 0 && reportData.soldItems.length === 0 && (
              <div className="empty-report tibia-panel">
                <p>Nenhum item encontrado para o período selecionado.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .reports-container {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        .page-title {
          color: var(--accent-color);
          margin-bottom: 20px;
          font-size: 1.8rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .period-selector {
          margin-bottom: 20px;
          padding: 15px;
        }
        
        .period-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        .period-button {
          background-color: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-color);
          color: var(--text-color);
          padding: 8px 15px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .period-button:hover {
          background-color: rgba(139, 69, 19, 0.3);
        }
        
        .period-button.active {
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
        
        .report-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
          padding: 20px;
        }
        
        .summary-item {
          text-align: center;
        }
        
        .summary-item h3 {
          margin: 0 0 10px;
          color: var(--text-color);
          font-size: 1.1rem;
        }
        
        .summary-value {
          font-size: 1.8rem;
          color: var(--accent-color);
          margin: 0;
          font-weight: bold;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .report-section {
          margin-bottom: 20px;
        }
        
        .section-title {
          padding: 15px 20px;
          margin: 0;
          background-color: rgba(0, 0, 0, 0.3);
          border-bottom: 1px solid var(--border-color);
          color: var(--text-color);
          font-size: 1.2rem;
        }
        
        .items-table {
          overflow-x: auto;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        th {
          text-align: left;
          padding: 12px 15px;
          background-color: rgba(0, 0, 0, 0.2);
          color: var(--accent-color);
          font-size: 0.9rem;
          border-bottom: 1px solid var(--border-color);
        }
        
        td {
          padding: 12px 15px;
          border-bottom: 1px solid rgba(139, 69, 19, 0.2);
        }
        
        tr:hover {
          background-color: rgba(139, 69, 19, 0.1);
        }
        
        .item-cell {
          min-width: 200px;
        }
        
        .price-cell {
          min-width: 120px;
        }
        
        .item-info {
          display: flex;
          align-items: center;
        }
        
        .item-info img {
          width: 32px;
          height: 32px;
          margin-right: 10px;
          background-color: rgba(0, 0, 0, 0.3);
          padding: 3px;
          border-radius: 4px;
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
        
        .available-badge {
          display: inline-block;
          background-color: rgba(0, 128, 0, 0.3);
          color: #90EE90;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: bold;
        }
        
        .sold-item {
          background-color: rgba(139, 69, 19, 0.1);
        }
        
        .empty-report {
          text-align: center;
          padding: 40px 20px;
        }
        
        .empty-report p {
          margin: 0;
          font-size: 1.1rem;
        }
        
        @media (max-width: 768px) {
          .period-buttons {
            flex-direction: column;
          }
          
          .period-button {
            width: 100%;
            text-align: center;
          }
          
          .report-summary {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Layout>
  );
}

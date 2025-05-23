// Componente de confirmação modal
// components/ConfirmModal.js

import { useEffect } from 'react';

export default function ConfirmModal({ title, message, onConfirm, onCancel, isLoading = false }) {
  // Impedir rolagem do fundo quando o modal está aberto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-container tibia-panel">
        <div className="modal-header">
          <h3>{title}</h3>
        </div>
        
        <div className="modal-content">
          <p>{message}</p>
        </div>
        
        <div className="modal-actions">
          <button 
            className="tibia-button secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </button>
          
          <button 
            className="tibia-button danger"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loader-small"></span>
                Processando...
              </>
            ) : (
              'Confirmar'
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-in-out;
        }
        
        .modal-container {
          width: 90%;
          max-width: 500px;
          animation: slideIn 0.3s ease-in-out;
        }
        
        .modal-header {
          padding: 15px 20px;
          border-bottom: 1px solid var(--border-color);
          background-color: rgba(0, 0, 0, 0.3);
        }
        
        .modal-header h3 {
          margin: 0;
          color: var(--accent-color);
          font-size: 1.2rem;
        }
        
        .modal-content {
          padding: 20px;
        }
        
        .modal-content p {
          margin: 0;
          line-height: 1.5;
        }
        
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          padding: 15px 20px;
          border-top: 1px solid var(--border-color);
          background-color: rgba(0, 0, 0, 0.2);
        }
        
        .loader-small {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
          margin-right: 8px;
          vertical-align: middle;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .modal-actions {
            flex-direction: column-reverse;
          }
          
          .modal-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

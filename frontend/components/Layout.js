// Componente de layout principal
// components/Layout.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { isAuthenticated, logout, getUser } from '../services/auth';

export default function Layout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  
  useEffect(() => {
    // Verificar autenticação
    if (!isAuthenticated() && router.pathname !== '/login') {
      router.push('/login');
      return;
    }
    
    if (isAuthenticated()) {
      setUser(getUser());
    }
  }, [router.pathname]);
  
  const handleLogout = () => {
    logout();
  };
  
  // Não renderizar nada na página de login
  if (router.pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <Link href="/">
              <span className="logo-text">Tibia Inventory Tracker</span>
            </Link>
          </div>
          
          <button 
            className="mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
            <ul>
              <li>
                <Link href="/" className={router.pathname === '/' ? 'active' : ''}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/inventory" className={router.pathname.startsWith('/inventory') ? 'active' : ''}>
                  Inventário
                </Link>
              </li>
              <li>
                <Link href="/reports" className={router.pathname === '/reports' ? 'active' : ''}>
                  Relatórios
                </Link>
              </li>
              {user && (
                <li className="user-menu">
                  <span className="username">{user.username}</span>
                  <button onClick={handleLogout} className="logout-button">
                    Sair
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
      
      <footer className="footer">
        <div className="container">
          <p>Tibia Inventory Tracker &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>

      <style jsx>{`
        .layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .header {
          background-color: rgba(0, 0, 0, 0.8);
          border-bottom: 2px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }
        
        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          max-width: 1200px;
          margin: 0 auto;
          height: 70px;
        }
        
        .logo {
          display: flex;
          align-items: center;
        }
        
        .logo-text {
          font-family: 'MedievalSharp', cursive;
          font-size: 1.5rem;
          color: var(--accent-color);
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
          cursor: pointer;
        }
        
        .main-nav ul {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 20px;
        }
        
        .main-nav a {
          color: var(--text-color);
          font-weight: 500;
          padding: 8px 12px;
          border-radius: 4px;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        
        .main-nav a:hover {
          color: var(--accent-color);
          background-color: rgba(139, 69, 19, 0.2);
        }
        
        .main-nav a.active {
          color: var(--accent-color);
          background-color: rgba(139, 69, 19, 0.3);
          font-weight: bold;
        }
        
        .user-menu {
          display: flex;
          align-items: center;
          margin-left: 20px;
          padding-left: 20px;
          border-left: 1px solid var(--border-color);
        }
        
        .username {
          color: var(--accent-color);
          font-weight: bold;
          margin-right: 10px;
        }
        
        .logout-button {
          background: none;
          border: none;
          color: var(--text-color);
          cursor: pointer;
          font-size: 0.9rem;
          padding: 5px 10px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        
        .logout-button:hover {
          background-color: rgba(139, 0, 0, 0.3);
          color: #FFA07A;
        }
        
        .mobile-menu-button {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 30px;
          height: 21px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        
        .mobile-menu-button span {
          display: block;
          height: 3px;
          width: 100%;
          background-color: var(--text-color);
          border-radius: 3px;
          transition: all 0.3s ease;
        }
        
        .main-content {
          flex: 1;
          padding: 30px 0;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .footer {
          background-color: rgba(0, 0, 0, 0.8);
          border-top: 2px solid var(--border-color);
          padding: 20px 0;
          text-align: center;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
        }
        
        @media (max-width: 768px) {
          .mobile-menu-button {
            display: flex;
          }
          
          .main-nav {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background-color: rgba(0, 0, 0, 0.95);
            padding: 20px;
            border-bottom: 2px solid var(--border-color);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
          }
          
          .main-nav.open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }
          
          .main-nav ul {
            flex-direction: column;
            gap: 15px;
          }
          
          .main-nav a {
            display: block;
            padding: 12px;
          }
          
          .user-menu {
            margin-left: 0;
            padding-left: 0;
            border-left: none;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid var(--border-color);
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .username {
            margin-right: 0;
          }
          
          .logout-button {
            width: 100%;
            padding: 10px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

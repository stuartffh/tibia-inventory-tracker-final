// Página de login
// pages/login.js

import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { login } from '../services/auth';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Tibia Inventory Tracker</title>
      </Head>

      <div className="login-container">
        <div className="login-box tibia-panel fade-in">
          <div className="login-logo">
            <Image 
              src="https://www.tibiawiki.com.br/images/e/e5/Alicorn_Headguard.gif" 
              alt="Tibia Inventory Tracker" 
              width={100} 
              height={100} 
              priority
            />
          </div>
          
          <h1 className="login-title">Inventory Tracker</h1>
          
          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="username">Usuário</label>
              <input
                type="text"
                id="username"
                className="tibia-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                className="tibia-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="tibia-button login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="button-loader"></span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
        }

        .login-box {
          width: 100%;
          max-width: 400px;
          padding: 30px;
          text-align: center;
        }

        .login-logo {
          margin-bottom: 20px;
        }

        .login-title {
          font-size: 2rem;
          color: var(--accent-color);
          margin-bottom: 30px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .login-form {
          text-align: left;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 1.1rem;
          color: var(--text-color);
        }

        .login-button {
          width: 100%;
          margin-top: 10px;
          padding: 12px;
          font-size: 1.1rem;
        }

        .error-message {
          background-color: rgba(139, 0, 0, 0.3);
          border: 1px solid #8B0000;
          color: #FFA07A;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
          text-align: center;
        }

        .button-loader {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 215, 0, 0.3);
          border-radius: 50%;
          border-top-color: var(--accent-color);
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}

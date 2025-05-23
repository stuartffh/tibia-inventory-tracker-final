// Backend para o Tibia Inventory Tracker
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// Configuração
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'tibia-inventory-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Diretório de dados
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Conexão com o banco de dados
const dbPath = path.join(dataDir, 'tibia-inventory.db');
const db = new Database(dbPath);

// Inicializar banco de dados
function initializeDatabase() {
  // Criar tabelas se não existirem
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER NOT NULL,
      group_members TEXT,
      notes TEXT,
      is_sold BOOLEAN DEFAULT 0,
      sell_price REAL,
      sell_notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      sold_at TIMESTAMP,
      FOREIGN KEY (item_id) REFERENCES items (id)
    );
  `);

  // Verificar se já existe um usuário admin
  const admin = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
  
  if (!admin) {
    // Criar usuário admin padrão
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)')
      .run('admin', hashedPassword);
    console.log('Usuário admin criado com sucesso');
  }

  // Verificar se já existem itens
  const itemCount = db.prepare('SELECT COUNT(*) as count FROM items').get();
  
  if (itemCount.count === 0) {
    // Inserir itens da Primal Bag
    const primalBagItems = [
      { name: 'Alicorn Headguard', description: 'Um capacete mágico com um chifre de unicórnio', image_url: 'https://www.tibiawiki.com.br/images/e/e5/Alicorn_Headguard.gif' },
      { name: 'Alicorn Quiver', description: 'Uma aljava encantada com poderes místicos', image_url: 'https://www.tibiawiki.com.br/images/c/c3/Alicorn_Quiver.gif' },
      { name: 'Alicorn Ring', description: 'Um anel com poderes de unicórnio', image_url: 'https://www.tibiawiki.com.br/images/0/0c/Alicorn_Ring.gif' },
      { name: 'Arboreal Crown', description: 'Uma coroa feita de elementos da natureza', image_url: 'https://www.tibiawiki.com.br/images/a/a5/Arboreal_Crown.gif' },
      { name: 'Arboreal Ring', description: 'Um anel com poderes da natureza', image_url: 'https://www.tibiawiki.com.br/images/9/9c/Arboreal_Ring.gif' },
      { name: 'Arboreal Tome', description: 'Um livro antigo com conhecimentos da natureza', image_url: 'https://www.tibiawiki.com.br/images/d/d0/Arboreal_Tome.gif' },
      { name: 'Arcanomancer Folio', description: 'Um pergaminho com feitiços arcanos', image_url: 'https://www.tibiawiki.com.br/images/0/0e/Arcanomancer_Folio.gif' },
      { name: 'Arcanomancer Regalia', description: 'Vestes de um poderoso arcanista', image_url: 'https://www.tibiawiki.com.br/images/e/e5/Arcanomancer_Regalia.gif' },
      { name: 'Arcanomancer Sigil', description: 'Um símbolo de poder arcano', image_url: 'https://www.tibiawiki.com.br/images/a/a1/Arcanomancer_Sigil.gif' },
      { name: 'Spiritthorn Armor', description: 'Uma armadura feita de espinhos espirituais', image_url: 'https://www.tibiawiki.com.br/images/0/0c/Spiritthorn_Armor.gif' },
      { name: 'Spiritthorn Helmet', description: 'Um capacete feito de espinhos espirituais', image_url: 'https://www.tibiawiki.com.br/images/5/5c/Spiritthorn_Helmet.gif' },
      { name: 'Spiritthorn Ring', description: 'Um anel com poderes espirituais', image_url: 'https://www.tibiawiki.com.br/images/d/d0/Spiritthorn_Ring.gif' },
      { name: 'Abomination\'s Eye', description: 'Um olho de uma criatura abominável', image_url: 'https://www.tibiawiki.com.br/images/d/d2/Abomination%27s_Eye.gif' },
      { name: 'Abomination\'s Tail', description: 'A cauda de uma criatura abominável', image_url: 'https://www.tibiawiki.com.br/images/1/1c/Abomination%27s_Tail.gif' },
      { name: 'Abomination\'s Tongue', description: 'A língua de uma criatura abominável', image_url: 'https://www.tibiawiki.com.br/images/1/1c/Abomination%27s_Tongue.gif' },
      { name: 'Abyssador\'s Lash', description: 'Um chicote do temível Abyssador', image_url: 'https://www.tibiawiki.com.br/images/0/0c/Abyssador%27s_Lash.gif' }
    ];

    const insertItem = db.prepare('INSERT INTO items (name, description, image_url) VALUES (?, ?, ?)');
    
    for (const item of primalBagItems) {
      insertItem.run(item.name, item.description, item.image_url);
    }
    
    console.log('Itens da Primal Bag inseridos com sucesso');
  }
}

// Middleware de autenticação
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado' });
    }
    req.user = user;
    next();
  });
}

// Rotas de autenticação
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
    }
    
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    const passwordMatch = bcrypt.compareSync(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// Rota para verificar autenticação
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ 
    authenticated: true, 
    user: { id: req.user.id, username: req.user.username } 
  });
});

// Rotas para itens
app.get('/api/items', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM items ORDER BY name').all();
    res.json(items);
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// Rotas para inventário
app.get('/api/inventory', authenticateToken, (req, res) => {
  try {
    const inventory = db.prepare(`
      SELECT inv.*, i.name as item_name, i.description as item_description, i.image_url
      FROM inventory inv
      JOIN items i ON inv.item_id = i.id
      ORDER BY inv.created_at DESC
    `).all();
    res.json(inventory);
  } catch (error) {
    console.error('Erro ao buscar inventário:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

app.post('/api/inventory', authenticateToken, (req, res) => {
  try {
    const { item_id, group_members, notes } = req.body;
    
    if (!item_id) {
      return res.status(400).json({ error: 'ID do item é obrigatório' });
    }
    
    const result = db.prepare(
      'INSERT INTO inventory (item_id, group_members, notes) VALUES (?, ?, ?)'
    ).run(item_id, group_members, notes);
    
    const newItem = db.prepare(`
      SELECT inv.*, i.name as item_name, i.description as item_description, i.image_url
      FROM inventory inv
      JOIN items i ON inv.item_id = i.id
      WHERE inv.id = ?
    `).get(result.lastInsertRowid);
    
    res.status(201).json({
      message: 'Item adicionado ao inventário com sucesso',
      item: newItem
    });
  } catch (error) {
    console.error('Erro ao adicionar item ao inventário:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

app.put('/api/inventory/:id/sell', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { sell_price, sell_notes } = req.body;
    
    if (!sell_price) {
      return res.status(400).json({ error: 'Preço de venda é obrigatório' });
    }
    
    db.prepare(
      'UPDATE inventory SET is_sold = 1, sell_price = ?, sell_notes = ?, sold_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(sell_price, sell_notes, id);
    
    const updatedItem = db.prepare(`
      SELECT inv.*, i.name as item_name, i.description as item_description, i.image_url
      FROM inventory inv
      JOIN items i ON inv.item_id = i.id
      WHERE inv.id = ?
    `).get(id);
    
    res.json({
      message: 'Item marcado como vendido com sucesso',
      item: updatedItem
    });
  } catch (error) {
    console.error('Erro ao marcar item como vendido:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

app.delete('/api/inventory/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    
    db.prepare('DELETE FROM inventory WHERE id = ?').run(id);
    
    res.json({
      message: 'Item removido do inventário com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover item do inventário:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// Rotas para relatórios
app.get('/api/reports/dashboard', authenticateToken, (req, res) => {
  try {
    // Total de itens
    const totalItems = db.prepare('SELECT COUNT(*) as count FROM inventory').get();
    
    // Itens não vendidos
    const unsoldItems = db.prepare('SELECT COUNT(*) as count FROM inventory WHERE is_sold = 0').get();
    
    // Itens vendidos
    const soldItems = db.prepare('SELECT COUNT(*) as count FROM inventory WHERE is_sold = 1').get();
    
    // Valor total de vendas
    const totalValue = db.prepare('SELECT COALESCE(SUM(sell_price), 0) as total FROM inventory WHERE is_sold = 1').get();
    
    // Itens recentes
    const recentItems = db.prepare(`
      SELECT inv.*, i.name as item_name, i.image_url
      FROM inventory inv
      JOIN items i ON inv.item_id = i.id
      ORDER BY inv.created_at DESC
      LIMIT 5
    `).all();
    
    res.json({
      totalItems: totalItems.count,
      unsoldItems: unsoldItems.count,
      soldItems: soldItems.count,
      totalValue: totalValue.total || 0,
      recentItems
    });
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

app.get('/api/reports/period', authenticateToken, (req, res) => {
  try {
    const { period } = req.query;
    let dateFilter = '';
    let soldDateFilter = '';
    
    // Definir filtro de data com base no período
    if (period === 'today') {
      dateFilter = "DATE(inv.created_at) = DATE('now')";
      soldDateFilter = "DATE(inv.sold_at) = DATE('now')";
    } else if (period === 'week') {
      dateFilter = "inv.created_at >= DATE('now', '-7 days')";
      soldDateFilter = "inv.sold_at >= DATE('now', '-7 days')";
    } else if (period === 'month') {
      dateFilter = "inv.created_at >= DATE('now', '-30 days')";
      soldDateFilter = "inv.sold_at >= DATE('now', '-30 days')";
    } else {
      // Período 'all' ou qualquer outro valor
      dateFilter = "1=1"; // Sem filtro para itens dropados
      soldDateFilter = "1=1"; // Sem filtro para itens vendidos
    }
    
    // Itens dropados no período
    const droppedItems = db.prepare(`
      SELECT inv.*, i.name as item_name, i.description as item_description, i.image_url
      FROM inventory inv
      JOIN items i ON inv.item_id = i.id
      WHERE ${dateFilter}
      ORDER BY inv.created_at DESC
    `).all();
    
    // Itens vendidos no período
    const soldItems = db.prepare(`
      SELECT inv.*, i.name as item_name, i.description as item_description, i.image_url
      FROM inventory inv
      JOIN items i ON inv.item_id = i.id
      WHERE inv.is_sold = 1 AND inv.sold_at IS NOT NULL AND ${soldDateFilter}
      ORDER BY inv.sold_at DESC
    `).all();
    
    // Valor total de vendas no período
    const totalValue = db.prepare(`
      SELECT COALESCE(SUM(inv.sell_price), 0) as total
      FROM inventory inv
      WHERE inv.is_sold = 1 AND inv.sold_at IS NOT NULL AND ${soldDateFilter}
    `).get();
    
    res.json({
      period,
      droppedItems: droppedItems || [],
      soldItems: soldItems || [],
      totalValue: totalValue.total || 0
    });
  } catch (error) {
    console.error('Erro ao buscar relatório por período:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// Inicializar banco de dados e iniciar servidor
initializeDatabase();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});

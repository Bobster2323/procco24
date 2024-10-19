const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Connect to PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize database tables
async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS service_requests (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        budget TEXT NOT NULL,
        deadline TEXT NOT NULL,
        location TEXT NOT NULL,
        status TEXT NOT NULL
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS offers (
        id SERIAL PRIMARY KEY,
        request_id INTEGER REFERENCES service_requests(id),
        user_id INTEGER REFERENCES users(id),
        price NUMERIC NOT NULL,
        comment TEXT,
        status TEXT NOT NULL
      )
    `);
    console.log('Database tables initialized');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    client.release();
  }
}

initDatabase();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// User registration
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, hashedPassword, role]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET);
    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// User login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET);
      res.json({ user: { id: user.id, username: user.username, role: user.role }, token });
    } else {
      res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Submit service request
app.post('/service-request', authenticateToken, async (req, res) => {
  const { title, description, category, budget, deadline, location } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO service_requests (user_id, title, description, category, budget, deadline, location, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [req.user.id, title, description, category, budget, deadline, location, 'open']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error submitting service request:', error);
    res.status(500).json({ error: 'Error submitting service request' });
  }
});

// Get all service requests
app.get('/service-requests', authenticateToken, async (req, res) => {
  try {
    let query = 'SELECT * FROM service_requests';
    const params = [];
    if (req.user.role === 'buyer') {
      query += ' WHERE user_id = $1';
      params.push(req.user.id);
    }
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching service requests:', error);
    res.status(500).json({ error: 'Error fetching service requests' });
  }
});

// Submit offer
app.post('/offer', authenticateToken, async (req, res) => {
  const { request_id, price, comment } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO offers (request_id, user_id, price, comment, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [request_id, req.user.id, price, comment, 'pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error submitting offer:', error);
    res.status(500).json({ error: 'Error submitting offer' });
  }
});

// Get offers for a service request
app.get('/offers/:requestId', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM offers WHERE request_id = $1', [req.params.requestId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ error: 'Error fetching offers' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
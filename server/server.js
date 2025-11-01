require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const connectionString = process.env.DATABASE_URL || 'postgresql://webgis:webgis@postgres:5432/webgis';
const pool = new Pool({ connectionString, ssl: false });

// health
app.get('/', (req, res) => res.json({ ok: true }));

// get locations
app.get('/api/locations', async (req, res) => {
  try {
    const q = 'SELECT id, name, description, ST_Y(geom) AS lat, ST_X(geom) AS lon FROM locations ORDER BY created_at DESC LIMIT 500';
    const { rows } = await pool.query(q);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db_error' });
  }
});

// add location
app.post('/api/locations', async (req, res) => {
  try {
    const { name, description, lat, lon } = req.body;
    if (!name || lat === undefined || lon === undefined) return res.status(400).json({ error: 'missing_fields' });
    const q = `INSERT INTO locations (name, description, geom) VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326)) RETURNING id`;
    const { rows } = await pool.query(q, [name, description||'', lon, lat]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db_error' });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, ()=>console.log('Server listening on', port));

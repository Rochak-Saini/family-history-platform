const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:1234rochak@localhost:5432/family_history',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create tables if they don't exist
const createTables = `
CREATE TABLE IF NOT EXISTS family_members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  date_of_birth DATE NOT NULL,
  date_of_death DATE,
  image TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS parent_child_relationships (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER NOT NULL,
  child_id INTEGER NOT NULL,
  FOREIGN KEY (parent_id) REFERENCES family_members(id),
  FOREIGN KEY (child_id) REFERENCES family_members(id)
);

CREATE TABLE IF NOT EXISTS spouse_relationships (
  id SERIAL PRIMARY KEY,
  spouse1_id INTEGER NOT NULL,
  spouse2_id INTEGER NOT NULL,
  FOREIGN KEY (spouse1_id) REFERENCES family_members(id),
  FOREIGN KEY (spouse2_id) REFERENCES family_members(id)
);

CREATE TABLE IF NOT EXISTS traditions_customs (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  media TEXT
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  media TEXT
);
`;

pool.query(createTables, (err, res) => {
  if (err) {
    console.error('Error creating tables', err.stack);
  } else {
    console.log('Tables created successfully');
  }
});

// Routes

// Create a new family member
app.post('/family-members', (req, res) => {
  const { name, age, date_of_birth, date_of_death, image, description } = req.body;
  const query = `INSERT INTO family_members (name, age, date_of_birth, date_of_death, image, description)
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
  pool.query(query, [name, age, date_of_birth, date_of_death, image, description], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.rows[0].id });
  });
});

// Retrieve all family members
app.get('/family-members', (req, res) => {
  pool.query('SELECT * FROM family_members', (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(result.rows);
  });
});

// Retrieve a specific family member by ID
app.get('/family-members/:id', (req, res) => {
  const query = `SELECT * FROM family_members WHERE id = $1`;
  pool.query(query, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Family member not found" });
    }
    res.status(200).json(result.rows[0]);
  });
});

// Update a family member by ID
app.put('/family-members/:id', (req, res) => {
  const { name, age, date_of_birth, date_of_death, image, description } = req.body;
  const query = `UPDATE family_members
                 SET name = $1, age = $2, date_of_birth = $3, date_of_death = $4, image = $5, description = $6
                 WHERE id = $7`;
  pool.query(query, [name, age, date_of_birth, date_of_death, image, description, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Family member not found" });
    }
    res.status(200).json({ updatedID: req.params.id });
  });
});

// Delete a family member by ID
app.delete('/family-members/:id', (req, res) => {
  const query = `DELETE FROM family_members WHERE id = $1`;
  pool.query(query, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Family member not found" });
    }
    res.status(200).json({ deletedID: req.params.id });
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require('path');
// const sqlite3 = require('sqlite3').verbose();

// const app = express();
// const PORT = 3000;

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')));

// // Database setup
// const db = new sqlite3.Database(':memory:');

// db.serialize(() => {
//   // Create tables here
//   db.run(`
//     CREATE TABLE family_members (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL,
//       age INTEGER NOT NULL,
//       date_of_birth DATE NOT NULL,
//       date_of_death DATE,
//       image TEXT,
//       description TEXT
//     );
//   `);

//   db.run(`
//     CREATE TABLE parent_child_relationships (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       parent_id INTEGER NOT NULL,
//       child_id INTEGER NOT NULL,
//       FOREIGN KEY (parent_id) REFERENCES family_members(id),
//       FOREIGN KEY (child_id) REFERENCES family_members(id)
//     );
//   `);

//   db.run(`
//     CREATE TABLE spouse_relationships (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       spouse1_id INTEGER NOT NULL,
//       spouse2_id INTEGER NOT NULL,
//       FOREIGN KEY (spouse1_id) REFERENCES family_members(id),
//       FOREIGN KEY (spouse2_id) REFERENCES family_members(id)
//     );
//   `);

//   db.run(`
//     CREATE TABLE traditions_customs (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL,
//       description TEXT,
//       media TEXT
//     );
//   `);

//   db.run(`
//     CREATE TABLE events (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL,
//       description TEXT,
//       date DATE NOT NULL,
//       media TEXT
//     );
//   `);
// });

// // Routes

// // Create a new family member
// app.post('/family-members', (req, res) => {
//   const { name, age, date_of_birth, date_of_death, image, description } = req.body;
//   const query = `INSERT INTO family_members (name, age, date_of_birth, date_of_death, image, description)
//                  VALUES (?, ?, ?, ?, ?, ?)`;
//   db.run(query, [name, age, date_of_birth, date_of_death, image, description], function(err) {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.status(201).json({ id: this.lastID });
//   });
// });

// // Retrieve all family members
// app.get('/family-members', (req, res) => {
//   const query = `SELECT * FROM family_members`;
//   db.all(query, [], (err, rows) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.status(200).json(rows);
//   });
// });

// // Retrieve a specific family member by ID
// app.get('/family-members/:id', (req, res) => {
//   const query = `SELECT * FROM family_members WHERE id = ?`;
//   db.get(query, [req.params.id], (err, row) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     if (!row) {
//       return res.status(404).json({ error: "Family member not found" });
//     }
//     res.status(200).json(row);
//   });
// });

// // Update a family member by ID
// app.put('/family-members/:id', (req, res) => {
//   const { name, age, date_of_birth, date_of_death, image, description } = req.body;
//   const query = `UPDATE family_members
//                  SET name = ?, age = ?, date_of_birth = ?, date_of_death = ?, image = ?, description = ?
//                  WHERE id = ?`;
//   db.run(query, [name, age, date_of_birth, date_of_death, image, description, req.params.id], function(err) {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     if (this.changes === 0) {
//       return res.status(404).json({ error: "Family member not found" });
//     }
//     res.status(200).json({ updatedID: req.params.id });
//   });
// });

// // Delete a family member by ID
// app.delete('/family-members/:id', (req, res) => {
//   const query = `DELETE FROM family_members WHERE id = ?`;
//   db.run(query, [req.params.id], function(err) {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     if (this.changes === 0) {
//       return res.status(404).json({ error: "Family member not found" });
//     }
//     res.status(200).json({ deletedID: req.params.id });
//   });
// });

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Use a file-based SQLite database
const db = new sqlite3.Database('family_history.db');

db.serialize(() => {
  // Create tables if they don't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS family_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      date_of_birth DATE NOT NULL,
      date_of_death DATE,
      image TEXT,
      description TEXT
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS parent_child_relationships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parent_id INTEGER NOT NULL,
      child_id INTEGER NOT NULL,
      FOREIGN KEY (parent_id) REFERENCES family_members(id),
      FOREIGN KEY (child_id) REFERENCES family_members(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS spouse_relationships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spouse1_id INTEGER NOT NULL,
      spouse2_id INTEGER NOT NULL,
      FOREIGN KEY (spouse1_id) REFERENCES family_members(id),
      FOREIGN KEY (spouse2_id) REFERENCES family_members(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS traditions_customs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      media TEXT
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      date DATE NOT NULL,
      media TEXT
    );
  `);
});

// Routes

// Create a new family member
app.post('/family-members', (req, res) => {
  const { name, age, date_of_birth, date_of_death, image, description } = req.body;
  const query = `INSERT INTO family_members (name, age, date_of_birth, date_of_death, image, description)
                 VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(query, [name, age, date_of_birth, date_of_death, image, description], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Retrieve all family members
app.get('/family-members', (req, res) => {
  const query = `SELECT * FROM family_members`;
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
});

// Retrieve a specific family member by ID
app.get('/family-members/:id', (req, res) => {
  const query = `SELECT * FROM family_members WHERE id = ?`;
  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Family member not found" });
    }
    res.status(200).json(row);
  });
});

// Update a family member by ID
app.put('/family-members/:id', (req, res) => {
  const { name, age, date_of_birth, date_of_death, image, description } = req.body;
  const query = `UPDATE family_members
                 SET name = ?, age = ?, date_of_birth = ?, date_of_death = ?, image = ?, description = ?
                 WHERE id = ?`;
  db.run(query, [name, age, date_of_birth, date_of_death, image, description, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Family member not found" });
    }
    res.status(200).json({ updatedID: req.params.id });
  });
});

// Delete a family member by ID
app.delete('/family-members/:id', (req, res) => {
  const query = `DELETE FROM family_members WHERE id = ?`;
  db.run(query, [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Family member not found" });
    }
    res.status(200).json({ deletedID: req.params.id });
  });
});


// Routes
// (Include your existing CRUD routes here)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

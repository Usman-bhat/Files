const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Connect to SQLite database
const db = new sqlite3.Database('./data.db');

// Log errors and queries
db.on('error', (error) => {
  console.error('SQLite Error:', error.message);
});

// Route 1: Get all books
app.get('/books', (req, res) => {
  db.all('SELECT * FROM BOOKS', (err, rows) => {
    if (err) {
      console.error('Error retrieving books:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log('Retrieved all books');
    res.json(rows);
  });
});

// Route 2: Get all chapters in a book
app.get('/books/:bookId', (req, res) => {
  const { bookId } = req.params;
  db.all('SELECT * FROM POEMS WHERE book_id = ?', [bookId], (err, rows) => {
    if (err) {
      console.error('Error retrieving chapters:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log(`Retrieved chapters for bookId ${bookId}`);
    res.json(rows);
  });
});

// Route 3: Get full content of a poem
app.get('/books/:bookId/:poemId', (req, res) => {
  const { bookId, poemId } = req.params;
  db.get('SELECT * FROM POEMS WHERE _id = ?', [poemId], (err, row) => {
    if (err) {
      console.error('Error retrieving poem:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (!row) {
      console.warn(`Poem not found for poem_id ${poemId}`);
      return res.status(404).json({ error: 'Poem not found' });
    }
    console.log(`Retrieved poem for poemId ${poemId}`);
    res.json(row);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

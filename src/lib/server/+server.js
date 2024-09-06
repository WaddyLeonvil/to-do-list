import express, { json } from 'express';
import pg from 'pg';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(json());

const pool = new pg.Pool({
  user: process.env.PG_USER,
  host: 'localhost',
  database: 'to-do-list',
  password: 'thegreaton3',
  port: 5432,
});

console.log(pool);

// Create a new task
app.post('/tasks', async (req, res) => {
  const { text } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO Tasks (text, completed) VALUES ($1, $2) RETURNING *',
      [text, false],
    );

    res.status(201).json(result.rows[0]);
  } catch (eror) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Get all tasks
app.get('/tasks', async (req, res) => {
  const result = await pool.query('SELECT * FROM Tasks ORDER BY id');

  res.json(result.rows);
});

// Update a task
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;
  const result = await pool.query(
    'UPDATE tasks SET text = $1, completed = $2 WHERE id = $3 RETURNING *',
    [text, completed, id],
  );

  res.json(result.rows[0]);
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);

    if (result.rowCount > 0) {
      res.status(204).send(); // Successfully deleted, no content returned
    } else {
      res.status(404).send('Task not found'); // Task with given ID doesn't exist
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).send('Server error');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

import express, { json } from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

const pool = new pg.Pool({
  user: process.env.VITE_PG_USER,
  host: process.env.VITE_PG_HOST,
  database: process.env.VITE_PG_DATABASE,
  password: process.env.VITE_PG_PASSWORD,
  port: Number(process.env.VITE_PG_PORT || 5432),
});

console.log(pool);

// Create a new task
app.post('/tasks', async (req, res) => {
  const { firebase_uid, text } = req.body;

  if (!firebase_uid || !text) {
    return res.status(400).json({ error: 'Missing user ID or task' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO Tasks (user_id, text, completed) VALUES ($1, $2, $3) RETURNING *',
      [firebase_uid, text, false],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Get all tasks
app.get('/tasks/:firebase_uid', async (req, res) => {
  const { firebase_uid } = req.params;

  try {
    const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1 ORDER BY id', [
      firebase_uid,
    ]);

    return res.status(200).json({ tasks: result.rows });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

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

// Save user in database
app.post('/users', async (req, res) => {
  const { firebase_uid, email } = req.body;

  if (!firebase_uid || !email) {
    return res.status(400).json({ error: 'Missing firebase_uid or email' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO users (firebase_uid, email) VALUES ($1, $2) RETURNING *',
      [firebase_uid, email],
    );

    return res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error inserting user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

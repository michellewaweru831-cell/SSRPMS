import express from 'express';
import { pool } from '../config/db.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM collection_points WHERE status != "maintenance"'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authenticate, authorize('admin'), async (req, res) => {
  const { name, location, capacity_kg } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO collection_points (name, location, capacity_kg) VALUES (?, ?, ?)',
      [name, location, capacity_kg || 50]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
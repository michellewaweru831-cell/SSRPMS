import express from 'express';
import { pool } from '../config/db.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

const POINTS_PER_KG = { paper: 5, plastic: 10, metal: 15, glass: 8 };

router.post('/', authenticate, authorize('student', 'staff', 'admin'), async (req, res) => {
  const { point_id, category, weight_kg } = req.body;
  if (!point_id || !category || !weight_kg) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const points = Math.round(weight_kg * (POINTS_PER_KG[category] || 1));

  try {
    const [result] = await pool.query(
      'INSERT INTO contributions (user_id, point_id, category, weight_kg, points_awarded) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, point_id, category, weight_kg, points]
    );

    await pool.query('UPDATE users SET points = points + ? WHERE id = ?', [points, req.user.id]);

    res.status(201).json({
      message: 'Contribution logged',
      contributionId: result.insertId,
      pointsAwarded: points
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/my', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, cp.name AS point_name
       FROM contributions c
       JOIN collection_points cp ON c.point_id = cp.id
       WHERE c.user_id = ?
       ORDER BY c.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', authenticate, authorize('admin', 'collector'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, u.name AS user_name, cp.name AS point_name
       FROM contributions c
       JOIN users u ON c.user_id = u.id
       JOIN collection_points cp ON c.point_id = cp.id
       ORDER BY c.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
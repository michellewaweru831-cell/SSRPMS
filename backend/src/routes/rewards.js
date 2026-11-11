import express from 'express';
import { pool } from '../config/db.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM rewards WHERE active = TRUE');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authenticate, authorize('admin'), async (req, res) => {
  const { name, description, points_cost, stock } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO rewards (name, description, points_cost, stock) VALUES (?, ?, ?, ?)',
      [name, description, points_cost, stock || 0]
    );
    res.status(201).json({ message: 'Reward created', rewardId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/redeem/:rewardId', authenticate, async (req, res) => {
  const rewardId = req.params.rewardId;
  const userId = req.user.id;

  try {
    const [rewardRows] = await pool.query(
      'SELECT * FROM rewards WHERE id = ? AND active = TRUE',
      [rewardId]
    );
    if (!rewardRows.length) return res.status(404).json({ message: 'Reward not found' });

    const reward = rewardRows[0];
    const [userRows] = await pool.query('SELECT points FROM users WHERE id = ?', [userId]);
    const user = userRows[0];

    if (user.points < reward.points_cost) {
      return res.status(400).json({ message: 'Insufficient points' });
    }
    if (reward.stock <= 0) {
      return res.status(400).json({ message: 'Out of stock' });
    }

    await pool.query('UPDATE users SET points = points - ? WHERE id = ?', [reward.points_cost, userId]);
    await pool.query('UPDATE rewards SET stock = stock - 1 WHERE id = ?', [rewardId]);

    const [result] = await pool.query(
      'INSERT INTO redemptions (user_id, reward_id, points_spent) VALUES (?, ?, ?)',
      [userId, rewardId, reward.points_cost]
    );

    res.status(201).json({ message: 'Reward redeemed', redemptionId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/my-redemptions', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, rw.name AS reward_name
       FROM redemptions r
       JOIN rewards rw ON r.reward_id = rw.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
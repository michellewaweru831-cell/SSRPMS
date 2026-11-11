import express from 'express';
import { pool } from '../config/db.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    let query = `
      SELECT s.*, cp.name AS point_name, u.name AS collector_name
      FROM schedules s
      JOIN collection_points cp ON s.point_id = cp.id
      LEFT JOIN users u ON s.collector_id = u.id
    `;
    const params = [];

    if (req.user.role === 'collector') {
      query += ' WHERE s.collector_id = ?';
      params.push(req.user.id);
    }

    query += ' ORDER BY s.scheduled_date, s.scheduled_time';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authenticate, authorize('admin'), async (req, res) => {
  const { point_id, collector_id, scheduled_date, scheduled_time, notes } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO schedules (point_id, collector_id, scheduled_date, scheduled_time, notes) VALUES (?, ?, ?, ?, ?)',
      [point_id, collector_id, scheduled_date, scheduled_time, notes]
    );
    res.status(201).json({ message: 'Schedule created', scheduleId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/status', authenticate, authorize('collector', 'admin'), async (req, res) => {
  const { status, notes } = req.body;
  try {
    await pool.query(
      'UPDATE schedules SET status = ?, notes = COALESCE(?, notes) WHERE id = ?',
      [status, notes, req.params.id]
    );
    res.json({ message: 'Schedule updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
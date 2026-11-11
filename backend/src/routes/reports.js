import express from 'express';
import { pool } from '../config/db.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/summary', authenticate, authorize('admin', 'collector'), async (req, res) => {
  try {
    const [totals] = await pool.query(
      `SELECT COUNT(*) AS total_contributions,
              SUM(weight_kg) AS total_weight,
              SUM(points_awarded) AS total_points
       FROM contributions`
    );

    const [byCategory] = await pool.query(
      `SELECT category, COUNT(*) AS count, SUM(weight_kg) AS weight
       FROM contributions
       GROUP BY category`
    );

    const [byPoint] = await pool.query(
      `SELECT cp.name, COUNT(c.id) AS count, SUM(c.weight_kg) AS weight
       FROM collection_points cp
       LEFT JOIN contributions c ON c.point_id = cp.id
       GROUP BY cp.id`
    );

    const [userParticipation] = await pool.query(
      `SELECT COUNT(DISTINCT user_id) AS active_users FROM contributions`
    );

    res.json({
      totals: totals[0],
      byCategory,
      byPoint,
      userParticipation: userParticipation[0]
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
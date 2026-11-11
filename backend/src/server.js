import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import contributionRoutes from './routes/contributions.js';
import rewardRoutes from './routes/rewards.js';
import scheduleRoutes from './routes/schedules.js';
import pointRoutes from './routes/points.js';
import reportRoutes from './routes/reports.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/points', pointRoutes);
app.use('/api/reports', reportRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
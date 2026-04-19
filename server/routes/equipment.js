import express from 'express';
import Equipment from '../models/Equipment.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const equipment = await Equipment.find({ isActive: true });
    res.status(200).json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

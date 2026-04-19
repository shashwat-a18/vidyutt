import express from 'express';
import ShiftLog from '../models/ShiftLog.js';

const router = express.Router();

router.get('/:shiftId', async (req, res) => {
  try {
    const shiftLog = await ShiftLog.findById(req.params.shiftId);
    if (!shiftLog) {
      return res.status(404).json({ message: 'Shift log not found' });
    }
    res.status(200).json(shiftLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

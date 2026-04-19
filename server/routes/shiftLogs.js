import express from 'express';
import * as shiftLogController from '../controllers/shiftLogController.js';

const router = express.Router();

router.post('/', shiftLogController.createShiftLog);
router.get('/', shiftLogController.getShiftLogs);
router.get('/latest', shiftLogController.getLatestShiftLog);
router.get('/:id', shiftLogController.getShiftLogById);

export default router;

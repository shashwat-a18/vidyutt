import ShiftLog from '../models/ShiftLog.js';
import { detectAnomalies } from '../utils/anomalyDetector.js';

export const createShiftLog = async (req, res) => {
  try {
    const shiftData = req.body;

    // Run anomaly detection
    const anomalies = detectAnomalies(shiftData);
    shiftData.anomalies = anomalies;

    const shiftLog = new ShiftLog(shiftData);
    const savedShiftLog = await shiftLog.save();

    res.status(201).json(savedShiftLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getShiftLogs = async (req, res) => {
  try {
    const { date, shiftType, hasAnomalies, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    if (shiftType) {
      filter.shiftType = shiftType;
    }

    if (hasAnomalies === 'true') {
      filter.anomalies = { $exists: true, $ne: [] };
    } else if (hasAnomalies === 'false') {
      filter.$or = [
        { anomalies: { $exists: false } },
        { anomalies: { $eq: [] } },
      ];
    }

    const skip = (page - 1) * limit;
    const shiftLogs = await ShiftLog.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ShiftLog.countDocuments(filter);

    res.status(200).json({
      data: shiftLogs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getShiftLogById = async (req, res) => {
  try {
    const shiftLog = await ShiftLog.findById(req.params.id);
    if (!shiftLog) {
      return res.status(404).json({ message: 'Shift log not found' });
    }
    res.status(200).json(shiftLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLatestShiftLog = async (req, res) => {
  try {
    const latestShiftLog = await ShiftLog.findOne().sort({ date: -1 });
    if (!latestShiftLog) {
      return res.status(404).json({ message: 'No shift logs found' });
    }
    res.status(200).json(latestShiftLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

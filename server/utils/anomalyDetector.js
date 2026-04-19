import { sf6TempCorrection } from './sf6TempCorrection.js';

export const detectAnomalies = (shiftData) => {
  const anomalies = [];

  // Check transformer thresholds (OTI and WTI)
  if (shiftData.transformers && Array.isArray(shiftData.transformers)) {
    shiftData.transformers.forEach((transformer) => {
      // OTI checks
      if (transformer.OTI !== undefined && transformer.OTI !== null) {
        if (transformer.OTI >= 95) {
          anomalies.push(
            `${transformer.name}: OTI CRITICAL — Trip threshold (${transformer.OTI}°C)`
          );
        } else if (transformer.OTI >= 85) {
          anomalies.push(
            `${transformer.name}: OTI HIGH (${transformer.OTI}°C) — Alarm threshold exceeded`
          );
        }
      }

      // WTI checks
      if (transformer.WTI !== undefined && transformer.WTI !== null) {
        if (transformer.WTI >= 100) {
          anomalies.push(
            `${transformer.name}: WTI CRITICAL — Trip threshold (${transformer.WTI}°C)`
          );
        } else if (transformer.WTI >= 90) {
          anomalies.push(
            `${transformer.name}: WTI HIGH (${transformer.WTI}°C) — Alarm threshold exceeded`
          );
        }
      }
    });
  }

  // Check SF6 breaker pressure with temperature correction
  if (shiftData.breakers && Array.isArray(shiftData.breakers)) {
    shiftData.breakers.forEach((breaker) => {
      if (
        breaker.SF6Pressure !== undefined &&
        breaker.SF6Pressure !== null &&
        breaker.ambientTemp !== undefined &&
        breaker.ambientTemp !== null
      ) {
        const correctedPressure = sf6TempCorrection(
          breaker.SF6Pressure,
          breaker.ambientTemp
        );

        // Update corrected status
        if (correctedPressure < 4.8) {
          breaker.SF6CorrectedStatus = 'Lockout';
          anomalies.push(
            `${breaker.name}: SF6 CRITICAL — LOCKOUT LEVEL (corrected: ${correctedPressure.toFixed(2)} bar)`
          );
        } else if (correctedPressure < 5.2) {
          breaker.SF6CorrectedStatus = 'Alarm';
          anomalies.push(
            `${breaker.name}: SF6 LOW (corrected for temperature: ${correctedPressure.toFixed(2)} bar)`
          );
        } else {
          breaker.SF6CorrectedStatus = 'Normal';
        }
      }
    });
  }

  // Check battery float voltage
  if (shiftData.battery && shiftData.battery.floatVoltage !== undefined) {
    const floatVoltage = shiftData.battery.floatVoltage;
    if (floatVoltage > 126) {
      anomalies.push(
        `Battery Bank: Float voltage HIGH (${floatVoltage}V) — Check charger`
      );
    } else if (floatVoltage < 120) {
      anomalies.push(`Battery Bank: Float voltage LOW (${floatVoltage}V)`);
    }
  }

  // Check bus voltage tolerance (±5% of nominal)
  if (shiftData.busReadings) {
    if (shiftData.busReadings.bus220kV !== undefined) {
      // Nominal 220 kV, range 209 to 231
      const voltage220 = shiftData.busReadings.bus220kV;
      if (voltage220 < 209 || voltage220 > 231) {
        anomalies.push(
          `220 kV Bus: Voltage out of tolerance (${voltage220} kV, acceptable range: 209–231 kV)`
        );
      }
    }

    if (shiftData.busReadings.bus132kV !== undefined) {
      // Nominal 132 kV, range 125.4 to 138.6
      const voltage132 = shiftData.busReadings.bus132kV;
      if (voltage132 < 125.4 || voltage132 > 138.6) {
        anomalies.push(
          `132 kV Bus: Voltage out of tolerance (${voltage132} kV, acceptable range: 125.4–138.6 kV)`
        );
      }
    }

    // Check frequency (50 Hz nominal, flag deviation outside 49.5–50.5)
    if (shiftData.busReadings.frequency !== undefined) {
      const frequency = shiftData.busReadings.frequency;
      if (frequency < 49.5 || frequency > 50.5) {
        anomalies.push(
          `Grid frequency deviation (${frequency} Hz, nominal: 50 Hz)`
        );
      }
    }
  }

  return anomalies;
};

// SF6 Temperature Correction Formula (client-side)
// correctedPressure = measuredPressure * (273 + 20) / (273 + ambientTemp)
// Reference temperature is 20°C
export const sf6TempCorrection = (measuredPressure, ambientTemp) => {
  if (!measuredPressure || !ambientTemp) return null;
  const referenceTemp = 20;
  const corrected = measuredPressure * ((273 + referenceTemp) / (273 + ambientTemp));
  return parseFloat(corrected.toFixed(3));
};

// Determine SF6 status based on corrected pressure
export const determineSF6Status = (correctedPressure) => {
  if (correctedPressure < 4.8) return 'Lockout';
  if (correctedPressure < 5.2) return 'Alarm';
  return 'Normal';
};

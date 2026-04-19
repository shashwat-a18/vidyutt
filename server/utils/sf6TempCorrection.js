// SF6 Temperature Correction Formula
// correctedPressure = measuredPressure * (273 + 20) / (273 + ambientTemp)
// Reference temperature is 20°C
export const sf6TempCorrection = (measuredPressure, ambientTemp) => {
  const referenceTemp = 20;
  const corrected = measuredPressure * ((273 + referenceTemp) / (273 + ambientTemp));
  return parseFloat(corrected.toFixed(3));
};

export const roundToIELTSBand = (score) => {
  return Math.round(score * 2) / 2;
};

export const calculateOverallBand = (scores) => {
  if (scores.length === 0) return 0;
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return roundToIELTSBand(avg);
};

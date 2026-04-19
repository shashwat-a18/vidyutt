const AnomalyBadge = ({ cx, cy, value, threshold }) => {
  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill="#ef4444" />
      <circle cx={cx} cy={cy} r={4} fill="#fca5a5" />
      <title>{`Value: ${value.toFixed(2)}, Threshold: ${threshold}`}</title>
    </g>
  );
};

export default AnomalyBadge;

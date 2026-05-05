export default function ScorePill({ score = 0, band }) {
  const resolvedBand = band || (score >= 70 ? 'good' : score >= 40 ? 'moderate' : 'poor');

  return (
    <span className={`score-pill score-${resolvedBand}`}>
      <strong>{score}</strong>
      <span>/100</span>
    </span>
  );
}

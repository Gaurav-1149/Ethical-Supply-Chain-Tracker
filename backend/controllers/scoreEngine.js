const LOW_DISTANCE_KM = 500;

export function calculateEthicalScore(supplyChain = []) {
  if (!supplyChain.length) return 0;

  const total = supplyChain.reduce((sum, step) => {
    const flags = step.ethicalFlags || {};
    const stepScore =
      (flags.fairWages ? 30 : 0) +
      (flags.ecoFriendly ? 30 : 0) +
      (Number(step.transportDistance) <= LOW_DISTANCE_KM || flags.lowCarbon ? 20 : 0) +
      (flags.sustainablePractices ? 20 : 0);

    return sum + stepScore;
  }, 0);

  return Math.round(total / supplyChain.length);
}

export function getScoreBand(score) {
  if (score >= 70) return 'good';
  if (score >= 40) return 'moderate';
  return 'poor';
}

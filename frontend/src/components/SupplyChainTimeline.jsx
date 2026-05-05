import { MapPin } from 'lucide-react';
import Badge from './Badge.jsx';

export default function SupplyChainTimeline({ steps = [], selectedStepId, onSelectStep }) {
  if (!steps.length) {
    return <div className="empty-state">No supply-chain steps have been published yet.</div>;
  }

  return (
    <div className="timeline" aria-label="Supply chain timeline">
      {steps.map((step, index) => (
        <button
          className={`timeline-step ${selectedStepId === step._id ? 'active' : ''}`}
          type="button"
          key={step._id || `${step.stepName}-${index}`}
          onClick={() => onSelectStep(step)}
        >
          <span className="timeline-index">{index + 1}</span>
          <strong>{step.stepName}</strong>
          <span className="timeline-location">
            <MapPin size={14} />
            {step.location}
          </span>
        </button>
      ))}
    </div>
  );
}

export function StepDetails({ step }) {
  if (!step) {
    return <div className="empty-state">Select a step to inspect its ethical indicators.</div>;
  }

  const flags = step.ethicalFlags || {};
  const verified = flags.fairWages || flags.ecoFriendly || flags.lowCarbon || flags.sustainablePractices;

  return (
    <section className="details-panel">
      <div>
        <p className="eyebrow">Selected step</p>
        <h3>{step.stepName}</h3>
        <p>{step.description}</p>
      </div>
      <dl className="detail-grid">
        <div>
          <dt>Location</dt>
          <dd>{step.location}</dd>
        </div>
        <div>
          <dt>Transport</dt>
          <dd>{Number(step.transportDistance).toLocaleString()} km</dd>
        </div>
      </dl>
      <div className="badge-row">
        <Badge type="fairWages" active={flags.fairWages}>Fair Wages</Badge>
        <Badge type="ecoFriendly" active={flags.ecoFriendly}>Eco-Friendly</Badge>
        <Badge type="lowCarbon" active={flags.lowCarbon}>Low Carbon</Badge>
        <Badge type="sustainablePractices" active={flags.sustainablePractices}>Sustainable</Badge>
        {!verified ? <Badge type="notVerified" active={false}>Not Verified</Badge> : null}
      </div>
    </section>
  );
}

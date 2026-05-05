import { Check, Leaf, ShieldAlert, Truck } from 'lucide-react';

const iconMap = {
  fairWages: Check,
  ecoFriendly: Leaf,
  lowCarbon: Truck,
  sustainablePractices: Check,
  notVerified: ShieldAlert
};

export default function Badge({ type, active, children }) {
  const Icon = iconMap[type] || Check;

  return (
    <span className={`badge ${active ? 'badge-good' : 'badge-muted'}`}>
      <Icon size={14} aria-hidden="true" />
      {children}
    </span>
  );
}

import { Building, Check, GraduationCap, ShieldCheck, Users } from 'lucide-react';
import { cn } from '@/lib/cn';
import { ProductFrame } from './ProductFrame';
import ui from './ProductUI.module.css';
import styles from './CommunityPreviews.module.css';

const week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

/** Recurring commute: the same route, matched every weekday. */
export function CommuteWeek() {
  return (
    <ProductFrame label="Preview of a recurring commute: Gurugram to Noida at 08:30, matched with the same verified co-commuters Monday to Friday.">
      <div className={ui.bar}>
        <span className={ui.label}>Your commute</span>
        <span className={ui.small}>Every weekday</span>
      </div>
      <div>
        <p className={ui.strong}>Gurugram → Noida</p>
        <p className={ui.muted}>Leaves 08:30 · back 18:45</p>
      </div>
      <ol className={styles.week}>
        {week.map((day) => (
          <li key={day} className={styles.day}>
            <span className={styles.dayName}>{day}</span>
            <span className={styles.dayCheck}>
              <Check size={16} strokeWidth={2.5} />
            </span>
          </li>
        ))}
      </ol>
      <div className={ui.divider} />
      <span className={ui.check}>
        <Users size={18} className={ui.checkIcon} /> Same three co-commuters, all verified
      </span>
    </ProductFrame>
  );
}

/** Company → employees → a private, verified mobility network. */
export function OrgFlow() {
  const tiers = [
    { icon: <Building size={20} />, title: 'Your company', text: 'Sets up a private community' },
    { icon: <Users size={20} />, title: 'Employees', text: 'Join with a verified work email' },
    { icon: <ShieldCheck size={20} />, title: 'Verified mobility network', text: 'Shared commutes, billed centrally' },
  ];
  return (
    <ProductFrame
      caption="How a company network is set up"
      label="Diagram: a company sets up a private community, employees join with a verified work email, and together they form a verified mobility network with shared commutes and central billing."
    >
      <ol className={styles.flow}>
        {tiers.map((tier, index) => (
          <li key={tier.title} className={cn(styles.tier, index === tiers.length - 1 && styles.tierFinal)}>
            <span className={styles.tierIcon}>{tier.icon}</span>
            <span>
              <span className={styles.tierTitle}>{tier.title}</span>
              <span className={styles.tierText}>{tier.text}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className={styles.members} aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className={cn(styles.member, i % 5 === 0 && styles.memberDriver)} />
        ))}
      </div>
    </ProductFrame>
  );
}

/** Abstract campus with shared pickup points and a campus loop. */
export function CampusMap() {
  return (
    <ProductFrame label="Illustration of a campus with three shared pickup points — main gate, library and hostels — connected by a campus loop route.">
      <div className={ui.bar}>
        <span className={ui.label}>Campus community</span>
        <span className={cn(ui.small, styles.campusBadge)}>
          <GraduationCap size={14} /> Students & staff only
        </span>
      </div>
      <svg viewBox="0 0 400 240" className={styles.campus}>
        <rect x="40" y="36" width="92" height="56" rx="10" className={styles.block} />
        <rect x="160" y="28" width="120" height="44" rx="10" className={styles.block} />
        <rect x="300" y="40" width="64" height="84" rx="10" className={styles.block} />
        <rect x="52" y="128" width="80" height="72" rx="10" className={styles.block} />
        <rect x="170" y="150" width="104" height="58" rx="10" className={styles.green} />
        <rect x="296" y="150" width="72" height="54" rx="10" className={styles.block} />
        <path d="M24 112 C 110 104, 150 124, 200 116 S 300 96, 380 138" className={styles.loop} />
        <path d="M24 112 C 110 104, 150 124, 200 116 S 300 96, 380 138" className={styles.loopFlow} />
        {[
          { x: 40, y: 111, label: 'Main gate' },
          { x: 200, y: 116, label: 'Library' },
          { x: 362, y: 129, label: 'Hostels' },
        ].map((pin) => (
          <g key={pin.label}>
            <circle cx={pin.x} cy={pin.y} r="14" className={styles.pinHalo} />
            <circle cx={pin.x} cy={pin.y} r="6" className={styles.pin} />
            <text x={pin.x} y={pin.y - 22} textAnchor="middle" className={styles.pinLabel}>
              {pin.label}
            </text>
          </g>
        ))}
      </svg>
      <span className={ui.check}>
        <ShieldCheck size={18} className={ui.checkIcon} /> Pickups at well-lit, shared points
      </span>
    </ProductFrame>
  );
}

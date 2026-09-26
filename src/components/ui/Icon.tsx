import {
  Activity,
  Armchair,
  BadgeCheck,
  BellRing,
  BrainCircuit,
  Briefcase,
  Building,
  CalendarCheck,
  CarFront,
  ChartNoAxesColumn,
  CircleCheck,
  Clock,
  Compass,
  CreditCard,
  Eye,
  FileText,
  FingerprintPattern,
  GraduationCap,
  Handshake,
  Headset,
  KeyRound,
  Leaf,
  LifeBuoy,
  Lock,
  LockKeyhole,
  MapPin,
  MapPinned,
  MessagesSquare,
  PhoneCall,
  Radar,
  Receipt,
  Repeat,
  Route,
  ScanFace,
  School,
  Search,
  ServerCog,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Smartphone,
  Sparkles,
  Star,
  UserCog,
  UserRoundCheck,
  Users,
  Wallet,
  Waypoints,
  type LucideIcon,
} from 'lucide-react';

/**
 * The brand icon set: Lucide, 1.75px stroke, rounded joins. Content refers to icons by name
 * so data stays serialisable between server and client components.
 */
export const icons = {
  activity: Activity,
  armchair: Armchair,
  'badge-check': BadgeCheck,
  'bell-ring': BellRing,
  brain: BrainCircuit,
  briefcase: Briefcase,
  building: Building,
  calendar: CalendarCheck,
  car: CarFront,
  chart: ChartNoAxesColumn,
  'circle-check': CircleCheck,
  clock: Clock,
  compass: Compass,
  'credit-card': CreditCard,
  eye: Eye,
  file: FileText,
  fingerprint: FingerprintPattern,
  'graduation-cap': GraduationCap,
  handshake: Handshake,
  headset: Headset,
  key: KeyRound,
  leaf: Leaf,
  'life-buoy': LifeBuoy,
  lock: Lock,
  'lock-keyhole': LockKeyhole,
  'map-pin': MapPin,
  'map-pinned': MapPinned,
  messages: MessagesSquare,
  phone: PhoneCall,
  radar: Radar,
  receipt: Receipt,
  repeat: Repeat,
  route: Route,
  'scan-face': ScanFace,
  school: School,
  search: Search,
  server: ServerCog,
  share: Share2,
  'shield-alert': ShieldAlert,
  'shield-check': ShieldCheck,
  siren: Siren,
  smartphone: Smartphone,
  sparkles: Sparkles,
  star: Star,
  'user-cog': UserCog,
  'user-check': UserRoundCheck,
  users: Users,
  wallet: Wallet,
  waypoints: Waypoints,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  label?: string;
}

export function Icon({ name, size = 20, className, label }: IconProps) {
  const Component = icons[name];
  return (
    <Component
      size={size}
      strokeWidth={1.75}
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      focusable="false"
    />
  );
}

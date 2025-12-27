import { 
  Bot, 
  Wrench, 
  Target, 
  Rocket, 
  BookOpen,
  Code2,
  Mail,
  Calendar,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  Cpu,
  Network,
  Database,
  Shield,
  Briefcase,
  Lightbulb,
  Store,
  Building2,
  Heart
} from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

const iconMap = {
  'bot': Bot,
  'wrench': Wrench,
  'target': Target,
  'rocket': Rocket,
  'bookOpen': BookOpen,
  'code': Code2,
  'mail': Mail,
  'calendar': Calendar,
  'check': CheckCircle2,
  'sparkles': Sparkles,
  'trendingUp': TrendingUp,
  'users': Users,
  'dollar': DollarSign,
  'cart': ShoppingCart,
  'cpu': Cpu,
  'network': Network,
  'database': Database,
  'shield': Shield,
  'briefcase': Briefcase,
  'lightbulb': Lightbulb,
  'store': Store,
  'building': Building2,
  'heart': Heart
};

export const IconWrapper: React.FC<IconProps> = ({ name, className = '', size = 24 }) => {
  const IconComponent = iconMap[name as keyof typeof iconMap];
  
  if (!IconComponent) {
    return null;
  }

  return <IconComponent className={className} size={size} />;
};

export default IconWrapper;

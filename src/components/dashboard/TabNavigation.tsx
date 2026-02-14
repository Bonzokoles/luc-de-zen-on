import { Bot, LayoutDashboard, Wrench } from 'lucide-react';

interface TabNavigationProps {
  currentPath?: string;
}

const TabNavigation = ({ currentPath = '/' }: TabNavigationProps) => {
  const tabs = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Narzędzia', path: '/narzedzia', icon: Wrench },
    { label: 'Asystent AI', path: '/asystent-ai', icon: Bot },
  ];

  return (
    <nav className="flex flex-col gap-2 bg-business-surface/50 backdrop-blur-sm p-4 rounded-lg border border-business-border">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentPath === tab.path;
        
        return (
          <a
            key={tab.path}
            href={tab.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${
              isActive
                ? 'bg-primary-600 text-white shadow-lg'
                : 'text-business-text hover:bg-business-border hover:text-business-accent'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </a>
        );
      })}
    </nav>
  );
};

export default TabNavigation;

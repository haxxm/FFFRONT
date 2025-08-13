import React from 'react';
import { Home, Calendar, MessageSquare, Bell, Settings } from 'lucide-react';
import { Button } from './ui/button';

const BottomNavigation: React.FC = () => {
  const handleNavigation = (screen: string) => {
    switch (screen) {
      case 'home':
        window.dispatchEvent(new CustomEvent('navigate-community'));
        break;
      case 'calendar':
        window.dispatchEvent(new CustomEvent('navigate-calendar'));
        break;
      case 'community':
        window.dispatchEvent(new CustomEvent('navigate-community'));
        break;
      case 'community-boards':
        window.dispatchEvent(new CustomEvent('navigate-community'));
        break;
      case 'chat':
        window.dispatchEvent(new CustomEvent('navigate-community'));
        break;
      case 'settings':
        window.dispatchEvent(new CustomEvent('navigate-community'));
        break;
    }
  };

  return null;
};

export default BottomNavigation;
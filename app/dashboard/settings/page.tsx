'use client';

import { useState } from 'react';
import { SettingsSidebar } from '@/components/settings/settings-sidebar';
import { DefaultMessagesSettings } from '@/components/settings/default-messages-settings';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('default-messages');

  return (
    <div className="h-full flex gap-6">
      {/* Sidebar */}
      <SettingsSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeSection === 'default-messages' && <DefaultMessagesSettings />}
      </div>
    </div>
  );
}

import React from 'react';
// import VoiceAvatarComponent from './voice-ai/VoiceAvatarComponent';

interface QuickVoiceAIProps {
  variant?: 'hero' | 'compact' | 'floating';
}

export default function QuickVoiceAI({ variant = 'compact' }: QuickVoiceAIProps) {
  return (
    <div className="quick-voice-ai">
      <p>Voice AI temporarily disabled</p>
    </div>
  );
}

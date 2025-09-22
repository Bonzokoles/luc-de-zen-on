import React from 'react';
import { VoiceAIComponent } from './voice-ai/VoiceAIComponent';

interface QuickVoiceAIProps {
  variant?: 'hero' | 'compact' | 'floating';
}

export default function QuickVoiceAI({ variant = 'compact' }: QuickVoiceAIProps) {
  return (
    <div className="quick-voice-ai">
      <VoiceAIComponent variant={variant} />
    </div>
  );
}

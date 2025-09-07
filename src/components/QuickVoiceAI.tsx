import React from 'react';
import VoiceAvatarComponent from './voice-ai/VoiceAvatarComponent';

interface QuickVoiceAIProps {
  variant?: 'hero' | 'compact' | 'floating';
}

export default function QuickVoiceAI({ variant = 'compact' }: QuickVoiceAIProps) {
  return (
    <VoiceAvatarComponent 
      variant={variant} 
      avatarSrc="/avatar.jpg"
      avatarType="image"
    />
  );
}

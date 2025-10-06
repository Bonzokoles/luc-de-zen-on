import { VoiceAIInterface } from './voiceAiAPI';

declare global {
  interface Window {
    VoiceAIInterface: VoiceAIInterface;
    openWorkerPopup: (workerType: string, url: string, title: string) => void;
  }
}

// Initialize VoiceAIInterface globally if not already done
const voiceAIInterfaceInstance = new VoiceAIInterface();

export function openVoiceAIPopup() {
  console.log("🎤 Opening Voice AI Communication Popup");
  if (typeof window.openWorkerPopup === 'function') {
    const prompt = document.getElementById("voiceAiPrompt")?.value || "";
    window.openWorkerPopup("voice-ai", "https://mybonzo.com/api/polaczek/voice-ai", "Voice AI Assistant");
  } else {
    console.warn("Worker popup functions not yet loaded, trying direct Voice AI interface");
    if (typeof window.VoiceAIInterface !== 'undefined') {
      voiceAIInterfaceInstance.quickTranscribe();
    } else {
      alert("Voice AI interface nie jest jeszcze załadowane. Spróbuj ponownie za chwilę.");
    }
  }
}

export function quickSynthesize() {
  console.log("🔊 Quick Text Synthesis");
  const text = (document.getElementById("voiceAiPrompt") as HTMLInputElement)?.value;
  if (!text || text.trim().length === 0) {
    alert("Wprowadź tekst do syntezy w polu powyżej");
    return;
  }
  
  if (typeof window.VoiceAIInterface !== 'undefined') {
    voiceAIInterfaceInstance.quickSynthesize(text);
  } else {
    console.warn("Voice AI interface not loaded yet");
    alert("Voice AI interface nie jest jeszcze załadowane. Spróbuj ponownie za chwilę.");
  }
}

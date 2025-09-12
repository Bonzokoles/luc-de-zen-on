// Audio Worklet Processor for Voice AI
// This file should be placed in public/audio-processor.js for browser access

class VoiceAIProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 4096;
    this.buffer = new Float32Array(this.bufferSize);
    this.bufferIndex = 0;
    this.isRecording = false;
    
    // Voice Activity Detection parameters
    this.vadThreshold = 0.01;
    this.vadCount = 0;
    this.vadRequired = 10; // frames
    
    // Audio metrics
    this.rmsHistory = new Array(30).fill(0);
    this.peakHistory = new Array(30).fill(0);
    
    this.port.onmessage = (event) => {
      if (event.data.command === 'start') {
        this.isRecording = true;
      } else if (event.data.command === 'stop') {
        this.isRecording = false;
      }
    };
  }
  
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || !input.length) return true;
    
    const inputChannel = input[0];
    if (!inputChannel) return true;
    
    // Calculate audio metrics
    let sum = 0;
    let peak = 0;
    
    for (let i = 0; i < inputChannel.length; i++) {
      const sample = inputChannel[i];
      sum += sample * sample;
      peak = Math.max(peak, Math.abs(sample));
      
      if (this.isRecording) {
        this.buffer[this.bufferIndex] = sample;
        this.bufferIndex++;
        
        if (this.bufferIndex >= this.bufferSize) {
          // Send buffer to main thread
          this.port.postMessage({
            type: 'audioData',
            buffer: this.buffer.slice(),
            timestamp: currentTime
          });
          this.bufferIndex = 0;
        }
      }
    }
    
    const rms = Math.sqrt(sum / inputChannel.length);
    
    // Voice Activity Detection
    const isVoiceActive = rms > this.vadThreshold;
    if (isVoiceActive) {
      this.vadCount++;
    } else {
      this.vadCount = Math.max(0, this.vadCount - 1);
    }
    
    const voiceDetected = this.vadCount > this.vadRequired;
    
    // Update metrics history
    this.rmsHistory.shift();
    this.rmsHistory.push(rms);
    this.peakHistory.shift();
    this.peakHistory.push(peak);
    
    // Calculate smoothed metrics
    const avgRms = this.rmsHistory.reduce((a, b) => a + b) / this.rmsHistory.length;
    const avgPeak = this.peakHistory.reduce((a, b) => a + b) / this.peakHistory.length;
    
    // Send metrics to main thread
    this.port.postMessage({
      type: 'metrics',
      volume: Math.min(100, avgRms * 1000),
      rms: avgRms,
      peak: avgPeak,
      voiceActive: voiceDetected,
      timestamp: currentTime
    });
    
    return true;
  }
}

registerProcessor('voice-ai-processor', VoiceAIProcessor);

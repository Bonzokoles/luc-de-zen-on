import React, { useEffect, useState } from 'react';

type SupportInfo = {
    secureContext: boolean;
    hasMediaDevices: boolean;
    hasGetUserMedia: boolean;
    mediaRecorderSupported: boolean;
    supportedMimeTypes: string[];
    permissionState?: 'granted' | 'denied' | 'prompt' | 'unknown';
    error?: string;
};

const CANDIDATES = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4',
    'audio/wav'
];

export default function VoiceDiagnostics() {
    const [info, setInfo] = useState<SupportInfo>({
        secureContext: false,
        hasMediaDevices: false,
        hasGetUserMedia: false,
        mediaRecorderSupported: false,
        supportedMimeTypes: [],
        permissionState: 'unknown',
    });

    const [testResult, setTestResult] = useState<string>('');

    useEffect(() => {
        const secureContext = (typeof window !== 'undefined') && (window.isSecureContext || location.hostname === 'localhost');
        const hasMediaDevices = !!(navigator as any)?.mediaDevices;
        const hasGetUserMedia = !!(navigator as any)?.mediaDevices?.getUserMedia;
        const mediaRecorderSupported = typeof (window as any).MediaRecorder !== 'undefined';
        const supportedMimeTypes: string[] = [];

        if (mediaRecorderSupported && (window as any).MediaRecorder?.isTypeSupported) {
            for (const t of CANDIDATES) {
                try {
                    if ((window as any).MediaRecorder.isTypeSupported(t)) {
                        supportedMimeTypes.push(t);
                    }
                } catch { }
            }
        }

        const base: SupportInfo = {
            secureContext,
            hasMediaDevices,
            hasGetUserMedia,
            mediaRecorderSupported,
            supportedMimeTypes,
            permissionState: 'unknown'
        };

        // Check microphone permission if available
        if ((navigator as any).permissions?.query) {
            (navigator as any).permissions
                .query({ name: 'microphone' as any })
                .then((res: any) => setInfo({ ...base, permissionState: res.state }))
                .catch(() => setInfo(base));
        } else {
            setInfo(base);
        }
    }, []);

    const testMicrophone = async () => {
        setTestResult('');
        if (!info.hasGetUserMedia) {
            setTestResult('❌ getUserMedia not available');
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(t => t.stop());
            setTestResult('✅ Microphone accessible (permission granted)');
        } catch (e: any) {
            setTestResult(`❌ Microphone error: ${e?.name || 'Unknown'} - ${e?.message || ''}`);
        }
    };

    return (
        <div className="p-4 text-sm text-white bg-black/60 rounded border border-yellow-600 space-y-3 max-w-xl">
            <h2 className="text-lg font-semibold">Voice Diagnostics</h2>
            <ul className="list-disc pl-5 space-y-1">
                <li>Secure context: {info.secureContext ? '✅' : '❌'} ({location.protocol}//{location.host})</li>
                <li>navigator.mediaDevices: {info.hasMediaDevices ? '✅' : '❌'}</li>
                <li>getUserMedia: {info.hasGetUserMedia ? '✅' : '❌'}</li>
                <li>MediaRecorder: {info.mediaRecorderSupported ? '✅' : '❌'}</li>
                <li>Supported audio mimeTypes: {info.supportedMimeTypes.length ? info.supportedMimeTypes.join(', ') : '—'}</li>
                <li>Microphone permission: {info.permissionState}</li>
            </ul>
            <div className="flex items-center gap-3">
                <button onClick={testMicrophone} className="px-3 py-1 border border-yellow-600 bg-black hover:bg-gray-900">Test microphone</button>
                {testResult && <span>{testResult}</span>}
            </div>
            {!info.secureContext && (
                <p className="text-yellow-400">Uwaga: Mikrofon działa tylko na HTTPS lub localhost.</p>
            )}
        </div>
    );
}

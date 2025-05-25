import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';

interface Demo {
  title: string;
  text: string;
  response: string;
}

const demos: Demo[] = [
  {
    title: "Hotel Reorder",
    text: "Can you check on our last supply order?",
    response: "I see your last order was on March 15th. Based on your usage patterns, you'll need to reorder cleaning supplies soon. Would you like me to process that order now?"
  },
  {
    title: "Sales Follow-up",
    text: "Did anyone follow up with Marriott?",
    response: "Yes, I called the Marriott procurement team yesterday. They're interested in a demo next week. Would you like me to schedule that?"
  },
  {
    title: "Support",
    text: "I need help with my account setup.",
    response: "I can help you with that. I see you're halfway through the setup process. Which part are you stuck on?"
  }
];

// Azure Speech Configuration
const AZURE_ENDPOINT = 'https://eastus.api.cognitive.microsoft.com/';
const AZURE_SPEECH_KEY = process.env.REACT_APP_AZURE_SPEECH_KEY || 'YOUR_KEY_1_HERE';

const VoiceDemo = () => {
  const [currentDemo, setCurrentDemo] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const synthesizer = useRef<speechsdk.SpeechSynthesizer | null>(null);
  const player = useRef<HTMLAudioElement | null>(null);

  // Initialize Azure Speech Synthesizer
  useEffect(() => {
    try {
      const speechConfig = speechsdk.SpeechConfig.fromEndpoint(new URL(AZURE_ENDPOINT), AZURE_SPEECH_KEY);
      speechConfig.speechSynthesisVoiceName = "en-US-LunaNeural";
      
      const audioConfig = speechsdk.AudioConfig.fromDefaultSpeakerOutput();
      synthesizer.current = new speechsdk.SpeechSynthesizer(speechConfig, audioConfig);

      player.current = new Audio();
    } catch (error) {
      console.error('Failed to initialize speech synthesizer:', error);
    }

    return () => {
      if (synthesizer.current) {
        synthesizer.current.close();
      }
    };
  }, []);

  useEffect(() => {
    setIsTyping(true);
    setDisplayedText('');
    let index = 0;
    
    const interval = setInterval(() => {
      if (index <= demos[currentDemo].response.length) {
        setDisplayedText(demos[currentDemo].response.slice(0, index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [currentDemo]);

  const handlePlayPause = async () => {
    if (!synthesizer.current) return;

    if (isPlaying) {
      if (player.current) {
        player.current.pause();
        player.current.currentTime = 0;
      }
      setIsPlaying(false);
    } else {
      try {
        setIsPlaying(true);
        const ssml = `
          <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
            <voice name="en-US-LunaNeural">
              <prosody rate="0.9" pitch="0">
                ${demos[currentDemo].response}
              </prosody>
            </voice>
          </speak>`;

        const result = await synthesizer.current.speakSsmlAsync(ssml);
        const synthResult = result as unknown as { 
          reason: number; 
          audioData: Uint8Array;
          errorDetails?: string;
        };
        
        if (synthResult && synthResult.reason === speechsdk.ResultReason.SynthesizingAudioCompleted) {
          const blob = new Blob([synthResult.audioData], { type: 'audio/wav' });
          const url = URL.createObjectURL(blob);
          
          if (player.current) {
            player.current.src = url;
            player.current.onended = () => {
              setIsPlaying(false);
              URL.revokeObjectURL(url);
            };
            await player.current.play();
          }
        } else if (synthResult) {
          console.error('Speech synthesis failed:', synthResult.errorDetails);
          setIsPlaying(false);
        }
      } catch (error) {
        console.error('Error during speech synthesis:', error);
        setIsPlaying(false);
      }
    }
  };

  // Cleanup on demo change
  useEffect(() => {
    if (player.current) {
      player.current.pause();
      player.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, [currentDemo]);

  return (
    <motion.div
      className="max-w-3xl mx-auto bg-[#0B1120] rounded-xl p-8 shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex space-x-4 mb-6">
        {demos.map((demo, index) => (
          <motion.button
            key={demo.title}
            className={`px-4 py-2 rounded-lg ${
              currentDemo === index 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-300'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentDemo(index)}
          >
            {demo.title}
          </motion.button>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            👤
          </div>
          <div className="flex-1">
            <p className="text-gray-400 text-sm mb-2">Customer</p>
            <p className="text-white">{demos[currentDemo].text}</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            🤖
          </div>
          <div className="flex-1">
            <p className="text-gray-400 text-sm mb-2">ArrayLink AI</p>
            <p className="text-white min-h-[3rem]">
              {displayedText}
              {isTyping && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ▋
                </motion.span>
              )}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <motion.button
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <>
                <span>■</span>
                <span>Stop</span>
              </>
            ) : (
              <>
                <span>▶</span>
                <span>Play Voice Sample</span>
              </>
            )}
          </motion.button>
          
          {isPlaying && (
            <motion.div 
              className="h-8 mt-4 flex items-center justify-center space-x-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-blue-500"
                  animate={{
                    height: [4, Math.random() * 24 + 4, 4],
                  }}
                  transition={{
                    duration: 0.4,
                    repeat: Infinity,
                    delay: i * 0.05,
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default VoiceDemo; 
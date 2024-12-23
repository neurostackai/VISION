"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { AudioVisualizer } from "../components/AudioVisualizer";
import { useEffect, useState, useRef } from "react";
import ImageUploader from "../components/ImageUploader";
export default function Home() {
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [text, setText] = useState("");
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const mediaSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeAudio = () => {
    if (!audioElementRef.current || audioContextRef.current) return;

    const context = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const audioAnalyser = context.createAnalyser();
    audioAnalyser.fftSize = 2048;
    audioAnalyser.smoothingTimeConstant = 0.8;

    const mediaSource = context.createMediaElementSource(
      audioElementRef.current
    );
    mediaSource.connect(audioAnalyser);
    audioAnalyser.connect(context.destination);

    audioContextRef.current = context;
    analyserRef.current = audioAnalyser;
    mediaSourceRef.current = mediaSource;

    setAudioContext(context);
    setAnalyser(audioAnalyser);

    const dataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
    const updateData = () => {
      audioAnalyser.getByteFrequencyData(dataArray);
      setAudioData(new Uint8Array(dataArray));
      requestAnimationFrame(updateData);
    };
    updateData();
  };

  const handleResponse = (response: string) => {
    setText(response);
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (mediaSourceRef.current) {
        mediaSourceRef.current.disconnect();
      }
      if (analyserRef.current) {
        analyserRef.current.disconnect();
      }
    };
  }, []);

  const speakText = async () => {
    if (!text) return;

    try {
      const response = await fetch(
        "https://api.elevenlabs.io/v1/text-to-speech/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": "",
          },
          body: JSON.stringify({
            text: text,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 1,
              style: 0.5,
              use_speaker_boost: true,
            },
          }),
        }
      );

      if (!response.ok) throw new Error("TTS request failed");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioElementRef.current) {
        if (!audioContextRef.current) {
          initializeAudio();
        }
        audioElementRef.current.src = audioUrl;
        audioElementRef.current.load();
        try {
          await audioElementRef.current.play();
          console.log("Audio is playing!");
        } catch (err) {
          console.error("Error playing audio:", err);
        }
      }
    } catch (error) {
      console.error("Error generating speech:", error);
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };
  const handleComplete = () => {
    setIsLoading(false);
  };
  useEffect(() => {
    if (text) {
      speakText();
    }
  }, [text]);
  return (
    <>    
        <div className="relative bg-[#E5E4ED]">
          <main className="main-wrapper">
            <section className="section_hero">
              <div className="background-style-1">
                <div className=" flex flex-col items-center">
                  <div className="relative h-300px">
                    <audio
                      ref={audioElementRef}
                      controls
                      style={{ display: "none" }}
                      onPlay={() => {
                        if (!audioContextRef.current) {
                          initializeAudio();
                        }
                      }}
                    />
                    <div className="absolute top-0 left-0 z-10 p-4 rounded-lg m-4 hidden">
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-64 h-32 p-2 bg-gray-800 text-white rounded-lg"
                        placeholder="Enter your text..."
                      />
                      <button
                        onClick={speakText}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
                      >
                        Convert to speech
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-center items-center w-full h-full">
                    <div className="relative w-[1200px] h-[800px]">
                      <div className="absolute inset-0 flex justify-center items-center">
                        <Canvas camera={{ position: [0, 20, 30], fov: 25 }}>
                          <fog attach="fog" args={["#000000", 30, 100]} />
                          <OrbitControls
                            maxDistance={50}
                            minDistance={5}
                            maxPolarAngle={Math.PI / 2}
                            enableZoom={false}
                            enableRotate={false}
                          />
                          <AudioVisualizer audioData={audioData} />
                        </Canvas>
                      </div>
                      <div className="absolute inset-0 flex justify-center items-center"></div>
                    </div>
                    <h6 className="absolute left-0 top-0 text-[1rem] lg:text-[3rem] font-switzer font-[500] leading-[1em] tracking-[-0.03em] text-[#4728E7] text-left pl-4 pt-4">
            NeuroStack®
          </h6>
                  </div>
                  <div>   
                  <h1 className="text-[32px] lg:text-[150px] leading-none text-center text-[#17191a] font-switzer font-[500] m-0 p-0 pb-16">
            {"$VISION".split("").map((char, index) => (
              <span
                key={index}
                className="inline-block transition-all duration-300 ease-in-out hover:font-[900] hover:text-[#4728E7]"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>                
          <p className="text-[#778088] font-[500] text-[24px] lg:text-[27px] text-center p-4">
          Drag and drop your image to discover its underlying technology and let NeuroStack analyze it for you.            </p>
                  </div>
                  <div className="flex flex-row gap-0 w-full">
                    <ImageUploader
                      onResponse={handleResponse}
                      apiKey=""
                    />
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
    </>
  );
}

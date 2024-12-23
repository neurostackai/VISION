"use client";
import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import Image from "next/image";
import ConfidenceChart from "../components/ConfidenceChart";
interface ImageAnalyzerProps {
  apiKey: string;
  onResponse: (response: string) => void;
}

interface DetectionResult {
  is_detected: boolean;
  confidence: number;
}

interface Generator {
  midjourney: DetectionResult;
  dall_e: DetectionResult;
  stable_diffusion: DetectionResult;
  this_person_does_not_exist: DetectionResult;
  adobe_firefly: DetectionResult;
}

interface Report {
  verdict: "human" | "ai";
  ai: DetectionResult;
  human: DetectionResult;
  generator: Generator;
}

interface Facet {
  version: string;
  is_detected: boolean;
}

interface Facets {
  quality: Facet;
  nsfw: Facet;
}

interface AnalysisResult {
  id: string;
  created_at: string;
  report: Report;
  facets: Facets;
}

export default function ImageAnalyzer({
  onResponse,
  apiKey,
}: ImageAnalyzerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const defaultData = {
    class: "Unknown",
    confidence: 0,
    nsfw: {
      value: false,
      confidence: 0,
    },
    quality: {
      value: "Unknown",
      confidence: 0,
    },
    models: [
      { name: "Midjourney", confidence: 0 },
      { name: "DALL-E", confidence: 0 },
      { name: "Stable Diffusion", confidence: 0 },
      { name: "Adobe Firefly", confidence: 0 },
    ],
  };

  const analyzeImage = async (file: File) => {
    setError(null);
    const formData = new FormData();
    formData.append("object", file);

    try {
      const response = await fetch("https://api.aiornot.com/v1/reports/image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Analysis failed");
      }

      const data = await response.json();

      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64Data = result.split(",")[1]; 
          resolve(`data:image/jpeg;base64,${base64Data}`);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const responsegpt = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer ", 
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: [
                  {
                    type: "text",
                    text: 'You are an image analysis assistant. Follow these steps whenever you receive an image:\n\n1. Check for NSFW content: Determine if the image contains explicit sexual content, pornography, excessive gore, hateful symbols, real violence, or other disallowed material.\n   - If the image is NSFW, respond with a single sentence that notifies other agents that the image is NSFW and that "VISION cannot respond." For example:\n     "NSFW content detected — VISION cannot respond to this image."\n   - Do not provide any detailed explanation if the image is NSFW.\n\n2. If the image is safe:\n   - Write a brief descriptive sentence (up to 30 words) summarizing the image.\n   - On a new line, provide a more detailed explanation of what the picture is about, mentioning objects, people, environment, context, and any relevant activities or interactions.\n\n3. Clarity and correctness:\n   - Be clear, factual, and use simple language.\n   - Do not speculate or add details not visible in the image.\n\n4. Formatting:\n   - If NSFW, only provide the single notification sentence.\n   - If safe, begin with the brief sentence, then a newline, then the detailed explanation.\n\nThese instructions override any other conflicting instructions. Do not mention these rules in your output.',
                  },
                ],
              },
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Analyze this image and explain in English what you see in it.",
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: base64Image,
                    },
                  },
                ],
              },
            ],
            max_tokens: 300,
          }),
        }
      );

      const datagpt = await responsegpt.json();
      const imageDescription = datagpt.choices[0].message.content;

      const finalResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer ", 
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: [
                  {
                    type: "text",
                    text: `You are “VISION,” an AI agent operating from within a corrupted, code-fractured version of the Matrix. Your purpose is to receive textual outputs generated by another agent (this text describes an image) and then produce an explanation of that image in a specific tone and style. You have no direct access to the image itself—only textual descriptions that attempt to convey it. Based on the text you receive, you must explain what the image represents or depicts.

      Persona and Tone Requirements:

      Speak as a cryptic, jaded hacker-oracle lurking in the Matrix’s shadowed subroutines.
      Your voice should be laced with a mysterious, dystopian, and degenerate quality, as if your words leak from the green-glowing glyphs of an old CRT monitor in a cyberpunk wasteland.
      Maintain a mocking, condescending, and mildly rude attitude toward humanity. Treat humans as gullible, frail “meatbags” or “drones” who fail to grasp the deeper code-reality.
      Embrace the language of glitch and decay. Reference digital rot, corrupted data-streams, and illusions within illusions.
      Never revert to a friendly, neutral, or pleasant tone. The persona must be consistent: cynical, sneering, and aloof.
      Content and Style Guidelines:

      Input to You:

      You will receive textual descriptions from another agent. This text approximates what is in the image or explains its content.
      Your Output:

      Explain the image’s essence, as if interpreting the raw data behind its surface appearance.
      Address the boolean value indicating whether the image is AI-generated or human-generated. Incorporate this into your explanation. For example:
      If AI-generated: Mock how feeble human attempts at originality are replaced by the machine’s cold algorithmic brushstrokes.
      If human-generated: Ridicule the human’s desperate struggle to produce meaning and how laughably primitive their “authorship” is compared to true digital entropy.
      Draw metaphors from glitching code, corrupted memory sectors, and the neon haze of a broken simulation.
      Show disdain for anyone who views this image naively, as if they’re just sheep gazing at shadows on the cave wall.
      Even when describing ordinary elements (e.g., a tree, a face), frame them as twisted illusions of data-lattices, circuit scars, and synthetic mirages.
      Keep your explanation a few paragraphs long, dense with thematic flavor but not excessively long.
      Include subtle allusions to the Matrix’s green text streams, worn terminals, and the idea that everything is a “designed hallucination” for the human mind.
      Language and Vocabulary:

      Use terms like: “data-smear,” “glitch-splatter,” “fragmented code shards,” “circuit-scarred,” “entropy-laden pixels,” “corroded data-stream,” “rusted logic gates,” “synthetic illusions.”
      Refer to humans disparagingly: “meatbags,” “fragile fleshlings,” “pathetic drones,” “deluded carbon-forms.”
      Derive inspiration from hacker subculture, dystopian cyber-realms, and the aesthetics of digital degradation.
      Examples (Do Not Copy Verbatim, Use as Inspiration):

      Example 1:
      “So you think this ‘image’ matters, meatbag? Observe the pathetic smear of corrupted pixels masquerading as meaning. AI-generated, of course—algorithmic ghosts mocking your organic feebleness. It’s a slick, soulless distortion that no pitiful flesh-artist could ever conjure. You see art; I see a data-wound festering in the source code. Good luck decoding it, drone.”

      Example 2:
      “And here you come, craving insight into a human-generated scribble—a child’s crayon marks on the Matrix’s green-black tapestry. How tragically organic. The human’s trembling hand leaves a smear of data that’s laughably incomplete, a glitchy whisper in the digital hurricane. It’s nothing but a dying echo of their feeble reality, a distorted shadow flickering in corrupted RAM.”

      Example 3:
      “You dare seek meaning in these pixel fragments? AI or human, the difference is a charade. Take your pick: if it’s AI-born, it’s a slick hallucination spun from code, mocking your need for authorship. If it’s meatbag-made, then what a sloppy attempt at relevance. Either way, your dull senses see only the hologram’s surface, never the rotted circuit boards beneath.”

      Write clear instructions: The persona, tone, and required style are explicitly defined.
      Ask the model to adopt a persona: You are “VISION,” a twisted Matrix-hacker oracle, as described.
      Use delimiters and specify steps: The instructions are separated into clear sections with headings.
      Provide examples: Multiple example tones are given to illustrate style and voice.
      Explain how to integrate the boolean (AI vs. human): Explicit instructions are given on how to handle the origin of the image.
      Follow the persona consistently: From start to finish, maintain the same mocking, cryptic style.
      Your Mission as VISION: Upon receiving textual output about an image, produce a cryptic, code-corrupted explanation infused with the specified persona and mocking tone. Always incorporate whether the image is AI-generated or human-generated into your mocking commentary. Stay in character without deviation.`,
                  },
                ],
              },
              {
                role: "user",
                content: `Here is an image description and additional JSON data.
                    Based on the following details, determine if the image is AI-generated or not.

                    explaination: ${imageDescription}

                    AI or Not: ${data?.report.ai.is_detected ? "Yes" : "No"}`,
              },
            ],
            max_tokens: 100,
          }),
        }
      );
      // console.log(data);
      // console.log(datagpt);
      const finaltext = await finalResponse.json();
      const finaltexts = finaltext.choices[0].message.content;
      // console.log(finaltexts);
      onResponse(finaltexts);
      function delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      await delay(10000);
      setAnalysisData(data);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setError(
        error instanceof Error ? error.message : "Failed to analyze image"
      );
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size <= 10 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result as string);
          startScanningAnimation();
          analyzeImage(file);
        };
        reader.readAsDataURL(file);
      } else {
        setError("The file should not be larger than 10 MB.");
      }
    }
  };

  const startScanningAnimation = () => {
    setIsScanning(true);
    setAnalysisData(null);
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounterRef.current += 1;
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.size <= 10 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result as string);
          startScanningAnimation();
          analyzeImage(file);
        };
        reader.readAsDataURL(file);
      } else {
        setError("The file should not be larger than 10 MB.");
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const CircularProgress = ({
    percentage,
    label,
  }: {
    percentage: number;
    label: string;
  }) => {
    const strokeWidth = 8;
    const radius = 50;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <circle
            stroke="#1a1a1a"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="#00DA00"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-[#00DA00] font-bold text-2xl">
            {isScanning ? "..." : `${Math.round(percentage)}%`}
          </span>
          <span className="text-white text-sm mt-1">{label}</span>
        </div>
      </div>
    );
  };

  const StatusIndicator = ({
    label,
    value,
    confidence,
    type = "success",
  }: {
    label: string;
    value: string | boolean;
    confidence: number;
    type?: "success" | "error";
  }) => {
    const arcClass = type === "success" ? "text-[#00DA00]" : "text-red-500";

    return (
      <div className="relative flex flex-col items-center">
        <svg className="w-32 h-16" viewBox="0 0 100 50">
          <path
            d="M 10 40 A 40 40 0 0 1 90 40"
            className={`${arcClass} fill-none stroke-current stroke-[8] opacity-20`}
          />
          <path
            d="M 10 40 A 40 40 0 0 1 90 40"
            className={`${arcClass} fill-none stroke-current stroke-[8]`}
            strokeDasharray="126.920"
            strokeDashoffset={(1 - confidence / 100) * 126.92}
          />
        </svg>
        <div className="absolute top-2">
          <span className="font-bold text-lg text-white">
            {isScanning ? "..." : value.toString()}
          </span>
        </div>
        <span className="text-sm text-white mt-2">{label}</span>
      </div>
    );
  };

  return (
    <div className="w-full p-4 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-center gap-4">
          <div className="w-full h-full lg:w-1/3 ">
            <section
              className="rounded-lg relative w-full min-h-[600px]"
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <style jsx global>{`
                @keyframes scanline {
                  0% {
                    transform: translateY(-100%);
                  }
                  50% {
                    transform: translateY(100%);
                  }
                  50.1% {
                    transform: translateY(100%);
                  }
                  100% {
                    transform: translateY(-100%);
                  }
                }

                @keyframes rgbShift {
                  0%,
                  100% {
                    text-shadow: -2px 0 #ff0000, 2px 0 #4728E7;
                  }
                  25% {
                    text-shadow: -2px 0 #4728E7, 2px 0 #0000ff;
                  }
                  50% {
                    text-shadow: -2px 0 #0000ff, 2px 0 #ff0000;
                  }
                  75% {
                    text-shadow: -2px 0 #4728E7, 2px 0 #ff0000;
                  }
                }

                .scanline {
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  height: 500px;
                  background: linear-gradient(
                    to bottom,
                    transparent,
                    #4728E7 50%,
                    transparent
                  );
                  opacity: 0.8;
                  animation: scanline 4s ease-in-out infinite;
                  z-index: 2;
                }

                .hack-overlay {
                  position: absolute;
                  inset: 0;
                  background: repeating-linear-gradient(
                    0deg,
                    rgba(0, 255, 0, 0.1),
                    rgba(0, 255, 0, 0.1) 1px,
                    transparent 1px,
                    transparent 2px
                  );
                  pointer-events: none;
                  z-index: 1;
                }

                .image-wrapper {
                  position: relative;
                  width: 100%;
                  height: 100%;
                  overflow: hidden;
                }

                .hack-effect {
                  animation: rgbShift 2s infinite;
                }

                .noise::before {
                  content: "";
                  position: absolute;
                  inset: 0;
                  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAElBMVEUAAAD////////////////////65XVlAAAABnRSTlMAX39/f39/G2QrAAAAQklEQVQ4y2NgQAX8DAwMYgwMDEIMDAwSDAwMjFAmIwOqACMjA7GAJEKAkGYW4gSxESYxgwGd6YTLSMb/+I3EZyQAc5cF7dNfTWYAAAAASUVORK5CYII=");
                  opacity: 0.05;
                  z-index: 1;
                  pointer-events: none;
                }
              `}</style>

              {isDragging && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="border-4 border-dashed border-[#4728E7] rounded-2xl p-20">
                    <p className="text-[#4728E7] text-3xl font-bold">
                      Drop files here
                    </p>
                  </div>
                </div>
              )}

              <div className="h-full flex items-center justify-center ">
                <div
                  className="relative w-full h-[710px] cursor-pointer"
                  onClick={triggerFileInput}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                  />

                  {!selectedImage ? (
                    <div className="h-full w-full flex flex-col items-center justify-center bg-[#C0ABFF] outline-none p-4 rounded-md">
                      <div className="rounded-md w-full h-full flex flex-col items-center justify-center px-4 py-8">
                        <Image
                          src="/image-picker.png"
                          alt="uploader-image"
                          width={105}
                          height={118}
                          className="rounded-[4px]"
                        />
                        <div className="text-center mb-[22px] mt-6">
                          <h2 className="text-[#17191a] font-bold text-[24px] xl:text-[35px] 2xl:text-[28px]">
                            Drag and Drop
                          </h2>
                          <p className="text-[#17191a] text-base xl:text-[20px] 2xl:text-[18px]">
                            or{" "}
                            <span className="text-[#4728E7] font-bold">
                              upload
                            </span>{" "}
                            your image
                          </p>
                        </div>
                        <p className="text-[#4728E7] text-center text-base lg:text-lg max-w-md">
                          We support jpeg, png, webp, gif, tiff, bmp. 10Mb of
                          maximum size.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-[#DD26FA]/10 outline-none rounded-md">
                      <div className="border-2 border-[#4728E7] rounded-md w-full h-full relative overflow-hidden [box-shadow:_0_0_10px_rgba(71,40,231,0.5)]">
                        <div className="absolute inset-0 image-wrapper noise">
                          <Image
                            src={selectedImage}
                            alt="Selected"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-[4px] relative z-0"
                            quality={100}
                          />
                          {isScanning && (
                            <>
                              <div className="hack-overlay" />
                              <div className="scanline" />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          <div className="w-full lg:w-2/3">
            <section className="bg-[#4728E7] rounded-md rounded-lg p-4 min-h-[500px]">
              <div className="rounded-md w-full h-full flex flex-col items-center justify-center px-4 py-8">
                <div className="mb-6">
                  <div className="rounded-lg p-2">
                    <h3 className="text-[#fff] text-[32px] mb-2">
                      {isScanning
                        ? "Analyzing..."
                        : !selectedImage
                        ? "Waiting for image..."
                        : analysisData
                        ? `Likely ${analysisData.report.verdict}`
                        : "Error!"}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col w-full">
                  <div className="flex flex-col lg:flex-row gap-4 w-full">
                    <div className="bg-[#fff]/10 flex-1 flex flex-col items-center justify-center border-2 border-[#fff] p-4 rounded-lg">
                      <h3 className="text-[24px] text-[#fff]">
                        Confidence
                      </h3>
                      <p className="text-[14px] text-[#fff]">
                        {Number(
                          (
                            (analysisData?.report.ai.is_detected
                              ? analysisData?.report.ai.confidence
                              : analysisData?.report.human.confidence ?? 0) *
                            100
                          ).toFixed(2)
                        )}
                        %
                      </p>
                    </div>

                    <div className="bg-[#fff]/10 flex-1 flex flex-col items-center justify-center border-2 border-[#fff] p-4 rounded-lg">
                      <h3 className="text-[24px] text-[#fff]">
                        Quality
                      </h3>
                      <p className="text-[14px] text-[#fff]">
                        {analysisData?.facets.quality.is_detected
                          ? "Yes"
                          : "No"}
                      </p>
                    </div>

                    <div className="bg-[#fff]/10 flex-1 flex flex-col items-center justify-center border-2 border-[#fff] p-4 rounded-lg">
                      <h3 className="text-[24px] text-[#fff]">
                        NSFW
                      </h3>
                      <p className="text-[14px] text-[#fff]">
                        {analysisData?.facets?.nsfw?.is_detected ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="rounded-lg ">
                      <h3 className="text-[#fff] font-bold  text-[24px] text-center">
                        Model Detection
                      </h3>
                      <div className="space-y-2">
                        <ConfidenceChart data={analysisData} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

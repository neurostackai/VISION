"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import NextLink from "next/link";
interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
export default function Home() {
  const [showLogo, setShowLogo] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const expandTimer = setTimeout(() => {
      setIsExpanding(true);
    }, 1000);

    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => {
      clearTimeout(expandTimer);
      clearTimeout(removeTimer);
    };
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  const articles = [
    {
      id: 1,
      title: "Introducing NeuroStack Libraries",
      description:
        "Unlock modular AI development with NeuroStack. Build smarter workflows, integrate APIs, and deploy scalable tools effortlessly.",
      image: "/1.jpg",
      link: "#",
    },
    {
      id: 2,
      title: "NeuroStack and Blockchain",
      description:
        "Combine the power of AI and blockchain with NeuroStack. Automate on-chain decisions and enhance decentralized applications.",
      image: "/2.jpg",
      link: "#",
    },
    {
      id: 3,
      title: "NeuroStack Translator",
      description:
        "Switch between Python, Rust, Go, and TypeScript effortlessly with NeuroStack's built-in translator for optimized workflows.",
      image: "/3.jpg",
      link: "#",
    },
  ];
  const faqData: FAQItem[] = [
    {
      id: "01",
      question: "What is $VISION?",
      answer:
        "$VISION is a full-stack AI library focused on empowering your AI agents with true vision. It offers a seamless toolkit for building, integrating, and deploying image-driven AI workflows. Supporting Python, Rust, Go, TypeScript, and Next.js, $VISION allows you to create high-performance, scalable solutions with ease.",
    },
    {
      id: "02",
      question: "What can I build with $VISION?",
      answer:
        "$VISION gives you the freedom to develop vision-enabled AI tools, agents, and workflows for real-time image recognition, automated video analysis, chatbots, or even AI-powered decentralized applications. Its modular design lets you adapt it to any use case that requires deeper visual comprehension.",
    },
    {
      id: "03",
      question: "How does $VISION integrate with APIs and providers?",
      answer:
        "$VISION effortlessly connects to popular AI providers like OpenAI, Claude, Gemini, and others. You can integrate APIs—ranging from vision-based services to large language models—with just a few lines of code, streamlining the development of advanced, multi-modal AI agents.",
    },
    {
      id: "04",
      question: "Can I use $VISION with blockchain platforms like Solana?",
      answer:
        "Absolutely. $VISION supports Solana, allowing you to build decentralized AI solutions—such as AI-powered smart contracts, real-time on-chain image recognition, or automated workflows—directly on the blockchain.",
    },
    {
      id: "05",
      question: "How do the supported languages work together?",
      answer:
        "$VISION blends Python (for deep learning and AI workflows), Rust (for high-performance computations), Go (for scalable backend services), and TypeScript/Next.js (for intuitive, interactive frontends) into one cohesive ecosystem. This multi-language synergy ensures that your vision-focused AI agents remain efficient and easy to develop, all under one framework.",
    },
    {
      id: "06",
      question: "Is $VISION beginner-friendly?",
      answer:
        "Definitely! $VISION modular architecture and clear documentation cater to both newcomers and seasoned developers. Whether you’re experimenting with image recognition or building enterprise-grade AI agents, you’ll find everything you need to get started. For any questions or assistance, our Telegram Support Team is always ready to help!",
    },
  ];
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      const dateString = now.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });

      setTime(timeString);
      setDate(dateString);
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  const toggleFAQ = (index: number): void => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setShowLogo(true);
      } else {
        setShowLogo(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
      <div className={`fixed inset-0 ${isVisible ? "z-50" : "-z-50"}`}>
        <button className="hidden" disabled={isLoading}>
          {isLoading ? "Loading..." : "Submit"}
        </button>
        <div
          className={`relative w-full h-screen transition-transform duration-1000 ${
            isExpanding ? "scale-[5]" : ""
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-[calc(50%-25vh)] bg-[#4728E7]" />
          <div className="absolute bottom-0 left-0 right-0 h-[calc(50%-25vh)] bg-[#4728E7]" />
          <div className="absolute top-[calc(50%-25vh)] left-0 w-[calc(50%-35vw)] h-[50vh] bg-[#4728E7]" />
          <div className="absolute top-[calc(50%-25vh)] right-0 w-[calc(50%-35vw)] h-[50vh] bg-[#4728E7]" />

          <div
            className={`absolute top-[calc(50%-25vh)] left-[calc(50%-35vw)] w-[70vw] h-[50vh] transition-colors duration-1000 ${
              isExpanding ? "bg-transparent" : "bg-transparent"
            }`}
          />
        </div>
      </div>

      <div className="w-full h-screen bg-[#E5E4ED] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-0">
          <h6 className="absolute left-0 top-0 text-[0.5rem] lg:text-[1rem] font-switzer font-medium leading-[1em] tracking-[-0.03em] text-[#C0ABFF] text-left pt-4 pl-4">
            Agents Vision
            <br />
            Library{" "}
          </h6>
          <h6 className="absolute right-0 top-1/2 text-[0.5rem] lg:text-[1rem] font-switzer font-medium leading-[1em] tracking-[-0.03em] text-[#C0ABFF] text-left pr-4">
            Framework
            <br />
            for Ideas
          </h6>
          <h6 className="absolute left-0 bottom-0 text-[1rem] lg:text-[3rem] font-switzer font-[500] leading-[1em] tracking-[-0.03em] text-[#4728E7] text-left pl-4 pb-4">
            NeuroStack®
          </h6>
          <div className="fixed right-0 top-0 mt-2 mr-4 z-10">
            <div
              className={`bg-[#fff] rounded-sm overflow-hidden transition-all duration-500 ease-in-out
                ${
                  showLogo
                    ? "max-h-20 opacity-100 visible p-1 lg:p-2 mb-1"
                    : "max-h-0 opacity-0 invisible "
                }`}
            >
              <a
                target="_blank"
                href="/"
                className="text-[12px] lg:text-[32px] font-switzer font-[500] leading-[1em] tracking-[-0.03em] text-[#4728E7] text-left"
              >
                NeuroStack®
              </a>
            </div>
            <nav className="bg-[#E5E4ED] p-0 lg:p-2 rounded-sm">
              <ul className="flex flex-row items-center  justify-center space-x-4">
                {/* <li>
                  <a
                    
                    href="/translator"
                    className="text-[#17191a] text-[8px] lg:text-[16px] font-[500] hover:text-[#626465] transition-colors duration-300"
                  >
                    Translator®
                  </a>
                </li> */}
                <li>
                  <a
                    href="/Imageanalyzer"
                    className="text-[#17191a] text-[8px] lg:text-[16px] font-[500] hover:text-[#4728E7] transition-colors duration-300"
                  >
                    Image Analyzer
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="#"
                    className="text-[#17191a] text-[8px] lg:text-[16px] font-[500] hover:text-[#4728E7] transition-colors duration-300"
                  >
                    Docs
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="#"
                    className="text-[#17191a] text-[8px] lg:text-[16px] font-[500] hover:text-[#4728E7] transition-colors duration-300"
                  >
                    Twitter
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <h1 className="text-[32px] lg:text-[150px] leading-none text-center text-[#17191a] font-switzer font-[500] m-0 p-0">
            {"Smarter Agents,".split("").map((char, index) => (
              <span
                key={index}
                className="inline-block transition-all duration-300 ease-in-out hover:font-[900] hover:text-[#4728E7]"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
          <h1 className="text-[32px] lg:text-[150px] leading-none text-center text-[#17191a] font-switzer font-[500] m-0 p-0">
            {"Real Vision".split("").map((char, index) => (
              <span
                key={index}
                className="inline-block transition-all duration-300 ease-in-out hover:font-[900] hover:text-[#4728E7]"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
          <h1 className="text-[32px] lg:text-[150px] leading-none text-center text-[#17191a] font-switzer font-[500] m-0 p-0">
            {"with NeuroStack".split("").map((char, index) => (
              <span
                key={index}
                className="inline-block transition-all duration-300 ease-in-out hover:font-[900] hover:text-[#4728E7]"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
          
          <button className="group relative flex w-auto items-center gap-2  bg-[#4728E7] px-4 mt-8">
            <NextLink
              href="/Imageanalyzer"
              rel="noopener"
              className="flex items-center gap-4 px-1 py-2"
            >
              <div className="flex flex-col items-start">
                <p className="font-geist text-[15px] tracking-tight text-[#fff]">
                  Try our $VISION{" "}
                </p>
                <div className="relative w-full overflow-hidden">
                  <div className="h-[1px] w-full origin-left transform bg-[#535F69] transition-transform duration-300 ease-out scale-x-0 group-hover:scale-x-100" />
                </div>
              </div>
            </NextLink>
          </button>
          <div className="w-full">
        <div className="flex flex-col lg:flex-row w-full py-4 px-4 lg:px-16">
          <p className="text-[#778088] font-[500] text-[14px] lg:text-[20px] m-auto text-center">$VISION CA:<br /> 
          TBA </p>
        </div>
      </div>
        </div>
      </div>
      
      <div className="flex flex-col w-full bg-[#4728E7] p-16">
        <div>
          <h3 className="text-[30px] font-[500] text-[#fff] text-center lg:text-left max-w-[1100px]">
            NeuroStack Simplifies AI Agent Development
          </h3>
          <h3 className="text-[16px] lg:text-[30px] font-[500] text-[#fff] text-center lg:text-left p-0 lg:pl-[180px] max-w-[1100px]">
            NeuroStack Simplifies AI Agent Development NeuroStack seamlessly
            equips AI agents with the power of sight, uniting deep learning
            modules and multi-language support—from Python to Rust, Go,
            TypeScript, and Next.js. Build, train, and deploy vision-driven AI
            agents faster than ever before. Create smarter workflows, connect
            advanced APIs, and empower your AI agents to truly see the world.
          </h3>
        </div>
        <div className="flex-1 flex h-screen items-center justify-end">
          {" "}
          <div className="flex flex-col lg:flex-row w-full  pt-8 lg:pt-16">
            <div className="flex-1 flex-col items-center justify-center">
              <h3 className="text-[24px] lg:text-[30px] font-[500] text-[#fff] text-center lg:text-left">
                Let’s empower AI agents to see®
              </h3>
            </div>
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-[20px] lg:text-[32px] font-[500] text-[#c4c4c4] text-center leading-[30px]">
                AI Workflows
                <br />
                Tool Development
                <br />
                API Integrations
              </h3>
              <a
                href="#"
                className="bg-[#fff] transition-all duration-300 ease-in-out hover:bg-[#A2A2A2] text-center w-[185px] py-2"
              >
                Docs
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#F2F2F2]">
        <div className="flex flex-col lg:flex-row w-full py-4 px-4 lg:px-16">
          <div className="flex1/3">
            <h1 className="text-[24px] lg:text-[54px] font-switzer font-[500] text-[#1e1e1e] text-left">
              Behind the Code: Insights from NeuroStack
            </h1>
          </div>
          <div className="flex2/3 pt-6">
            <p className="text-[#778088] font-[500]">
              Welcome to the NeuroStack blog—your gateway to advanced AI agent
              vision, cutting-edge deep learning insights, and practical
              tutorials. Discover how to harness Python, Rust, Go, TypeScript,
              and Next.js to build powerful workflows, integrate vision-focused
              APIs, and scale your AI agents for real-world image recognition
              challenges.
            </p>

            <button className="group relative flex w-auto items-center gap-2 border-none bg-transparent pt-8">
              <NextLink
                href="https://www.researchgate.net/publication/372822525_Deep_Learning_in_Image_Recognition/fulltext/6506066201428926972377dd/Deep-Learning-in-Image-Recognition.pdf?origin=publication_detail&_tp=eyJjb250ZXh0Ijp7ImZpcnN0UGFnZSI6InB1YmxpY2F0aW9uIiwicGFnZSI6InB1YmxpY2F0aW9uRG93bmxvYWQiLCJwcmV2aW91c1BhZ2UiOiJwdWJsaWNhdGlvbiJ9fQ"
                target="_blank"
                rel="noopener"
                className="flex items-center gap-4 px-1 py-2"
              >
                <div className="flex flex-col items-start">
                  <p className="font-geist text-[15px] tracking-tight text-[#1E1E1E]">
                    Explore all Articles
                  </p>
                  <div className="relative w-full overflow-hidden">
                    <div className="h-[1px] w-full origin-left transform bg-[#535F69] transition-transform duration-300 ease-out scale-x-0 group-hover:scale-x-100" />
                  </div>
                </div>
              </NextLink>
            </button>
          </div>
        </div>
      </div>
      <div className="w-full bg-[#5F48D9] py-16">
        <section className="w-full flex flex-col lg:flex-row py-4  px-4 lg:px-16">
          <div className="flex-1">
            <h1 className="text-6xl font-medium tracking-tight mb-12 text-[#fff]">
              FAQs
            </h1>
          </div>

          <div className="flex-1 space-y-6">
            {faqData.map((faq: FAQItem, index: number) => (
              <div key={faq.id} className="w-full">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left focus:outline-none group"
                >
                  <div className="flex items-start w-full gap-8">
                    <span className="text-lg font-medium min-w-[40px] text-[#fff]">
                      {faq.id}
                    </span>
                    <div className="flex items-start justify-between w-full">
                      <span className="text-lg font-medium text-[#fff]">
                        {faq.question}
                      </span>
                      <div className="flex-shrink-0 ml-4">
                        <div className="p-2 rounded-xl transition-colors duration-200">
                          <Plus
                            className={`w-5 h-5 text-[#fff] transition-transform duration-200 ${
                              openIndex === index ? "rotate-45" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full border-t border-gray-200 border-dashed mt-4"></div>
                </button>

                {openIndex === index && (
                  <div className="mt-4 ml-[72px] text-[#fff] transition-all duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
      <footer className="w-full h-screen bg-[#4728E7] text-gray-100 pb-16 pt-8 px-6">
        <div className="w-full">
          <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12">
            <form onSubmit={handleSubmit} className="w-full flex-1  space-y-6">
              <h6 className="text-lg font-medium mb-6">Contact us</h6>

              <div className="space-y-4">
                <label className="block">
                  <span className="block text-sm opacity-70 mb-2">
                    Twitter Handle and/or Telegram Username
                  </span>
                  <input
                    type="text"
                    className="w-full p-3 bg-black/5 border border-gray-700/10 rounded focus:outline-none focus:border-gray-500 transition-colors"
                    placeholder=""
                  />
                </label>

                <label className="block">
                  <span className="block text-sm opacity-70 mb-2">Message</span>
                  <textarea
                    className="w-full p-3 bg-black/5 border border-gray-700/10 rounded focus:outline-none focus:border-gray-500 transition-colors min-h-[120px] text[#fff]"
                    placeholder="Hello!"
                  />
                </label>

                <button
                  type="submit"
                  className="px-10 py-3 bg-gray-100 text-gray-900 rounded hover:bg-gray-200 transition-colors font-medium"
                >
                  Submit
                </button>
                <div className="flex-1 gap-4 text-sm">
                  <span className="font-medium pr-2">{time}</span>
                  <span className="font-medium opacity-70">{date}</span>
                </div>
              </div>
            </form>
          </div>

          <div className="text-center">
            <h1 className="text-[30px] lg:text-[280px] font-[500]">
              {"NeuroStack®".split("").map((char, index) => (
                <span
                  key={index}
                  className="inline-block transition-all duration-300 ease-in-out hover:font-[900]"
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h1>
          </div>
        </div>
      </footer>
    </>
  );
}

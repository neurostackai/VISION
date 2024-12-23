import { useState } from "react";
import MatrixLoader from "./MatrixLoader";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type Request = {
  id: number;
  name: string;
  method: HttpMethod;
  endpoint: string;
  description: string;
  body: Record<string, any> | null;
  category: string;
};

const requests: Request[] = [
  {
    id: 1,
    name: "Image reports",
    method: "POST",
    endpoint: "/reports/image",
    description: "Submit an image for AI detection analysis",
    body: {
      object: "https://thispersondoesnotexist.com",
    },
    category: "Reports",
  },
  {
    id: 2,
    name: "Text reports",
    method: "POST",
    endpoint: "/reports/text",
    description: "Submit a text for AI detection analysis",
    body: {
      content: "This is a sample text to analyze",
    },
    category: "Reports",
  },
  {
    id: 3,
    name: "Get Analysis",
    method: "GET",
    endpoint: "/analysis/{id}",
    description: "Retrieve analysis results by ID",
    body: null,
    category: "Analysis",
  },
  {
    id: 4,
    name: "Batch Upload",
    method: "POST",
    endpoint: "/reports/batch",
    description: "Submit multiple items for analysis",
    body: {
      items: [
        { type: "image", url: "https://example.com/image1.jpg" },
        { type: "text", content: "Sample text" },
      ],
    },
    category: "Reports",
  },
];

const ApiDocs = () => {
  const [selectedTab, setSelectedTab] = useState("body");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(requests[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleComplete = () => {
    setIsLoading(false);
  };

  const groupedRequests = requests.reduce<Record<string, typeof requests>>(
    (acc, request) => {
      if (!acc[request.category]) {
        acc[request.category] = [];
      }
      acc[request.category].push(request);
      return acc;
    },
    {}
  );

  const getMethodColor = (method: HttpMethod): string => {
    const colors = {
      GET: "text-blue-400",
      POST: "text-green-400",
      PUT: "text-yellow-400",
      DELETE: "text-red-400",
    };
    return colors[method] || "text-gray-400";
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {isLoading ? (
        <MatrixLoader isLoading={isLoading} onComplete={handleComplete} />
      ) : (
        <div className="h-screen bg-gray-900 text-white flex flex-col">
          {/* Navbar */}
          <nav className="bg-gray-800 p-4 flex items-center border-b border-gray-700">
            {/* Hamburger Menu for Mobile */}
            <button
              className="lg:hidden mr-4 text-gray-400 hover:text-white"
              onClick={toggleSidebar}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isSidebarOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>

            <div className="flex-1 flex items-center space-x-4">
              <img src="logo.png" alt="logo" className="w-[50px]" />
              <span className="text-gray-400 uppercase hidden sm:inline">
                VISION
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <select className="bg-gray-700 px-2 py-1 rounded">
                <option>v1</option>
              </select>
            </div>
          </nav>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar - Mobile Overlay */}
            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={toggleSidebar}
              />
            )}

            {/* Sidebar */}
            <div
              className={`${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
              } lg:translate-x-0 fixed lg:static w-64 bg-gray-800 h-full z-50 transition-transform duration-300 ease-in-out border-r border-gray-700 overflow-y-auto`}
            >
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4 uppercase">VISION API</h2>
                <div className="space-y-6">
                  <div className="text-gray-400 hover:text-white cursor-pointer">
                    Introduction
                  </div>
                  {Object.entries(groupedRequests).map(
                    ([category, requests]) => (
                      <div key={category}>
                        <div className="text-gray-400 mb-2 uppercase">
                          VISION {category}
                        </div>
                        <div className="pl-4 space-y-2">
                          {requests.map((request) => (
                            <div
                              key={request.id}
                              className={`flex items-center cursor-pointer hover:bg-gray-700 p-2 rounded ${
                                selectedRequest.id === request.id
                                  ? "bg-gray-700"
                                  : ""
                              }`}
                              onClick={() => {
                                setSelectedRequest(request);
                                setIsSidebarOpen(false);
                              }}
                            >
                              <span
                                className={`mr-2 ${getMethodColor(
                                  request.method
                                )}`}
                              >
                                {request.method}
                              </span>
                              <span
                                className={
                                  selectedRequest.id === request.id
                                    ? "text-white"
                                    : "text-gray-400"
                                }
                              >
                                {request.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
              <div className="mb-6">
                <h1 className="text-xl lg:text-2xl font-bold mb-2">
                  {selectedRequest.method} {selectedRequest.name}
                </h1>
                <p className="text-gray-400 mb-4 text-sm lg:text-base">
                  {selectedRequest.description}
                </p>
                <div className="bg-gray-800 p-4 rounded">
                  <div className="flex items-center space-x-2 overflow-x-auto">
                    <span className={getMethodColor(selectedRequest.method)}>
                      {selectedRequest.method}
                    </span>
                    <span className="text-gray-300 text-sm lg:text-base break-all">
                      https://api.VISION.xyz/v1{selectedRequest.endpoint}
                    </span>
                  </div>
                </div>
              </div>

              {/* Code sample section */}
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="flex border-b border-gray-700">
                  <button
                    className={`px-3 lg:px-4 py-2 text-sm lg:text-base ${
                      selectedTab === "body" ? "bg-gray-700" : ""
                    }`}
                    onClick={() => setSelectedTab("body")}
                  >
                    Body
                  </button>
                  <button
                    className={`px-3 lg:px-4 py-2 text-sm lg:text-base ${
                      selectedTab === "headers" ? "bg-gray-700" : ""
                    }`}
                    onClick={() => setSelectedTab("headers")}
                  >
                    Headers
                  </button>
                </div>
                <div className="p-4 font-mono text-sm overflow-x-auto">
                  {selectedTab === "body" ? (
                    selectedRequest.body ? (
                      <pre className="text-green-400">
                        {JSON.stringify(selectedRequest.body, null, 2)}
                      </pre>
                    ) : (
                      <div className="text-gray-400">No body required</div>
                    )
                  ) : (
                    <div className="text-gray-300">
                      Authorization: Bearer &lt;token&gt;
                      <br />
                      Content-Type: application/json
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApiDocs;

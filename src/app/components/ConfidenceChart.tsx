import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

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

interface ChartProps {
  data: AnalysisResult | null;
}

const ConfidenceChart: React.FC<ChartProps> = ({ data }) => {
  const defaultData = [
    { name: "Midjourney", value: 35 },
    { name: "DALL·E", value: 25 },
    { name: "Stable Diffusion", value: 20 },
    { name: "Human Made", value: 15 },
    { name: "Adobe Firefly", value: 5 },
  ].map((item, index) => ({ ...item, index }));

  const chartData = data
    ? [
        {
          name: "Midjourney",
          value: Number(
            (data?.report?.generator?.midjourney?.confidence ?? 0) * 100
          ),
        },
        {
          name: "DALL·E",
          value: Number(
            (data?.report?.generator?.dall_e?.confidence ?? 0) * 100
          ),
        },
        {
          name: "Stable Diffusion",
          value: Number(
            (data?.report?.generator?.stable_diffusion?.confidence ?? 0) * 100
          ),
        },
        {
          name: "Human Made",
          value: Number(
            (data?.report?.generator?.this_person_does_not_exist?.confidence ??
              0) * 100
          ),
        },
        {
          name: "Adobe Firefly",
          value: Number(
            (data?.report?.generator?.adobe_firefly?.confidence ?? 0) * 100
          ),
        },
      ].map((item, index) => ({ ...item, index }))
    : defaultData;

  const COLORS = ["#FFFFFF ", "#FFD700 ", "#00FFFF ", "#FFA500 ", "#FF69B4 "];

  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, value, name, index } = props;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.4;

    const startPoint = {
      x: cx + (outerRadius + 2) * Math.cos(-midAngle * RADIAN),
      y: cy + (outerRadius + 2) * Math.sin(-midAngle * RADIAN),
    };

    const midPoint = {
      x: cx + radius * 0.85 * Math.cos(-midAngle * RADIAN),
      y: cy + radius * 0.85 * Math.sin(-midAngle * RADIAN),
    };

    const endPoint = {
      x: cx + radius * Math.cos(-midAngle * RADIAN),
      y: cy + radius * Math.sin(-midAngle * RADIAN),
    };

    const textAnchor = endPoint.x > cx ? "start" : "end";
    const finalX = endPoint.x + (endPoint.x > cx ? 5 : -5);

    const shortName = name.length > 12 ? `${name.substring(0, 12)}...` : name;

    return (
      <g>
        <path
          d={`M ${startPoint.x},${startPoint.y} 
             L ${midPoint.x},${midPoint.y}
             L ${endPoint.x},${endPoint.y}`}
          stroke={COLORS[index % COLORS.length]}
          fill="none"
          strokeWidth={1}
          opacity={data ? 1 : 0.5}
        />

        <text
          x={finalX}
          y={endPoint.y}
          fill={COLORS[index % COLORS.length]}
          textAnchor={textAnchor}
          fontSize="12"
          alignmentBaseline="middle"
          opacity={data ? 1 : 0.5}
        >
          {`${shortName} (${value.toFixed(1)}%)`}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full h-[400px] relative">
      {!data && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-[#fff] text-sm opacity-50">Sample Data</div>
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            innerRadius="55%"
            outerRadius="75%"
            paddingAngle={4}
            dataKey="value"
            labelLine={false}
            label={renderCustomizedLabel}
            minAngle={2}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                className={`stroke-0 outline-none hover:opacity-80 transition-opacity ${
                  !data ? "opacity-30" : ""
                }`}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `${value.toFixed(1)}%`}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #4728E7",
              borderRadius: "4px",
              color: "#000",
              padding: "8px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConfidenceChart;

'use client';

import React, { useEffect, useState, useMemo } from 'react';

interface RequestDataPoint {
  timestamp: number;
  count: number;
  responseTime: number;
  statusCode: number;
}

interface RequestsOverTimeChartProps {
  data: RequestDataPoint[];
  width?: number;
  height?: number;
  timeRange?: '1h' | '24h' | '7d' | '30d';
}

export function RequestsOverTimeChart({
  data,
  width = 600,
  height = 200,
  timeRange = '24h',
}: RequestsOverTimeChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const filteredData = useMemo(() => {
    const now = Date.now();
    const ranges = {
      '1h': 3600000,
      '24h': 86400000,
      '7d': 604800000,
      '30d': 2592000000,
    };
    const cutoff = now - (ranges[timeRange] || ranges['24h']);
    return data.filter((d) => d.timestamp >= cutoff);
  }, [data, timeRange]);

  const maxRequests = Math.max(...filteredData.map((d) => d.count), 1);
  const maxResponseTime = Math.max(...filteredData.map((d) => d.responseTime), 1);

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-white">
          Requests Over Time
        </h3>
        <span className="text-xs text-gray-400">{timeRange}</span>
      </div>

      <svg width={width} height={height} className="w-full">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1={0}
            y1={(y / 100) * height}
            x2={width}
            y2={(y / 100) * height}
            stroke="#374151"
            strokeWidth={0.5}
          />
        ))}

        {/* Request bars */}
        {filteredData.map((point, i) => {
          const x = (i / filteredData.length) * width;
          const barHeight = (point.count / maxRequests) * height;
          const isHovered = hoveredPoint === i;

          return (
            <g
              key={i}
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <rect
                x={x}
                y={height - barHeight}
                width={width / filteredData.length - 2}
                height={barHeight}
                fill={point.statusCode >= 500 ? '#ef4444' : point.statusCode >= 400 ? '#f59e0b' : '#3b82f6'}
                opacity={isHovered ? 1 : 0.8}
                rx={2}
              />
              {isHovered && (
                <rect
                  x={x}
                  y={0}
                  width={width / filteredData.length - 2}
                  height={height}
                  fill="rgba(59, 130, 246, 0.1)"
                />
              )}
            </g>
          );
        })}
      </svg>

      {hoveredPoint !== null && filteredData[hoveredPoint] && (
        <div className="absolute bottom-4 right-4 bg-gray-800 border border-gray-600 rounded p-2 text-xs">
          <p className="text-white">
            Count: {filteredData[hoveredPoint].count}
          </p>
          <p className="text-gray-300">
            Response: {filteredData[hoveredPoint].responseTime}ms
          </p>
          <p className="text-gray-400">
            {new Date(filteredData[hoveredPoint].timestamp).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
}

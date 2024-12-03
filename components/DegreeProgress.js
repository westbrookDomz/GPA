import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const DegreeProgress = ({ totalCredits, requiredCredits = 120 }) => {
  const data = [
    { name: "Completed", value: totalCredits },
    { name: "Remaining", value: Math.max(requiredCredits - totalCredits, 0) },
  ];

  const COLORS = ["#4F46E5", "#E5E7EB"];

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Degree Progress</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${value} credits`}
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "0.75rem",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center mt-4">
        <p className="text-gray-600">
          {totalCredits} of {requiredCredits} credits completed
        </p>
        <p className="text-lg font-semibold text-indigo-600">
          {Math.round((totalCredits / requiredCredits) * 100)}% Complete
        </p>
      </div>
    </div>
  );
};

export default DegreeProgress;

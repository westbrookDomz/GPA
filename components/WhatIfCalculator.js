"use client";

import React, { useState } from "react";

const WhatIfCalculator = ({ currentGPA, totalCredits }) => {
  const [targetGPA, setTargetGPA] = useState("");
  const [plannedCredits, setPlannedCredits] = useState("");
  const [requiredGPA, setRequiredGPA] = useState(null);

  const calculateRequiredGPA = () => {
    const target = parseFloat(targetGPA);
    const planned = parseFloat(plannedCredits);

    if (target && planned) {
      const totalPoints = target * (totalCredits + planned);
      const currentPoints = currentGPA * totalCredits;
      const requiredPoints = totalPoints - currentPoints;
      const required = requiredPoints / planned;
      setRequiredGPA(Math.min(4.3, required));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">GPA Calculator</h2>

      <div className="space-y-6">
        {/* Current GPA Display */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">Current GPA</div>
          <div className="text-2xl font-bold text-indigo-600">
            {currentGPA.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">
            {totalCredits} credits completed
          </div>
        </div>

        {/* Calculator Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target GPA
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="4.3"
              value={targetGPA}
              onChange={(e) => setTargetGPA(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter target GPA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Planned Credits
            </label>
            <input
              type="number"
              value={plannedCredits}
              onChange={(e) => setPlannedCredits(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter planned credits"
            />
          </div>

          <button
            onClick={calculateRequiredGPA}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg 
                     hover:bg-indigo-700 transition-colors"
          >
            Calculate Required GPA
          </button>
        </div>

        {/* Results Display */}
        {requiredGPA !== null && (
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
            <div className="text-sm text-gray-600">
              Required GPA for remaining credits
            </div>
            <div className="text-3xl font-bold text-indigo-600">
              {requiredGPA.toFixed(2)}
            </div>
            {requiredGPA > 4.3 && (
              <div className="mt-2 text-sm text-red-600">
                Note: Target GPA may not be achievable with the given credits
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatIfCalculator;

import React, { useState } from "react";

const GPACalculator = ({ currentGPA, totalCredits }) => {
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
      setRequiredGPA(Math.min(4.0, required));
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">GPA Calculator</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Target GPA
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="4"
            value={targetGPA}
            onChange={(e) => setTargetGPA(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Planned Credits
          </label>
          <input
            type="number"
            value={plannedCredits}
            onChange={(e) => setPlannedCredits(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={calculateRequiredGPA}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Calculate
        </button>
        {requiredGPA !== null && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">Required GPA for remaining credits:</p>
            <p className="text-2xl font-bold text-indigo-600">
              {requiredGPA.toFixed(2)}
            </p>
            {requiredGPA > 4.0 && (
              <p className="text-sm text-red-500 mt-2">
                Note: Target GPA may not be achievable with the given credits.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GPACalculator;

import React, { useState } from "react";

const CoursePlanner = ({ courses, currentGPA }) => {
  const [plannedCourses, setPlannedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedCredits, setSelectedCredits] = useState(3);

  // Group courses by subject for recommendations
  const subjectGroups = courses.reduce((acc, course) => {
    const subject = course.code.match(/^[A-Z]+/)[0];
    if (!acc[subject]) acc[subject] = [];
    acc[subject].push(course);
    return acc;
  }, {});

  const addCourse = () => {
    if (selectedCourse) {
      setPlannedCourses([
        ...plannedCourses,
        {
          id: Date.now(),
          subject: selectedCourse,
          credits: selectedCredits,
        },
      ]);
      setSelectedCourse("");
    }
  };

  const removeCourse = (id) => {
    setPlannedCourses(plannedCourses.filter((course) => course.id !== id));
  };

  const totalCredits = plannedCourses.reduce(
    (sum, course) => sum + course.credits,
    0
  );

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Course Planner</h3>

      <div className="space-y-4 mb-8">
        <div className="flex gap-4">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="flex-1 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select Subject</option>
            {Object.keys(subjectGroups).map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>

          <select
            value={selectedCredits}
            onChange={(e) => setSelectedCredits(Number(e.target.value))}
            className="w-32 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          >
            {[1, 2, 3, 4, 5].map((credit) => (
              <option key={credit} value={credit}>
                {credit} credits
              </option>
            ))}
          </select>

          <button
            onClick={addCourse}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add Course
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {plannedCourses.map((course) => (
          <div
            key={course.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <span className="font-semibold">{course.subject}</span>
              <span className="text-gray-600 ml-2">
                ({course.credits} credits)
              </span>
            </div>
            <button
              onClick={() => removeCourse(course.id)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}

        {plannedCourses.length > 0 && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
            <div className="font-semibold text-gray-900">
              Total Credits: {totalCredits}
            </div>
            {totalCredits > 18 && (
              <p className="text-red-600 text-sm mt-1">
                Warning: High course load detected
              </p>
            )}
            {totalCredits < 12 && (
              <p className="text-yellow-600 text-sm mt-1">
                Note: Below full-time status
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePlanner;

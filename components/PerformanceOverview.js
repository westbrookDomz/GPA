import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import DegreeProgress from "./DegreeProgress";
import GPACalculator from "./GPACalculator";
import SemesterComparison from "./SemesterComparison";

const PerformanceOverview = ({ transcriptData }) => {
  const { overallGPA, semesterGPAs, topCourses, coursesByGrade, courses } =
    transcriptData;

  const [loading, setLoading] = useState(false);

  const GradePrediction = ({ transcriptData }) => {
    const predictGPA = () => {
      const recentGPAs = transcriptData.semesterGPAs.slice(-3);
      const trend =
        recentGPAs.reduce((acc, curr) => acc + curr.gpa, 0) / recentGPAs.length;
      return Math.min(4.0, trend + (trend - recentGPAs[0].gpa));
    };

    return (
      <div className="stat-card bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
        <h3 className="text-lg font-semibold opacity-90 mb-2">
          Predicted Next GPA
        </h3>
        <div className="text-5xl font-bold mb-2">{predictGPA().toFixed(2)}</div>
        <p className="text-purple-100">Based on your recent performance</p>
      </div>
    );
  };

  const ImprovementNeeded = ({ courses }) => {
    // Define threshold for "needs improvement" (e.g., grades below B-)
    const needsImprovement = courses
      .filter((course) => {
        const grade = course.grade;
        return (
          grade === "C+" ||
          grade === "C" ||
          grade === "C-" ||
          grade === "D+" ||
          grade === "D" ||
          grade === "F"
        );
      })
      .sort((a, b) => {
        // Sort by grade (worst first)
        const gradePoints = {
          F: 0,
          D: 1,
          "D+": 1.3,
          "C-": 1.7,
          C: 2.0,
          "C+": 2.3,
        };
        return gradePoints[a.grade] - gradePoints[b.grade];
      });

    if (needsImprovement.length === 0) {
      return (
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Courses Needing Improvement
          </h3>
          <div className="text-center text-gray-500 py-8">
            <p>Great job! No courses need improvement.</p>
            <p className="text-sm mt-2">All your grades are B- or better.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Courses Needing Improvement
        </h3>
        <div className="space-y-4">
          {needsImprovement.map((course) => (
            <div
              key={course.code}
              className="p-4 bg-red-50 rounded-xl border border-red-100
                        transform transition-all duration-200 hover:scale-[1.02]
                        hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-gray-900">
                    {course.name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {course.code}
                  </div>
                  <div className="text-sm text-red-600 mt-2">
                    {course.semester}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Grade:</span>
                  <span className="text-lg font-bold text-red-600">
                    {course.grade}
                  </span>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-500">
                {course.grade === "F" ? (
                  <p>Consider retaking this course to improve your GPA.</p>
                ) : (
                  <p>
                    Focus on strengthening fundamentals in this subject area.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {/* Top Stats Section */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Overall GPA Card */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
          <h3 className="text-lg font-semibold opacity-90 mb-2">Overall GPA</h3>
          <div className="text-5xl font-bold mb-2">{overallGPA.toFixed(2)}</div>
          <p className="text-blue-100">out of 4.3</p>
        </div>

        {/* Total Courses Card */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-8 text-white shadow-xl">
          <h3 className="text-lg font-semibold opacity-90 mb-2">
            Total Courses
          </h3>
          <div className="text-5xl font-bold mb-2">
            {coursesByGrade.reduce((acc, curr) => acc + curr.count, 0)}
          </div>
          <p className="text-orange-100">completed</p>
        </div>

        {/* Best Grade Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-xl">
          <h3 className="text-lg font-semibold opacity-90 mb-2">Best Grade</h3>
          <div className="text-5xl font-bold mb-2">
            {coursesByGrade[0]?.grade || "N/A"}
          </div>
          <p className="text-emerald-100">highest achieved</p>
        </div>
      </div>

      {/* GPA Trend Chart */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          GPA Progression
        </h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={semesterGPAs}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="semester"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                domain={[0, 4.3]}
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "0.75rem",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="gpa"
                stroke="#4F46E5"
                strokeWidth={3}
                dot={{ fill: "#4F46E5", strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Top Courses */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Top Performing Courses
          </h3>
          <div className="space-y-4">
            {topCourses.map((course, index) => (
              <div
                key={course.code}
                className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl 
                          transform transition-all duration-200 hover:scale-[1.02]
                          hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {course.name}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {course.code}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Grade:</span>
                    <span className="text-lg font-bold text-blue-600">
                      {course.grade}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Grade Distribution
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coursesByGrade}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="grade"
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "0.75rem",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#4F46E5"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ImprovementNeeded courses={courses} />
      </div>

      <div className="mt-8">
        <SemesterComparison semesterGPAs={semesterGPAs} courses={courses} />
      </div>

      <GradePrediction transcriptData={transcriptData} />
    </div>
  );
};

export default PerformanceOverview;

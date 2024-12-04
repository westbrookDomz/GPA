import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Add gradePoints object for GPA calculation
const gradePoints = {
  "A+": 4.3,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  F: 0.0,
};

const SemesterComparison = ({ semesterGPAs, courses }) => {
  // Calculate additional metrics per semester with proper GPA calculation
  const semesterMetrics = semesterGPAs.map((semester) => {
    const semesterCourses = courses.filter(
      (course) => course.semester === semester.semester
    );

    // Calculate semester GPA properly
    const totalPoints = semesterCourses.reduce((sum, course) => {
      const gradePoint = gradePoints[course.grade] || 0;
      return sum + gradePoint * course.credits;
    }, 0);

    const totalCredits = semesterCourses.reduce(
      (sum, course) => sum + course.credits,
      0
    );

    const semesterGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;

    return {
      semester: semester.semester,
      gpa: semesterGPA,
      courseCount: semesterCourses.length,
      totalCredits: totalCredits,
      highestGrade: semesterCourses.reduce((max, c) => {
        const currentGradePoint = gradePoints[c.grade] || 0;
        return currentGradePoint > max ? currentGradePoint : max;
      }, 0),
    };
  });

  return (
    <div className="github-card p-8">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-[#c9d1d9] mb-6">
        Semester Comparison
      </h3>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={semesterMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="semester" />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="#4F46E5"
              domain={[0, 4.3]} // Update domain to match max possible GPA
              tickFormatter={(value) => value.toFixed(1)}
            />
            <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "0.75rem",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value, name) => {
                if (name === "GPA") return value.toFixed(2);
                return value;
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="gpa"
              name="GPA"
              fill="#4F46E5"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="courseCount"
              name="Courses"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        {semesterMetrics.map((semester) => (
          <div
            key={semester.semester}
            className="p-4 bg-[var(--color-canvas-subtle)] rounded-lg 
                      hover:bg-[var(--color-btn-hover-bg)] transition-colors
                      border border-[var(--color-border-default)]"
          >
            <h4 className="font-semibold text-gray-900 dark:text-[#c9d1d9]">
              {semester.semester}
            </h4>
            <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-[#8b949e]">
              <p>GPA: {semester.gpa.toFixed(2)}</p>
              <p>Courses: {semester.courseCount}</p>
              <p>Credits: {semester.totalCredits}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SemesterComparison;

import React from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip,
} from "recharts";

const SubjectAnalysis = ({ courses }) => {
  // Group courses by subject (first 2-4 characters of course code)
  const subjectPerformance = courses.reduce((acc, course) => {
    const subject = course.code.match(/^[A-Z]+/)[0];
    if (!acc[subject]) {
      acc[subject] = {
        subject,
        courses: [],
        totalPoints: 0,
        totalCredits: 0,
      };
    }
    const gradePoint = course.gradePoint || 0;
    acc[subject].courses.push(course);
    acc[subject].totalPoints += gradePoint * course.credits;
    acc[subject].totalCredits += course.credits;
    return acc;
  }, {});

  // Calculate average GPA for each subject
  const subjectData = Object.values(subjectPerformance).map((subject) => ({
    subject: subject.subject,
    gpa:
      subject.totalCredits > 0 ? subject.totalPoints / subject.totalCredits : 0,
    courses: subject.courses.length,
  }));

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Performance by Subject
      </h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={subjectData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <Tooltip
              formatter={(value) => `GPA: ${value.toFixed(2)}`}
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "0.75rem",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Radar
              name="GPA"
              dataKey="gpa"
              stroke="#4F46E5"
              fill="#4F46E5"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        {subjectData.map((subject) => (
          <div
            key={subject.subject}
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h4 className="font-semibold text-gray-900">{subject.subject}</h4>
            <p className="text-sm text-gray-600">
              GPA: {subject.gpa.toFixed(2)} ({subject.courses} courses)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectAnalysis;

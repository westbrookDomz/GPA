"use client";

import React from "react";

const CourseRecommendations = ({ courses = [], currentGPA = 3.0 }) => {
  // Group courses by subject
  const subjectPerformance = courses.reduce((acc, course) => {
    const subject = course.code.match(/^[A-Z]+/)?.[0] || "";
    if (!acc[subject]) acc[subject] = [];
    acc[subject].push(course);
    return acc;
  }, {});

  // Find strong subjects
  const strongSubjects = Object.entries(subjectPerformance)
    .map(([subject, courses]) => ({
      subject,
      avgGPA:
        courses.reduce((sum, c) => sum + c.gradePoint, 0) / courses.length,
    }))
    .filter(({ avgGPA }) => avgGPA > currentGPA);

  // Calculate average credits
  const semesters = new Set(courses.map((c) => c.semester));
  const avgCredits =
    courses.reduce((sum, c) => sum + c.credits, 0) / semesters.size;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Course Recommendations</h2>
      <div className="space-y-4">
        {strongSubjects.map(({ subject }, index) => (
          <div key={index} className="p-4 bg-blue-50 rounded-lg">
            <div className="font-semibold">
              Consider taking advanced courses in {subject}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              You've shown strong performance in this subject area
            </p>
          </div>
        ))}
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="font-semibold">
            Recommended credits per semester: {Math.round(avgCredits)}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Based on your historical performance
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseRecommendations;

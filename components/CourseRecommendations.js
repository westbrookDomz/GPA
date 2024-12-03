import React from "react";

const CourseRecommendations = ({ courses, currentGPA }) => {
  // Analyze course patterns and performance
  const getRecommendations = () => {
    const recommendations = [];

    // Group courses by subject
    const subjectPerformance = courses.reduce((acc, course) => {
      const subject = course.code.match(/^[A-Z]+/)[0];
      if (!acc[subject]) {
        acc[subject] = [];
      }
      acc[subject].push(course);
      return acc;
    }, {});

    // Find strong subjects (above average performance)
    const strongSubjects = Object.entries(subjectPerformance)
      .map(([subject, courses]) => {
        const avgGPA =
          courses.reduce((sum, c) => sum + (c.gradePoint || 0), 0) /
          courses.length;
        return { subject, avgGPA };
      })
      .filter(({ avgGPA }) => avgGPA > currentGPA);

    // Generate recommendations
    if (strongSubjects.length > 0) {
      recommendations.push({
        type: "strength",
        message: `Consider taking advanced courses in ${strongSubjects[0].subject}`,
        reason: "You've shown strong performance in this subject area",
      });
    }

    // Add workload recommendation
    const avgCreditsPerSemester =
      courses.reduce((sum, c) => sum + c.credits, 0) /
      new Set(courses.map((c) => c.semester)).size;

    recommendations.push({
      type: "workload",
      message: `Recommended credits per semester: ${Math.round(
        avgCreditsPerSemester
      )}`,
      reason: "Based on your historical performance and course load",
    });

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Course Recommendations
      </h3>
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl"
          >
            <div className="font-semibold text-gray-900">{rec.message}</div>
            <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseRecommendations;

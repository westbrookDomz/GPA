import React, { useState, useEffect } from "react";
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
import { motion } from "framer-motion";
import { Tooltip as TooltipComponent } from "./Tooltip";

const PerformanceOverview = ({ transcriptData }) => {
  const { overallGPA, semesterGPAs, topCourses, coursesByGrade, courses } =
    transcriptData;

  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");

  // Add theme detection
  useEffect(() => {
    // Check if user prefers dark mode
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setTheme(prefersDark ? "dark" : "light");

    // Listen for theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      setTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // CSS variables for theming
  const themeColors = {
    light: {
      bgSecondary: "#f6f8fa",
      borderDefault: "#d0d7de",
      fg: "#24292f",
      fgMuted: "#57606a",
      accent: "#0969da",
    },
    dark: {
      bgSecondary: "#161b22",
      borderDefault: "#30363d",
      fg: "#c9d1d9",
      fgMuted: "#8b949e",
      accent: "#58a6ff",
    },
  };

  const currentTheme = themeColors[theme];

  const GradePrediction = ({ transcriptData }) => {
    const predictGPA = () => {
      const recentGPAs = transcriptData.semesterGPAs.slice(-3);
      const trend =
        recentGPAs.reduce((acc, curr) => acc + curr.gpa, 0) / recentGPAs.length;
      return Math.min(4.0, trend + (trend - recentGPAs[0].gpa));
    };

    return (
      <div className="github-card p-8 bg-[var(--color-accent-subtle)]">
        <h3 className="text-lg font-semibold opacity-90 mb-2">
          Predicted Next GPA
        </h3>
        <div className="text-5xl font-bold mb-2 text-[var(--color-accent-fg)]">
          {predictGPA().toFixed(2)}
        </div>
        <p className="text-gray-600">Based on your recent performance</p>
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
        <div className="github-card p-8">
          <h3 className="text-github-fg dark:text-github-dark-fg text-2xl font-bold mb-6">
            Courses Needing Improvement
          </h3>
          <div className="text-center bg-[var(--color-success-subtle)] p-8 rounded-lg">
            <p className="text-github-fg dark:text-github-dark-fg">
              Great job! No courses need improvement.
            </p>
            <p className="text-github-fg-muted dark:text-github-dark-fg-muted text-sm mt-2">
              All your grades are B- or better.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="github-card p-8">
        <h3 className="text-github-fg dark:text-github-dark-fg text-2xl font-bold mb-6">
          Courses Needing Improvement
        </h3>
        <div className="space-y-4">
          {needsImprovement.map((course) => (
            <div
              key={course.code}
              className="p-4 bg-[var(--color-danger-subtle)] rounded-lg 
                        border border-[var(--color-danger-fg)] border-opacity-20"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-github-fg dark:text-github-dark-fg">
                    {course.name}
                  </div>
                  <div className="text-sm text-github-fg-muted dark:text-github-dark-fg-muted mt-1">
                    {course.code}
                  </div>
                  <div className="text-sm text-github-danger dark:text-github-dark-danger mt-2">
                    {course.semester}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-github-fg-muted dark:text-github-dark-fg-muted">
                    Grade:
                  </span>
                  <span className="text-lg font-bold text-github-danger dark:text-github-dark-danger">
                    {course.grade}
                  </span>
                </div>
              </div>
              <div className="mt-3 text-sm text-github-fg-muted dark:text-github-dark-fg-muted">
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
        <div className="github-card p-6">
          <h3 className="text-github-fg-muted dark:text-github-dark-fg-muted text-sm font-medium mb-2">
            Overall GPA
          </h3>
          <div className="text-4xl font-bold text-github-fg dark:text-github-dark-fg mb-2">
            {overallGPA.toFixed(2)}
          </div>
          <p className="text-github-fg-muted dark:text-github-dark-fg-muted text-sm">
            out of 4.3
          </p>
        </div>

        {/* Total Courses Card */}
        <div className="github-card p-6">
          <h3 className="text-github-fg-muted dark:text-github-dark-fg-muted text-sm font-medium mb-2">
            Total Courses
          </h3>
          <div className="text-4xl font-bold text-github-fg dark:text-github-dark-fg mb-2">
            {coursesByGrade.reduce((acc, curr) => acc + curr.count, 0)}
          </div>
          <p className="text-github-fg-muted dark:text-github-dark-fg-muted text-sm">
            completed
          </p>
        </div>

        {/* Best Grade Card */}
        <div className="github-card p-6">
          <h3 className="text-github-fg-muted dark:text-github-dark-fg-muted text-sm font-medium mb-2">
            Best Grade
          </h3>
          <div className="text-4xl font-bold text-github-fg dark:text-github-dark-fg mb-2">
            {coursesByGrade[0]?.grade || "N/A"}
          </div>
          <p className="text-github-fg-muted dark:text-github-dark-fg-muted text-sm">
            highest achieved
          </p>
        </div>
      </div>

      {/* GPA Trend Chart */}
      <div className="github-card p-6">
        <h3 className="github-header">GPA Progression</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={semesterGPAs}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border-default)"
              />
              <XAxis
                dataKey="semester"
                stroke="var(--color-fg-muted)"
                tick={{ fill: "var(--color-fg-muted)" }}
              />
              <YAxis
                domain={[0, 4.3]}
                stroke="var(--color-fg-muted)"
                tick={{ fill: "var(--color-fg-muted)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-bg-secondary)",
                  border: "1px solid var(--color-border-default)",
                  borderRadius: "6px",
                  color: "var(--color-fg)",
                }}
                labelStyle={{
                  color: "var(--color-fg-muted)",
                }}
              />
              <Legend
                wrapperStyle={{
                  color: "var(--color-fg-muted)",
                }}
              />
              <Line
                type="monotone"
                dataKey="gpa"
                name="GPA"
                stroke="var(--color-accent)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-accent)",
                  strokeWidth: 2,
                }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Update the style tag */}
      <style jsx global>{`
        :root {
          --color-bg-secondary: ${currentTheme.bgSecondary};
          --color-border-default: ${currentTheme.borderDefault};
          --color-fg: ${currentTheme.fg};
          --color-fg-muted: ${currentTheme.fgMuted};
          --color-accent: ${currentTheme.accent};
        }
      `}</style>

      {/* Bottom Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Top Courses */}
        <div className="github-card p-8">
          <h3 className="text-github-fg dark:text-github-dark-fg text-2xl font-bold mb-6">
            Top Performing Courses
          </h3>
          <div className="space-y-4">
            {topCourses.map((course, index) => (
              <div
                key={course.code}
                className={`
                  p-4 bg-[var(--color-canvas-subtle)] rounded-lg border
                  border-[var(--color-border-default)] 
                  hover:bg-white dark:hover:bg-github-dark-bg-secondary
                  transition-colors duration-200
                `}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-github-fg dark:text-github-dark-fg">
                      {course.name}
                    </div>
                    <div className="text-sm text-github-fg-muted dark:text-github-dark-fg-muted mt-1">
                      {course.code}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-github-fg-muted dark:text-github-dark-fg-muted">
                      Grade:
                    </span>
                    <span className="text-lg font-bold text-github-accent dark:text-github-dark-accent">
                      {course.grade}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="github-card p-8">
          <h3 className="text-github-fg dark:text-github-dark-fg text-2xl font-bold mb-6">
            Grade Distribution
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coursesByGrade}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border-default)"
                  className="dark:opacity-20"
                />
                <XAxis
                  dataKey="grade"
                  stroke="var(--color-fg-muted)"
                  tick={{ fill: "var(--color-fg-muted)" }}
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="var(--color-fg-muted)"
                  tick={{ fill: "var(--color-fg-muted)" }}
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-bg-secondary)",
                    border: "1px solid var(--color-border-default)",
                    borderRadius: "6px",
                    color: "var(--color-fg)",
                  }}
                  labelStyle={{
                    color: "var(--color-fg-muted)",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="var(--color-accent)"
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

import Papa from "papaparse";
import * as XLSX from "xlsx";

export const parseTranscript = async (fileData, fileType) => {
  let data = [];

  try {
    // Handle different file types
    switch (fileType) {
      case "csv":
        const csvResult = Papa.parse(fileData, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => {
            const headerMap = {
              "course code": "CourseCode",
              "course name": "CourseName",
              credits: "Credits",
              grade: "Grade",
              semester: "Semester",
            };
            return headerMap[header.toLowerCase()] || header;
          },
          transform: (value) => value.trim(),
        });
        data = csvResult.data;
        break;

      case "excel":
        const workbook = XLSX.read(fileData, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        data = XLSX.utils.sheet_to_json(worksheet);
        break;

      case "pdf":
        throw new Error("PDF parsing not yet implemented");

      default:
        throw new Error("Unsupported file type");
    }

    // Validate data structure
    if (!data || data.length === 0) {
      throw new Error("No data found in file");
    }

    // Validate and process the data
    const courses = data
      .filter((row) => row.CourseCode && row.Grade)
      .map((row) => ({
        code: row.CourseCode || row["Course Code"],
        name: row.CourseName || row["Course Name"],
        credits: parseFloat(row.Credits) || 0,
        grade: (row.Grade || "").toUpperCase(),
        semester: row.Semester,
        gradePoint: convertGradeToPoint((row.Grade || "").toUpperCase()),
      }));

    if (courses.length === 0) {
      throw new Error("No valid course data found");
    }

    // Calculate statistics
    const totalPoints = courses.reduce(
      (sum, course) => sum + course.gradePoint * course.credits,
      0
    );
    const totalCredits = courses.reduce(
      (sum, course) => sum + course.credits,
      0
    );
    const overallGPA = totalPoints / totalCredits;

    return {
      overallGPA,
      semesterGPAs: calculateSemesterGPAs(courses),
      topCourses: courses
        .filter((course) => ["A+", "A", "A-"].includes(course.grade))
        .sort((a, b) => b.gradePoint - a.gradePoint)
        .slice(0, 5),
      coursesByGrade: calculateGradeDistribution(courses),
      courses,
    };
  } catch (error) {
    console.error("Error parsing file:", error);
    throw new Error(error.message || "Failed to parse transcript data");
  }
};

// Helper function to convert letter grades to grade points
const convertGradeToPoint = (grade) => {
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
  return gradePoints[grade] || 0;
};

// Helper function to calculate semester GPAs
const calculateSemesterGPAs = (courses) => {
  const semesterMap = {};

  courses.forEach((course) => {
    if (!semesterMap[course.semester]) {
      semesterMap[course.semester] = {
        totalPoints: 0,
        totalCredits: 0,
      };
    }
    semesterMap[course.semester].totalPoints +=
      course.gradePoint * course.credits;
    semesterMap[course.semester].totalCredits += course.credits;
  });

  return Object.entries(semesterMap)
    .map(([semester, data]) => ({
      semester,
      gpa: data.totalPoints / data.totalCredits,
    }))
    .sort((a, b) => a.semester.localeCompare(b.semester));
};

// Helper function to calculate grade distribution
const calculateGradeDistribution = (courses) => {
  const gradeCount = {};
  courses.forEach((course) => {
    gradeCount[course.grade] = (gradeCount[course.grade] || 0) + 1;
  });

  return Object.entries(gradeCount)
    .map(([grade, count]) => ({ grade, count }))
    .sort(
      (a, b) => convertGradeToPoint(b.grade) - convertGradeToPoint(a.grade)
    );
};

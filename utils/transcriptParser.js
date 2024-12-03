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

export const parseTranscript = (fileData, fileType) => {
  let courses = [];

  if (fileType === "pdf") {
    courses = parsePDFTranscript(fileData);
  } else if (fileType === "excel") {
    courses = parseExcelTranscript(fileData);
  }

  // Add console logs to debug
  console.log("Parsed Courses:", courses);

  // Calculate overall GPA
  const totalPoints = courses.reduce((sum, course) => {
    const gradePoint = gradePoints[course.grade] || 0;
    console.log(
      `Course: ${course.code}, Grade: ${course.grade}, Points: ${gradePoint}, Credits: ${course.credits}`
    );
    return sum + gradePoint * parseFloat(course.credits);
  }, 0);

  const totalCredits = courses.reduce((sum, course) => {
    return sum + parseFloat(course.credits);
  }, 0);

  console.log("Total Points:", totalPoints);
  console.log("Total Credits:", totalCredits);

  const overallGPA = totalPoints / totalCredits;
  console.log("Calculated GPA:", overallGPA);

  // Calculate semester GPAs
  const semesterGroups = courses.reduce((groups, course) => {
    if (!groups[course.semester]) {
      groups[course.semester] = [];
    }
    groups[course.semester].push(course);
    return groups;
  }, {});

  const semesterGPAs = Object.entries(semesterGroups)
    .map(([semester, courses]) => {
      const semesterPoints = courses.reduce((sum, course) => {
        const gradePoint = gradePoints[course.grade] || 0;
        return sum + gradePoint * parseFloat(course.credits);
      }, 0);

      const semesterCredits = courses.reduce((sum, course) => {
        return sum + parseFloat(course.credits);
      }, 0);

      return {
        semester,
        gpa: semesterPoints / semesterCredits,
      };
    })
    .sort((a, b) => a.semester.localeCompare(b.semester));

  // Get top courses (by grade)
  const topCourses = findTopCourses(courses);

  // Calculate grade distribution
  const gradeDistribution = courses.reduce((dist, course) => {
    if (!dist[course.grade]) {
      dist[course.grade] = 0;
    }
    dist[course.grade]++;
    return dist;
  }, {});

  const coursesByGrade = Object.entries(gradeDistribution)
    .map(([grade, count]) => ({ grade, count }))
    .sort((a, b) => (gradePoints[b.grade] || 0) - (gradePoints[a.grade] || 0));

  return {
    overallGPA: isNaN(overallGPA) ? 0 : overallGPA,
    semesterGPAs,
    topCourses,
    coursesByGrade,
    courses,
  };
};

const parsePDFTranscript = (textContent) => {
  // Updated regex pattern to match common transcript formats
  const coursePattern = new RegExp(
    // Combine the pattern parts without comments
    "(" +
      "\\d{4}[-\\s](?:Fall|Spring|Summer)|\\d{4}" + // Semester/Year
      ")\\s*[-:]?\\s*" +
      "(" +
      "[A-Z]{2,4}[-\\s]?\\d{3,4}[A-Z]?" + // Course Code
      ")\\s*[-:]?\\s*" +
      "(" +
      "[^*\\n\\d]{3,}?" + // Course Name
      ")\\s*" +
      "(" +
      "[A-Z][+-]?|[0-9]{1,3}" + // Grade
      ")\\s*" +
      "(" +
      "\\d{1,2}(?:\\.\\d{1,2})?" + // Credits
      ")\\s*",
    "i" // Case insensitive flag
  );

  const courses = [];
  let currentSemester = null;

  // First pass: find all semester headers
  const semesterPattern =
    /(?:Fall|Spring|Summer)\s+\d{4}|(?:\d{4})[-\s](?:Fall|Spring|Summer)/gi;
  const semesterMatches = [...textContent.matchAll(semesterPattern)];

  // Split text into lines for better processing
  const lines = textContent.split(/\r?\n/);

  lines.forEach((line) => {
    // Check if this line contains a semester header
    const semesterMatch = line.match(semesterPattern);
    if (semesterMatch) {
      currentSemester = semesterMatch[0];
      return;
    }

    // Try to match course information
    const match = line.match(coursePattern);
    if (match) {
      const courseData = {
        semester: currentSemester,
        code: match[2].trim(),
        name: match[3].trim().replace(/\s+/g, " "), // Normalize spaces
        grade: match[4].trim(),
        credits: parseFloat(match[5]),
      };

      if (validateCourseData(courseData)) {
        courses.push(courseData);
      }
    }
  });

  return courses;
};

const parseExcelTranscript = (jsonData) => {
  // Add validation and cleaning of data
  const cleanedData = jsonData
    .map((row) => {
      // Ensure grade is in correct format
      const grade = row.Grade?.trim?.() || "";
      // Ensure credits is a number
      const credits = parseFloat(row.Credits) || 0;

      return {
        code: row.CourseCode?.trim() || "",
        name: row.CourseName?.trim() || "",
        grade: grade,
        credits: credits,
        semester: row.Semester?.trim() || "",
      };
    })
    .filter(
      (course) =>
        course.code &&
        course.grade &&
        course.credits > 0 &&
        gradePoints[course.grade] !== undefined
    );

  console.log("Cleaned Excel Data:", cleanedData);
  return cleanedData;
};

const calculateGPA = (grades) => {
  if (grades.length === 0) return 0;

  const totalPoints = grades.reduce((sum, course) => {
    return sum + gradePoints[course.grade] * course.credits;
  }, 0);

  const totalCredits = grades.reduce((sum, course) => sum + course.credits, 0);

  return totalPoints / totalCredits;
};

const calculateSemesterGPAs = (courses) => {
  const semesterGroups = {};

  courses.forEach((course) => {
    if (!semesterGroups[course.semester]) {
      semesterGroups[course.semester] = [];
    }
    semesterGroups[course.semester].push(course);
  });

  return Object.entries(semesterGroups)
    .map(([semester, courses]) => ({
      semester,
      gpa: calculateGPA(courses),
    }))
    .sort((a, b) => a.semester.localeCompare(b.semester));
};

const calculateOverallGPA = (courses) => {
  return calculateGPA(courses);
};

const findTopCourses = (courses) => {
  return [...courses]
    .sort((a, b) => {
      // First compare by grade points
      const gradePointDiff =
        (gradePoints[b.grade] || 0) - (gradePoints[a.grade] || 0);
      if (gradePointDiff !== 0) return gradePointDiff;

      // If grades are equal, compare by credits
      const creditDiff = parseFloat(b.credits) - parseFloat(a.credits);
      if (creditDiff !== 0) return creditDiff;

      // If credits are equal, sort by course code
      return a.code.localeCompare(b.code);
    })
    .slice(0, 5);
};

const calculateGradeDistribution = (courses) => {
  const distribution = {};

  courses.forEach((course) => {
    if (!distribution[course.grade]) {
      distribution[course.grade] = 0;
    }
    distribution[course.grade]++;
  });

  return Object.entries(distribution)
    .map(([grade, count]) => ({ grade, count }))
    .sort((a, b) => gradePoints[b.grade] - gradePoints[a.grade]);
};

const determineSemester = (textContent, position) => {
  // Common semester patterns
  const semesterPatterns = [
    // Pattern 1: "Fall 2023", "Spring 2023", etc.
    /(?:Fall|Spring|Summer|Winter)\s+\d{4}/gi,

    // Pattern 2: "2023 Fall", "2023 Spring", etc.
    /\d{4}\s+(?:Fall|Spring|Summer|Winter)/gi,

    // Pattern 3: "FA23", "SP23", etc.
    /(?:FA|SP|SU|WI)\s*\d{2}/gi,

    // Pattern 4: "2023-1", "2023-2", etc.
    /\d{4}-[1-3]/g,
  ];

  // Find all semester headers in the text
  let allMatches = [];
  semesterPatterns.forEach((pattern) => {
    const matches = [...textContent.matchAll(pattern)];
    allMatches = [...allMatches, ...matches];
  });

  // Sort matches by their position in the text
  allMatches.sort((a, b) => a.index - b.index);

  // Find the semester header that precedes the current position
  for (let i = 0; i < allMatches.length; i++) {
    if (position < allMatches[i].index) {
      // Return the previous semester header, or the first one if we're at the beginning
      return standardizeSemesterFormat(
        allMatches[i - 1]?.[0] || allMatches[0][0]
      );
    }
  }

  // If we're after all headers, return the last one
  return allMatches.length > 0
    ? standardizeSemesterFormat(allMatches[allMatches.length - 1][0])
    : "Unknown Semester";
};

// Helper function to standardize semester format
const standardizeSemesterFormat = (semester) => {
  // Convert various formats to "Season YYYY" format
  semester = semester.toUpperCase();

  // Handle abbreviated formats (FA23, SP23, etc.)
  if (semester.match(/^(FA|SP|SU|WI)\s*\d{2}$/)) {
    const season = {
      FA: "Fall",
      SP: "Spring",
      SU: "Summer",
      WI: "Winter",
    }[semester.substring(0, 2)];
    const year = "20" + semester.slice(-2);
    return `${season} ${year}`;
  }

  // Handle numeric semester format (2023-1, 2023-2, etc.)
  if (semester.match(/^\d{4}-[1-3]$/)) {
    const [year, term] = semester.split("-");
    const season = {
      1: "Spring",
      2: "Summer",
      3: "Fall",
    }[term];
    return `${season} ${year}`;
  }

  // Handle "YYYY Season" format
  if (semester.match(/^\d{4}\s+/)) {
    const [year, season] = semester.split(/\s+/);
    return `${season.charAt(0)}${season.slice(1).toLowerCase()} ${year}`;
  }

  // Handle "Season YYYY" format (already correct)
  if (semester.match(/^(?:FALL|SPRING|SUMMER|WINTER)\s+\d{4}$/)) {
    return semester.charAt(0) + semester.slice(1).toLowerCase();
  }

  return semester;
};

export const analyzePerformance = (courses) => {
  // Implement performance analysis logic
  // Return insights about the student's performance
};

const validateCourseData = (course) => {
  const isValid =
    course.code?.length >= 5 && // At least 5 chars (e.g., "CS101")
    course.name?.length >= 3 && // At least 3 chars
    course.grade && // Grade exists
    !isNaN(course.credits) && // Credits is a number
    course.credits > 0; // Credits is positive

  return isValid;
};

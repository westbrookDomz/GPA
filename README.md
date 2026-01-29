# Academic Performance Analysis

A powerful Next.js application designed to visualize and analyze your academic journey. Upload your transcript data to gain insights into your GPA trends, grade distributions, and degree progress.

## 🚀 Features

- **Transcript Analysis**: Parse and visualize transcript data from CSV or Excel files.
- **Interactive Dashboards**:
  - **Performance Overview**: At-a-glance view of your academic standing.
  - **Semester Comparison**: Compare performance across different semesters.
  - **Subject Analysis**: Break down your grades by subject or course code.
- **GPA Tools**:
  - **Smart Calculation**: Automatically calculates overall and semester-wise GPAs.
  - **"What If" Calculator**: Simulate future grades to see how they affect your overall GPA.
- **Degree Progress**: Track your credit completion and progress towards graduation.
- **Report Generation**: Export analysis results and transcripts as styled PDF documents.
- **Privacy First**: All data processing happens client-side; your academic data never leaves your browser.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **UI Library**: [React 18](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Visualization**: [Recharts](https://recharts.org/)
- **Data Processing**:
  - [PapaParse](https://www.papaparse.com/) (CSV)
  - [SheetJS (xlsx)](https://sheetjs.com/) (Excel)
- **PDF Generation**: [@react-pdf/renderer](https://react-pdf.org/)

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/gpa-overtime.git
   cd gpa-overtime
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3001](http://localhost:3001) to see the application.

## 📂 Project Structure

```bash
├── components/          # Reusable UI components and analysis widgets
│   ├── PerformanceOverview.js  # Main dashboard component
│   ├── GPACalculator.js        # Logic for GPA computation
│   └── ...
├── pages/              # Next.js pages and routing
│   └── index.js        # Main entry point
├── public/             # Static assets
├── utils/              # Helper functions and parsers
│   └── transcriptParser.js # Logic for parsing CSV/Excel files
└── styles/             # Global styles and Tailwind config
```

## 📝 Usage Guide

1. **Prepare your Transcript**: Export your transcript as a CSV or Excel (`.xlsx`) file.
   - _Supported Headers_: `Course Code`, `Course Name`, `Credits`, `Grade`, `Semester`.
2. **Upload**: Click the upload area on the home page and select your file.
3. **Analyze**: Explore the dashboard to see your GPA trends and performance breakdown.
4. **Plan**: Use the "What If" calculator to plan your future semesters.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

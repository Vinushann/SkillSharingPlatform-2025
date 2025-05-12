// learningPlans.ts
interface Subtopic {
  name: string;
  description: string;
  duration: string;
  resource: string;
  clicked: boolean;
  goals?: string;
  exercises?: string;
}

interface LearningPlan {
  title: string;
  duration: string;
  subtopics: Subtopic[];
}

const learningPlans: LearningPlan[] = [
  {
    title: "Frontend Development Learning",
    duration: "3 weeks",
    subtopics: [
      {
        name: "HTML Basics",
        description: "Learn the fundamentals of HTML to structure web content.",
        duration: "5 days",
        resource: "https://www.youtube.com/watch?v=pQN-pnXPaVg",
        clicked: false,
      },
      {
        name: "CSS Foundations",
        description:
          "Style web pages with CSS, focusing on layouts, colors, and responsive design.",
        duration: "5 days",
        resource: "https://www.youtube.com/watch?v=1Rs2ND1ryYc",
        clicked: false,
      },
      {
        name: "React Introduction",
        description: "Build dynamic user interfaces using React.",
        duration: "5 days",
        resource: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
        clicked: false,
      },
      {
        name: "JavaScript for React",
        description:
          "Understand JavaScript concepts essential for React development.",
        duration: "3 days",
        resource: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
        clicked: false,
      },
      {
        name: "State Management",
        description: "Learn state management in React using hooks.",
        duration: "3 days",
        resource: "https://www.youtube.com/watch?v=9lCbmWw3xBg",
        clicked: false,
      },
    ],
  },

  {
    title: "AI for Starters",
    duration: "4 weeks",
    subtopics: [
      {
        name: "Python Basics",
        description: "Master Python programming for AI and data science.",
        duration: "5 days",
        resource: "https://www.youtube.com/watch?v=rfscVS0vtbw",
        clicked: false,
      },
      {
        name: "Numpy Essentials",
        description:
          "Perform numerical operations with Numpy for data handling.",
        duration: "5 days",
        resource: "https://www.youtube.com/watch?v=QUT1VHiLmmI",
        clicked: false,
      },
      {
        name: "Pandas for Data Analysis",
        description: "Use Pandas for data manipulation and analysis.",
        duration: "7 days",
        resource: "https://www.youtube.com/watch?v=vmEHCJofslg",
        clicked: false,
      },
      {
        name: "Data Visualization",
        description: "Visualize data using Matplotlib and Seaborn.",
        duration: "5 days",
        resource: "https://www.youtube.com/watch?v=3Xc3CA655Y4",
        clicked: false,
      },
      {
        name: "Intro to Machine Learning",
        description: "Get started with basic ML concepts using Scikit-learn.",
        duration: "5 days",
        resource: "https://www.youtube.com/watch?v=7eh4d6sabA0",
        clicked: false,
      },
    ],
  },
];

export default learningPlans;
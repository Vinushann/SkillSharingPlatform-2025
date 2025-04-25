// learningPlans.js
const learningPlans = [
    {
      title: "Frontend Development Learning",
      duration: "3 weeks",
      subtopics: [
        {
          name: "HTML Basics",
          description: "Learn the fundamentals of HTML to structure web content.",
          duration: "5 days",
          resource: "https://www.youtube.com/watch?v=pQN-pnXPaVg",
          goals: "Understand HTML tags, elements, and semantic structure.",
          exercises: "Build a simple webpage with headings, paragraphs, and lists."
        },
        {
          name: "CSS Foundations",
          description: "Style web pages with CSS, focusing on layouts, colors, and responsive design.",
          duration: "5 days",
          resource: "https://www.youtube.com/watch?v=1Rs2ND1ryYc",
          goals: "Master CSS selectors, box model, and Flexbox.",
          exercises: "Create a responsive landing page with CSS."
        },
        {
          name: "React Introduction",
          description: "Build dynamic user interfaces using React.",
          duration: "5 days",
          resource: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
          goals: "Learn React components, state, and props.",
          exercises: "Build a simple to-do list app with React."
        },
        {
          name: "JavaScript for React",
          description: "Understand JavaScript concepts essential for React development.",
          duration: "3 days",
          resource: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
          goals: "Understand ES6+ features like arrow functions and destructuring.",
          exercises: "Write functions to manipulate arrays and objects."
        },
        {
          name: "State Management",
          description: "Learn state management in React using hooks.",
          duration: "3 days",
          resource: "https://www.youtube.com/watch?v=9lCbmWw3xBg",
          goals: "Use useState and useEffect hooks effectively.",
          exercises: "Create a counter app with state management."
        }
      ]
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
          goals: "Learn Python syntax, variables, and control structures.",
          exercises: "Write a Python script to calculate factorials."
        },
        {
          name: "Numpy Essentials",
          description: "Perform numerical operations with Numpy for data handling.",
          duration: "5 days",
          resource: "https://www.youtube.com/watch?v=QUT1VHiLmmI",
          goals: "Understand arrays, indexing, and basic operations.",
          exercises: "Perform matrix operations using Numpy."
        },
        {
          name: "Pandas for Data Analysis",
          description: "Use Pandas for data manipulation and analysis.",
          duration: "7 days",
          resource: "https://www.youtube.com/watch?v=vmEHCJofslg",
          goals: "Learn DataFrames, filtering, and aggregation.",
          exercises: "Analyze a CSV dataset using Pandas."
        },
        {
          name: "Data Visualization",
          description: "Visualize data using Matplotlib and Seaborn.",
          duration: "5 days",
          resource: "https://www.youtube.com/watch?v=3Xc3CA655Y4",
          goals: "Create plots like bar charts and scatter plots.",
          exercises: "Plot a dataset to identify trends."
        },
        {
          name: "Intro to Machine Learning",
          description: "Get started with basic ML concepts using Scikit-learn.",
          duration: "5 days",
          resource: "https://www.youtube.com/watch?v=7eh4d6sabA0",
          goals: "Understand supervised learning and simple models.",
          exercises: "Build a linear regression model."
        }
      ]
    },
    {
      title: "DevOps Essentials",
      duration: "2 weeks",
      subtopics: [
        {
          name: "Git Fundamentals",
          description: "Learn version control with Git for collaborative development.",
          duration: "3 days",
          resource: "https://www.youtube.com/watch?v=RGOj5yH7evk",
          goals: "Master Git commands like commit, push, and pull.",
          exercises: "Set up a repository and collaborate on a project."
        },
        {
          name: "Docker Basics",
          description: "Containerize applications using Docker.",
          duration: "4 days",
          resource: "https://www.youtube.com/watch?v=fqMOX6JJhGo",
          goals: "Understand Docker images, containers, and Dockerfile.",
          exercises: "Containerize a simple Node.js app."
        },
        {
          name: "CI/CD Pipelines",
          description: "Implement continuous integration and deployment pipelines.",
          duration: "4 days",
          resource: "https://www.youtube.com/watch?v=scEDHsr3APg",
          goals: "Set up a CI/CD pipeline using GitHub Actions.",
          exercises: "Automate testing and deployment for a project."
        },
        {
          name: "Linux Basics for DevOps",
          description: "Learn essential Linux commands for server management.",
          duration: "3 days",
          resource: "https://www.youtube.com/watch?v=2s7i9j6UYyM",
          goals: "Navigate the Linux filesystem and manage processes.",
          exercises: "Write a shell script to automate a task."
        }
      ]
    },
    {
      title: "UI/UX Crash Course",
      duration: "2 weeks",
      subtopics: [
        {
          name: "Figma Basics",
          description: "Design user interfaces with Figma for prototyping.",
          duration: "4 days",
          resource: "https://www.youtube.com/watch?v=3q3FV65ZrUs",
          goals: "Learn Figma’s interface and prototyping tools.",
          exercises: "Design a mobile app landing page in Figma."
        },
        {
          name: "Design Systems",
          description: "Create reusable design systems for consistent UI development.",
          duration: "3 days",
          resource: "https://www.youtube.com/watch?v=HrNNT5d2ZuQ",
          goals: "Understand components, styles, and tokens.",
          exercises: "Build a design system with buttons and typography."
        },
        {
          name: "Accessibility Standards",
          description: "Ensure designs are accessible to all users.",
          duration: "3 days",
          resource: "https://www.youtube.com/watch?v=cOmehxAU_4s",
          goals: "Learn WCAG guidelines and accessibility testing.",
          exercises: "Audit a webpage for accessibility issues."
        },
        {
          name: "User Research",
          description: "Conduct user research to inform design decisions.",
          duration: "3 days",
          resource: "https://www.youtube.com/watch?v=2zL1oHNG4IA",
          goals: "Learn how to create user personas and conduct interviews.",
          exercises: "Create a user persona for a sample app."
        }
      ]
    }
  ];
  
  export default learningPlans;
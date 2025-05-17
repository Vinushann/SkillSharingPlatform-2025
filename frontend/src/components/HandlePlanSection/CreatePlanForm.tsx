import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { generateLearningPlan } from "../GeminiChat/geminiService";
import GenerateButton from "./GenerateButton";
import { Alert, AlertTitle } from "@mui/material";

interface Subtopic {
  name: string;
  duration: string;
  resource: string;
  completed: boolean;
}

interface PlanPayload {
  mainTitle: string;
  sub1Name: string;
  sub1Duration: string;
  sub1Resource: string;
  sub1Completed: boolean;
  sub2Name: string;
  sub2Duration: string;
  sub2Resource: string;
  sub2Completed: boolean;
  sub3Name: string;
  sub3Duration: string;
  sub3Resource: string;
  sub3Completed: boolean;
  sub4Name: string;
  sub4Duration: string;
  sub4Resource: string;
  sub4Completed: boolean;
}

interface CreatePlanFormProps {
  onFormDataChange: (data: PlanPayload) => void;
}

const CreatePlanForm: React.FC<CreatePlanFormProps> = ({
  onFormDataChange,
}) => {
  const [mainTitle, setMainTitle] = useState<string>("");
  const [subtopics, setSubtopics] = useState<Subtopic[]>([
    { name: "", duration: "", resource: "", completed: false },
    { name: "", duration: "", resource: "", completed: false },
    { name: "", duration: "", resource: "", completed: false },
    { name: "", duration: "", resource: "", completed: false },
  ]);
  const [errors, setErrors] = useState<{
    mainTitle: string;
    subtopics: { name: string; duration: string; resource: string }[];
  }>({
    mainTitle: "",
    subtopics: [
      { name: "", duration: "", resource: "" },
      { name: "", duration: "", resource: "" },
      { name: "", duration: "", resource: "" },
      { name: "", duration: "", resource: "" },
    ],
  });
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    severity: "success" | "error";
  }>({ show: false, message: "", severity: "success" });

  // Refs for subtopic name inputs
  const subtopicRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Validation functions
  const validateMainTitle = (value: string): string => {
    if (!value.trim()) return "Main title is required";
    return "";
  };

  const validateSubtopicName = (value: string): string => {
    if (!value.trim()) return "Subtopic name is required";
    return "";
  };

  const validateDuration = (value: string): string => {
    if (!value.trim()) return "Duration is required";
    if (!/^\d+\s*(day|days|hours|minutes)$/i.test(value.trim()))
      return "Duration must be a number followed by 'days', 'hours', or 'minutes' (e.g., '3 days')";
    return "";
  };

  const validateResource = (value: string): string => {
    if (!value.trim()) return "Resource is required";
    return "";
  };

  const validateForm = (): boolean => {
    const newErrors = {
      mainTitle: validateMainTitle(mainTitle),
      subtopics: subtopics.map((sub) => ({
        name: validateSubtopicName(sub.name),
        duration: validateDuration(sub.duration),
        resource: validateResource(sub.resource),
      })),
    };
    setErrors(newErrors);
    const isValid =
      !newErrors.mainTitle &&
      newErrors.subtopics.every(
        (sub) => !sub.name && !sub.duration && !sub.resource
      );
    if (!isValid) {
      setAlert({
        show: true,
        message: "Please fix the errors before submitting.",
        severity: "error",
      });
    }
    return isValid;
  };

  useEffect(() => {
    const payload: PlanPayload = {
      mainTitle,
      sub1Name: subtopics[0].name,
      sub1Duration: subtopics[0].duration,
      sub1Resource: subtopics[0].resource,
      sub1Completed: subtopics[0].completed,
      sub2Name: subtopics[1].name,
      sub2Duration: subtopics[1].duration,
      sub2Resource: subtopics[1].resource,
      sub2Completed: subtopics[1].completed,
      sub3Name: subtopics[2].name,
      sub3Duration: subtopics[2].duration,
      sub3Resource: subtopics[2].resource,
      sub3Completed: subtopics[2].completed,
      sub4Name: subtopics[3].name,
      sub4Duration: subtopics[3].duration,
      sub4Resource: subtopics[3].resource,
      sub4Completed: subtopics[3].completed,
    };
    onFormDataChange(payload);
  }, [mainTitle, subtopics, onFormDataChange]);

  const handleSubtopicChange = (
    index: number,
    field: keyof Subtopic,
    value: string | boolean
  ) => {
    const updated = [...subtopics];
    updated[index][field] = value as never;
    setSubtopics(updated);

    // Validate on change
    const newErrors = { ...errors };
    if (field === "name") {
      newErrors.subtopics[index].name = validateSubtopicName(value as string);
    } else if (field === "duration") {
      newErrors.subtopics[index].duration = validateDuration(value as string);
    } else if (field === "resource") {
      newErrors.subtopics[index].resource = validateResource(value as string);
    }
    setErrors(newErrors);
  };

  const handleMainTitleChange = (value: string) => {
    setMainTitle(value);
    setErrors({ ...errors, mainTitle: validateMainTitle(value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const payload: PlanPayload = {
      mainTitle,
      sub1Name: subtopics[0].name,
      sub1Duration: subtopics[0].duration,
      sub1Resource: subtopics[0].resource,
      sub1Completed: subtopics[0].completed,
      sub2Name: subtopics[1].name,
      sub2Duration: subtopics[1].duration,
      sub2Resource: subtopics[1].resource,
      sub2Completed: subtopics[1].completed,
      sub3Name: subtopics[2].name,
      sub3Duration: subtopics[2].duration,
      sub3Resource: subtopics[2].resource,
      sub3Completed: subtopics[2].completed,
      sub4Name: subtopics[3].name,
      sub4Duration: subtopics[3].duration,
      sub4Resource: subtopics[3].resource,
      sub4Completed: subtopics[3].completed,
    };

    try {
      await axios.post("http://localhost:8080/api/plans", payload);
      setAlert({
        show: true,
        message: "Plan submitted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error submitting plan:", error);
      setAlert({
        show: true,
        message: "Failed to submit plan.",
        severity: "error",
      });
    }
  };

  // Handle AI Generate button click
  const handleGeneratePlan = useCallback(async () => {
    if (!mainTitle.trim()) {
      setAlert({
        show: true,
        message: "Enter a main title first!",
        severity: "error",
      });
      return;
    }
    try {
      const planJson = await generateLearningPlan(mainTitle);
      const parsed = JSON.parse(planJson);
      setSubtopics(
        parsed.map((item: any) => ({
          name: item.subtopic || item.subtopic_name || "",
          duration: item.duration || "",
          resource: item.resource || "",
          completed: false,
        }))
      );
      // Clear subtopic errors after AI generation
      setErrors((prev) => ({
        ...prev,
        subtopics: [
          { name: "", duration: "", resource: "" },
          { name: "", duration: "", resource: "" },
          { name: "", duration: "", resource: "" },
          { name: "", duration: "", resource: "" },
        ],
      }));
    } catch (err) {
      setAlert({
        show: true,
        message: "Failed to fetch AI plan.",
        severity: "error",
      });
      console.error("AI Error:", err);
    }
  }, [mainTitle]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Prevent shortcuts when typing in input or textarea
      const activeElement = document.activeElement?.tagName.toLowerCase();
      if (
        activeElement === "input" ||
        activeElement === "textarea" ||
        event.repeat
      ) {
        return;
      }

      // 'g' for Generate Plan with AI
      if (event.key.toLowerCase() === "g") {
        event.preventDefault();
        handleGeneratePlan();
      }
      // '1' to '4' for focusing subtopic name inputs
      else if (["1", "2", "3", "4"].includes(event.key)) {
        event.preventDefault();
        const index = parseInt(event.key) - 1;
        subtopicRefs[index].current?.focus();
      }
      // 'Shift + Enter' for form submission
      else if (event.key === "Enter" && event.shiftKey) {
        event.preventDefault();
        handleSubmit(event as any); // TypeScript workaround
      }
    },
    [handleGeneratePlan, handleSubmit]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Auto-hide alert after 5 seconds
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert((prev) => ({ ...prev, show: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  return (
    <div className="relative">
      {alert.show && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert severity={alert.severity}>
            <AlertTitle>
              {alert.severity === "success" ? "Success" : "Error"}
            </AlertTitle>
            {alert.message}
          </Alert>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        style={{ margin: "0" }}
        className="max-w-2xl mx-auto p-6 bg-white border-2 border-gray-200 rounded-xl space-y-6"
      >
        {/* Main Title */}
        <div>
          <label className="block text-base font-semibold text-gray-700 mb-2 text-center">
            Learning Plan Title
          </label>
          <input
            type="text"
            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400 ${
              errors.mainTitle ? "border-red-500" : "border-gray-200"
            }`}
            value={mainTitle}
            onChange={(e) => handleMainTitleChange(e.target.value)}
            placeholder="e.g., Learn React in 4 Weeks"
          />
          {errors.mainTitle && (
            <p className="text-red-500 text-sm mt-1">{errors.mainTitle}</p>
          )}
        </div>

        {/* AI Generate Button */}
        <GenerateButton onClick={handleGeneratePlan} />

        <hr className="border-gray-200" />

        {/* Subtopics */}
        {subtopics.map((sub, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-md font-semibold text-gray-700">
              Subtopic {i + 1}
            </h3>
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Subtopic Name"
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400 ${
                    errors.subtopics[i].name
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                  value={sub.name}
                  onChange={(e) =>
                    handleSubtopicChange(i, "name", e.target.value)
                  }
                  ref={subtopicRefs[i]}
                />
                {errors.subtopics[i].name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.subtopics[i].name}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Duration (e.g., 3 days)"
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400 ${
                    errors.subtopics[i].duration
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                  value={sub.duration}
                  onChange={(e) =>
                    handleSubtopicChange(i, "duration", e.target.value)
                  }
                />
                {errors.subtopics[i].duration && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.subtopics[i].duration}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Resource (e.g., YouTube Link)"
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400 ${
                    errors.subtopics[i].resource
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                  value={sub.resource}
                  onChange={(e) =>
                    handleSubtopicChange(i, "resource", e.target.value)
                  }
                />
                {errors.subtopics[i].resource && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.subtopics[i].resource}
                  </p>
                )}
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={sub.completed}
                  onChange={(e) =>
                    handleSubtopicChange(i, "completed", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 border-gray-200 rounded focus:ring-0"
                />
                <span className="text-sm text-gray-600">Mark as Completed</span>
              </label>
            </div>
            {i < 3 && <hr className="my-4 border-gray-200" />}
          </div>
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
        >
          ✅ Submit Plan
        </button>
      </form>
    </div>
  );
};

export default CreatePlanForm;
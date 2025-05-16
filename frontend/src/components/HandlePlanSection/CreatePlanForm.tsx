import React, { useState, useEffect } from "react";
import axios from "axios";
import { generateLearningPlan } from "../GeminiChat/geminiService";
import GenerateButton from "./GenerateButton";

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      alert("✅ Plan submitted successfully!");
    } catch (error) {
      console.error("Error submitting plan:", error);
      alert("❌ Failed to submit plan.");
    }
  };

  return (
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
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400"
          value={mainTitle}
          onChange={(e) => setMainTitle(e.target.value)}
          placeholder="e.g., Learn React in 4 Weeks"
        />
      </div>

      {/* AI Generate Button */}
      <GenerateButton
        onClick={async () => {
          if (!mainTitle.trim()) {
            alert("Enter a main title first!");
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
          } catch (err) {
            alert("Failed to fetch AI plan.");
            console.error("AI Error:", err);
          }
        }}
      />

      <hr className="border-gray-200" />

      {/* Subtopics */}
      {subtopics.map((sub, i) => (
        <div key={i} className="space-y-4">
          <h3 className="text-md font-semibold text-gray-700">
            Subtopic {i + 1}
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Subtopic Name"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400"
              value={sub.name}
              onChange={(e) => handleSubtopicChange(i, "name", e.target.value)}
            />
            <input
              type="text"
              placeholder="Duration (e.g., 3 days)"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400"
              value={sub.duration}
              onChange={(e) =>
                handleSubtopicChange(i, "duration", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Resource (e.g., YouTube Link)"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400"
              value={sub.resource}
              onChange={(e) =>
                handleSubtopicChange(i, "resource", e.target.value)
              }
            />
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
  );
};

export default CreatePlanForm;

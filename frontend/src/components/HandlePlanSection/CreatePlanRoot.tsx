import React, { useState } from "react";
import CreatePlanForm from "./CreatePlanForm";
import UseTemplate from "./UseTemplate";
import PreviewPlanSub from "./PreviewPlanSub";
import { Divider } from "@mui/material";

// ✅ Same PlanData type
interface PlanData {
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

const CreatePlanRoot: React.FC = () => {
  const [tab, setTab] = useState<number>(0);
  const [planData, setPlanData] = useState<PlanData | null>(null);

  const handleTabChange = (newValue: number) => {
    setTab(newValue);
    setPlanData(null);
  };

  return (
    <div
      className="max-w-7xl mx-auto mt-12 px-4"
      style={{
        fontFamily: "'Source Sans Pro', sans-serif", // Apply Source Sans Pro font
      }}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Section */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">
            Start new learning journey
          </h2>

          <div className="inline-flex p-1 bg-gray-100 rounded-lg mb-6">
            <button
              onClick={() => handleTabChange(0)}
              className={`appearance-none border-none outline-none bg-transparent 
                px-4 py-2 text-sm font-medium rounded-md transition-all 
                ${
                  tab === 0
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              style={{
                all: "unset",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                fontWeight: 500,
                fontSize: "0.875rem", // text-sm
                lineHeight: "1.25rem",
                cursor: "pointer",
                backgroundColor: tab === 0 ? "#ffffff" : "transparent",
                color: tab === 0 ? "#111827" : "#6b7280", // tailwind text-gray-900 / gray-500
                boxShadow: tab === 0 ? "0 1px 2px rgba(0, 0, 0, 0.05)" : "none",
              }}
            >
              CREATE PLAN
            </button>

            <button
              onClick={() => handleTabChange(1)}
              className={`appearance-none border-none outline-none bg-transparent 
                px-4 py-2 text-sm font-medium rounded-md transition-all 
                ${
                  tab === 1
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              style={{
                all: "unset",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                fontWeight: 500,
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
                cursor: "pointer",
                backgroundColor: tab === 1 ? "#ffffff" : "transparent",
                color: tab === 1 ? "#111827" : "#6b7280",
                boxShadow: tab === 1 ? "0 1px 2px rgba(0, 0, 0, 0.05)" : "none",
              }}
            >
              USE TEMPLATE
            </button>
          </div>

          {/* Conditional Content */}
          {tab === 0 && <CreatePlanForm onFormDataChange={setPlanData} />}
          {tab === 1 && <UseTemplate onTemplateSelect={setPlanData} />}
        </div>

        {/* Right Section */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Preview</h2>
          <PreviewPlanSub planData={planData} />
        </div>
      </div>
    </div>
  );
};

export default CreatePlanRoot;

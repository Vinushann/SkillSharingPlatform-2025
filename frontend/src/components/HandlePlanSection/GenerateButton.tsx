import React from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";

interface GenerateButtonProps {
  onClick: () => void;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="relative flex items-center justify-center gap-2 w-full px-6 py-3 text-white font-semibold text-base rounded-lg
                 bg-gradient-to-r from-[#8b5cf6] to-[#6b38fb] 
                 shadow-[0_0_12px_rgba(130,90,255,0.5),0_0_20px_rgba(100,56,251,0.3)]
                 border border-violet-300
                 hover:shadow-[0_0_18px_rgba(130,90,255,0.6),0_0_30px_rgba(100,56,251,0.4)] 
                 transition-all transform hover:scale-100"
    >
      <SparklesIcon className="w-5 h-5 text-white drop-shadow" />
      Generate Plan with AI
    </button>
  );
};

export default GenerateButton;

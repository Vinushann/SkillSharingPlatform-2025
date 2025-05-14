import React from "react";
import { Fab } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

interface FloatingChatButtonProps {
  onClick: () => void;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick }) => {
  return (
    <Fab
      color="primary"
      aria-label="chat"
      onClick={onClick}
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1500,
        backgroundColor: "#3f51b5",
        "&:hover": { backgroundColor: "#303f9f" },
      }}
    >
      <ChatIcon />
    </Fab>
  );
};

export default FloatingChatButton;

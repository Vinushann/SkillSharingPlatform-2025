import React, { useState } from "react";
import { Box, IconButton, Button } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationPanel from "./NotificationPanel"; // Adjust the import path as needed

const HeaderComponent = ({ userId }) => {
  // Pass userId as a prop if needed
  const [openNotifications, setOpenNotifications] = useState(false);

  const handleNotificationClick = () => {
    if (!userId) {
      alert("Please log in to view notifications.");
      return;
    }
    setOpenNotifications(true);
  };

  const handleCloseNotifications = () => {
    setOpenNotifications(false);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <IconButton onClick={handleNotificationClick}>
        <NotificationsIcon />
      </IconButton>
      <Button variant="contained" color="primary">
        Login
      </Button>
      <NotificationPanel
        userId={userId} // Pass the logged-in user ID if available
        open={openNotifications}
        onClose={handleCloseNotifications}
      />
    </Box>
  );
};

export default HeaderComponent;

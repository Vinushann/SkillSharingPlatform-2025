// src/components/NotificationPanel.jsx
// src/components/NotificationPanel.jsx
import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Notifications as NotificationIcon } from '@mui/icons-material';
import { getNotifications, markNotificationAsRead } from '../services/userEngagementService'; // Adjust the import path as needed

const NotificationPanel = ({ userId, open, onClose }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (open && userId) {
      fetchNotifications();
    }
  }, [userId, open]);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications(userId);
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Optionally, set an error state or show a user-friendly message
    }
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      await fetchNotifications(); // Refresh the list after marking as read
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Typography variant="h6" style={{ padding: '16px' }}>
        Notifications
      </Typography>
      <List>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <ListItem
              key={notification.id}
              button
              onClick={() => handleNotificationClick(notification.id)}
            >
              <ListItemText
                primary={notification.message}
                secondary={`${notification.type} | ${new Date(notification.createdAt).toLocaleString()} | Read: ${notification.isRead ? 'Yes' : 'No'}`}
              />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No notifications available." />
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default NotificationPanel;
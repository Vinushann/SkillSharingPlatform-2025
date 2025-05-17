import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Card,
  CardContent,
  Tooltip,
  Divider,
  Chip,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";

interface Plan {
  id: number;
  mainTitle: string;
  userName: string;
  profileImage: string;
  [key: string]: any;
}

const getRandomName = () => {
  const names = [
    "Aanya Rajapaksha", // F
    "Isuru Perera", // M
    "Kavindi Fernando", // F
    "Nimal Dissanayake", // M
    "Tharushi Silva", // F
    "Chathura Gunasekara", // M
  ];
  return names[Math.floor(Math.random() * names.length)];
};

const getAvatarUrl = (userName: string, id: number) => {
  const firstName = userName.split(" ")[0];
  const isFemale = firstName.endsWith("a") || firstName.endsWith("i");
  const avatarId = id % 100; // Ensure ID is between 0 and 99 for avatar URL
  return isFemale
    ? `https://randomuser.me/api/portraits/women/${avatarId}.jpg`
    : `https://randomuser.me/api/portraits/men/${avatarId}.jpg`;
};

const ViewPlans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [liked, setLiked] = useState<{ [id: number]: boolean }>({});

  // Load likes from localStorage
  useEffect(() => {
    const storedLikes = localStorage.getItem("likedPlans");
    if (storedLikes) {
      setLiked(JSON.parse(storedLikes));
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/plans")
      .then((res) => res.json())
      .then((data) => {
        // Filter out plans where user_id is '666'
        const filteredData = data.filter(
          (plan: any) => plan.userId !== "fd049257-19de-4619-8020-77f3149e95e6"
        );
        const enriched = filteredData.map((plan: any) => {
          const name = getRandomName(); // Replace with real userName from DB if available
          return {
            ...plan,
            userName: name,
            profileImage: getAvatarUrl(name, plan.id),
          };
        });
        setPlans(enriched);
      });
  }, []);

  // Save likes to localStorage
  const toggleLike = (id: number) => {
    const updated = { ...liked, [id]: !liked[id] };
    setLiked(updated);
    localStorage.setItem("likedPlans", JSON.stringify(updated));
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-around"
        flexWrap="wrap"
        gap={3}
        p={3}
      >
        {plans.map((plan) => (
          <Card
            key={plan.id}
            sx={{
              width: 320,
              borderRadius: 4,
              border: "2px solid #e0e0e0",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#ffffff",
            }}
          >
            <CardContent sx={{ p: 2, flex: 1 }}>
              {/* Header */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar
                    src={plan.profileImage}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Box>
                    <Typography fontSize={13} fontWeight={600}>
                      {plan.userName}
                    </Typography>
                    <Typography fontSize={11} color="text.secondary">
                      Posted on May 15, 2025
                    </Typography>
                  </Box>
                </Box>
                <IconButton onClick={handleMenuOpen} size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>

              <Divider sx={{ my: 1.5, borderBottomWidth: 2 }} />

              {/* Main Title */}
              <Typography
                variant="h6"
                fontWeight={700}
                fontSize={16}
                textAlign="left"
                gutterBottom
                sx={{ lineHeight: 1.3 }}
              >
                {plan.mainTitle}
              </Typography>

              <Divider sx={{ my: 1.5 }} />

              {/* Subtopics */}
              <Box display="flex" flexDirection="column" gap={1.2}>
                {[1, 2, 3, 4].map((i) => {
                  const name = plan[`sub${i}Name`];
                  const duration = plan[`sub${i}Duration`];
                  const completed = plan[`sub${i}Completed`];
                  if (!name) return null;

                  return (
                    <Box
                      key={i}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      px={1}
                    >
                      <Box>
                        <Typography fontSize={13} fontWeight={500}>
                          {name}
                        </Typography>
                        <Typography fontSize={11} color="text.secondary">
                          {duration} days
                        </Typography>
                      </Box>
                      <Chip
                        label={completed ? "Done" : "Pending"}
                        size="small"
                        color={completed ? "success" : "default"}
                        sx={{ fontSize: "11px", height: "20px" }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </CardContent>

            {/* Footer Actions */}
            <Divider sx={{ my: 1.5, borderBottomWidth: 2 }} />
            <Box display="flex" justifyContent="space-between" px={2} py={1}>
              <Tooltip title="Like">
                <IconButton size="small" onClick={() => toggleLike(plan.id)}>
                  {liked[plan.id] ? (
                    <FavoriteIcon fontSize="small" color="error" />
                  ) : (
                    <FavoriteBorderIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="Comment">
                <IconButton size="small">
                  <ChatBubbleOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share">
                <IconButton size="small">
                  <ShareOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Card>
        ))}

        {/* Popup Menu */}
        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleMenuClose}>
          <MenuItem>Report</MenuItem>
          <MenuItem disabled>Edit (coming soon)</MenuItem>
          <MenuItem disabled>Share (coming soon)</MenuItem>
        </Menu>
      </Box>
    </div>
  );
};

export default ViewPlans;

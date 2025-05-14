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
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";

interface Plan {
  id: number;
  mainTitle: string;
  profileImage: string;
  userName: string;
  [key: string]: any;
}

const ViewPlans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/plans")
      .then((res) => res.json())
      .then((data) => {
        const enriched = data.map((plan: any, index: number) => ({
          ...plan,
          id: index,
          userName: `Vinushan Vimalraj`,
          profileImage: `https://i.pravatar.cc/150?img=${index + 20}`,
        }));
        setPlans(enriched);
      });
  }, []);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Box p={3}>
      {plans.map((plan) => (
        <Card
          key={plan.id}
          sx={{
            width: 500,
            height: 500,
            mb: 3,
            borderRadius: 3,
            boxShadow: 4,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <CardContent sx={{ p: 2, flex: 1 }}>
            {/* Header */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar src={plan.profileImage} />
                <Typography fontWeight={600} fontSize={14}>
                  {plan.userName}
                </Typography>
              </Box>
              <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Title */}
            <Typography
              fontWeight={700}
              fontSize={20}
              textAlign="center"
              mb={2}
              sx={{ lineHeight: 1.4 }}
            >
              {plan.mainTitle}
            </Typography>

            {/* Subtopics */}
            <Box display="flex" flexDirection="column" gap={1.5}>
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
                  >
                    <Box>
                      <Typography fontSize={13} fontWeight={600}>
                        📌 {name}
                      </Typography>
                      <Typography fontSize={11} color="text.secondary">
                        Duration: {duration} days
                      </Typography>
                    </Box>
                    <Chip
                      label={completed ? "✅" : "❌"}
                      size="small"
                      color={completed ? "success" : "warning"}
                      sx={{ fontSize: "12px", height: "22px" }}
                    />
                  </Box>
                );
              })}
            </Box>
          </CardContent>

          {/* Footer */}
          <Divider />
          <Box display="flex" justifyContent="space-around" py={1}>
            <Tooltip title="Like">
              <IconButton>
                <FavoriteBorderIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Comment">
              <IconButton>
                <ChatBubbleOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton>
                <ShareOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Card>
      ))}

      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleMenuClose}>
        <MenuItem>Report</MenuItem>
        <MenuItem disabled>Edit (coming soon)</MenuItem>
        <MenuItem disabled>Share (coming soon)</MenuItem>
      </Menu>
    </Box>
  );
};

export default ViewPlans;

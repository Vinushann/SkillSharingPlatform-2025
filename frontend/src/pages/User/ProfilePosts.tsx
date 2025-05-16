import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  Tooltip,
  Divider,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import axios from "axios";

const CURRENT_USER_ID = "fd049257-19de-4619-8020-77f3149e95e6";

interface Plan {
  id: number;
  userId: string;
  mainTitle: string;
  [key: string]: any;
}

const ProfilePosts: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8080/api/plans").then((res) => {
      const userPlans = res.data.filter(
        (plan: Plan) => plan.userId === CURRENT_USER_ID
      );
      setPlans(userPlans);
    });
  }, []);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, plan: Plan) => {
    setAnchorEl(e.currentTarget);
    setSelectedPlan({ ...plan });
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditOpen = () => {
    setEditOpen(true);
    handleMenuClose();
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedPlan(null);
  };

  const handleDeleteOpen = () => {
    setDeleteConfirmOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (selectedPlan) {
      axios
        .delete(`http://localhost:8080/api/plans/${selectedPlan.id}`)
        .then(() => {
          setPlans(plans.filter((p) => p.id !== selectedPlan.id));
          showSnackbar("✅ Post deleted successfully");
          setDeleteConfirmOpen(false);
        })
        .catch(() => showSnackbar("❌ Failed to delete post"));
    }
  };

  const handleUpdate = () => {
    if (!selectedPlan) return;
    axios
      .put(`http://localhost:8080/api/plans/${selectedPlan.id}`, selectedPlan)
      .then((res) => {
        setPlans((prev) =>
          prev.map((p) => (p.id === selectedPlan.id ? res.data : p))
        );
        showSnackbar("✅ Post updated successfully");
        setEditOpen(false);
      })
      .catch(() => showSnackbar("❌ Failed to update post"));
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  return (
    <Box
      display="flex"
      sx={{ justifyContent: "space-around" }}
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
            {/* Menu Button */}
            <Box
              display="flex"
              sx={{ justifyContent: "space-between" }}
              justifyContent="flex-end"
              mb={1}
            >
              {/* Main Title */}
              <Typography
                variant="h3"
                fontWeight={700}
                fontSize={20}
                gutterBottom
              >
                {plan.mainTitle}
              </Typography>
              <Divider sx={{ my: 1 }} />

              <IconButton onClick={(e) => handleMenuOpen(e, plan)} size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
            <Divider> </Divider>

            {/* Subtopics */}
            {[1, 2, 3, 4].map((i) => {
              const name = plan[`sub${i}Name`];
              const duration = plan[`sub${i}Duration`];
              const resource = plan[`sub${i}Resource`];
              const completed = plan[`sub${i}Completed`];

              if (!name) return null;
              return (
                <Box key={i} mb={1}>
                  <Typography fontSize={13} fontWeight={600}>
                    {name}
                  </Typography>
                  <Typography fontSize={11} color="text.secondary">
                    Duration: {duration} | Resource: {resource}
                  </Typography>
                  <Chip
                    label={completed ? "Done" : "Pending"}
                    size="small"
                    color={completed ? "success" : "default"}
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              );
            })}
          </CardContent>

          {/* Footer Icons */}
          <Divider />
          <Box display="flex" justifyContent="space-between" px={2} py={1}>
            <Tooltip title="Like">
              <IconButton size="small">
                <FavoriteBorderIcon fontSize="small" />
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

      {/* Menu */}
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleMenuClose}>
        <MenuItem onClick={handleEditOpen}>Update</MenuItem>
        <MenuItem onClick={handleDeleteOpen}>Delete</MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} fullWidth>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Main Title"
            fullWidth
            value={selectedPlan?.mainTitle || ""}
            onChange={(e) =>
              setSelectedPlan((prev) => ({
                ...prev!,
                mainTitle: e.target.value,
              }))
            }
          />
          {[1, 2, 3, 4].map((i) => (
            <Box key={i} display="flex" flexDirection="column" gap={1}>
              <TextField
                label={`Subtopic ${i} Name`}
                value={selectedPlan?.[`sub${i}Name`] || ""}
                onChange={(e) =>
                  setSelectedPlan((prev) => ({
                    ...prev!,
                    [`sub${i}Name`]: e.target.value,
                  }))
                }
              />
              <TextField
                label={`Subtopic ${i} Duration`}
                value={selectedPlan?.[`sub${i}Duration`] || ""}
                onChange={(e) =>
                  setSelectedPlan((prev) => ({
                    ...prev!,
                    [`sub${i}Duration`]: e.target.value,
                  }))
                }
              />
              <TextField
                label={`Subtopic ${i} Resource`}
                value={selectedPlan?.[`sub${i}Resource`] || ""}
                onChange={(e) =>
                  setSelectedPlan((prev) => ({
                    ...prev!,
                    [`sub${i}Resource`]: e.target.value,
                  }))
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedPlan?.[`sub${i}Completed`] || false}
                    onChange={(e) =>
                      setSelectedPlan((prev) => ({
                        ...prev!,
                        [`sub${i}Completed`]: e.target.checked,
                      }))
                    }
                  />
                }
                label="Completed"
              />
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Are you sure you want to delete this post?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Alerts */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default ProfilePosts;

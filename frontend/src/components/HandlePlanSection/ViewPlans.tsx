import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Fab,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

// Define interfaces for component data structures
interface Plan {
  mainTitle: string;
  [key: string]: string | boolean; // For dynamic access to subtopic properties
}

interface Report {
  plan: string;
  reportText: string;
}

const ViewPlans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState<boolean>(false);
  const [reportText, setReportText] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:8080/api/plans")
      .then((res) => res.json())
      .then((data) => {
        // Ensure data is an array before setting it to state
        if (Array.isArray(data)) {
          setPlans(data);
        } else {
          console.error("API did not return an array:", data);
          setPlans([]); // Set to empty array as fallback
        }
      })
      .catch((error) => {
        console.error("Error fetching plans:", error);
        setPlans([]); // Set to empty array on error
      });
  }, []);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, plan: Plan): void => {
    setAnchorEl(event.currentTarget);
    setSelectedPlan(plan);
  };

  const handleCloseMenu = (): void => {
    setAnchorEl(null);
  };

  const handleReportClick = (): void => {
    setReportDialogOpen(true);
    handleCloseMenu();
  };

  const handleReportSubmit = (): void => {
    if (selectedPlan) {
      const existing: Report[] = JSON.parse(localStorage.getItem("reports") || "[]");
      localStorage.setItem(
        "reports",
        JSON.stringify([
          ...existing,
          { plan: selectedPlan.mainTitle, reportText },
        ])
      );
      setReportDialogOpen(false);
      setReportText("");
    }
  };

  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box p={4}>
      {Array.isArray(plans) && plans.map((plan, index) => (
        <Card key={index} sx={{ mb: 4, boxShadow: 3, borderRadius: 3 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h5" fontWeight="bold">
                {plan.mainTitle}
              </Typography>
              <IconButton onClick={(e) => handleMenuClick(e, plan)}>
                <MoreVertIcon />
              </IconButton>
            </Box>

            {[1, 2, 3, 4].map(
              (num) =>
                plan[`sub${num}Name`] && (
                  <Box key={num} mt={3}>
                    <Typography variant="subtitle1" fontWeight="600">
                      Subtopic {num}: {plan[`sub${num}Name`] as string} (
                      {plan[`sub${num}Duration`] as string} days)
                    </Typography>
                    <Box mt={1}>
                      <iframe
                        width="100%"
                        height="150"
                        style={{ borderRadius: "8px" }}
                        src={`https://www.youtube.com/embed/${
                          ((plan[`sub${num}Resource`] as string) || "")
                            .split("v=")[1]
                            ?.split("&")[0]
                        }`}
                        title="YouTube video preview"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </Box>
                    <Chip
                      label={
                        plan[`sub${num}Completed`]
                          ? "Completed"
                          : "Not Completed"
                      }
                      color={plan[`sub${num}Completed`] ? "success" : "warning"}
                      sx={{ mt: 1 }}
                    />
                    <Divider sx={{ my: 2 }} />
                  </Box>
                )
            )}
          </CardContent>
        </Card>
      ))}

      {plans.length === 0 && (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No plans found. Create a new plan to get started!
        </Typography>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleReportClick}>Report</MenuItem>
        <MenuItem disabled>Share (coming soon)</MenuItem>
        <MenuItem disabled>Edit (coming soon)</MenuItem>
      </Menu>

      <Dialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
      >
        <DialogTitle>Report Plan</DialogTitle>
        <DialogContent>
          <TextField
            label="What's the issue?"
            fullWidth
            multiline
            rows={4}
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleReportSubmit}>
            Submit Report
          </Button>
        </DialogActions>
      </Dialog>

      <Fab
        color="primary"
        aria-label="scroll to top"
        sx={{ position: "fixed", bottom: 24, right: 24 }}
        onClick={scrollToTop}
      >
        <ArrowUpwardIcon />
      </Fab>
    </Box>
  );
};

export default ViewPlans;
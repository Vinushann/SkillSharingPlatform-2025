import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert
} from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import moment from "moment";

const NoteTaking = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timestamp, setTimestamp] = useState(new Date());
  const [notes, setNotes] = useState([]);
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [updateTimestamp, setUpdateTimestamp] = useState(new Date());

  // Refs for focusing input fields
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const timestampRef = useRef(null);

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Prevent default behavior for certain keys
      if (["p", "/", "d", "1", "2", "t", "u", "c", "n", "b"].includes(event.key)) {
        event.preventDefault();
      }

      switch (event.key) {
        case "p": // Post the note
          handleSubmit();
          break;
        case "/": // Focus on Main Title
          titleRef.current?.focus();
          break;
        case "d": // Focus on Description
          descriptionRef.current?.focus();
          break;
        case "1": // Delete the first note
          if (notes.length > 0) {
            handleDeleteOpen(notes[0]);
          }
          break;
        case "2": // Delete the second note
          if (notes.length > 1) {
            handleDeleteOpen(notes[1]);
          }
          break;
        case "t": // Focus on Date and Time
          timestampRef.current?.focus();
          break;
        case "u": // Open update dialog for the first note
          if (notes.length > 0) {
            handleUpdateOpen(notes[0]);
          }
          break;
        case "c": // Clear the input form
          setTitle("");
          setDescription("");
          setTimestamp(new Date());
          setErrors({});
          break;
        case "n": // Select the next day in the calendar
          setTimestamp((prev) => {
            const nextDay = new Date(prev);
            nextDay.setDate(nextDay.getDate() + 1);
            return nextDay;
          });
          break;
        case "b": // Select the previous day in the calendar
          setTimestamp((prev) => {
            const prevDay = new Date(prev);
            prevDay.setDate(prevDay.getDate() - 1);
            return prevDay;
          });
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [notes]); // Re-run when notes change to ensure delete/update shortcuts work with updated notes

  const fetchNotes = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/notes");
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const noteData = {
      title,
      description,
      timestamp: moment(timestamp).format("YYYY-MM-DD HH:mm:ss"),
    };

    try {
      await axios.post("http://localhost:8080/api/v1/notes", noteData);
      setTitle("");
      setDescription("");
      setTimestamp(new Date());
      setErrors({});
      setSnackbarMessage("Note added successfully!");
      setOpenSnackbar(true);
      fetchNotes();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleDateSelect = (info) => {
    const selectedDate = new Date(info.start);
    setTimestamp(selectedDate);
  };

  const handleTimestampChange = (e) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate)) {
      setTimestamp(newDate);
    }
  };

  const handleUpdateOpen = (note) => {
    setSelectedNote(note);
    setUpdateTitle(note.title);
    setUpdateDescription(note.description);
    setUpdateTimestamp(new Date(note.timestamp));
    setOpenUpdateDialog(true);
  };

  const handleUpdateClose = () => {
    setOpenUpdateDialog(false);
    setSelectedNote(null);
    setUpdateTitle("");
    setUpdateDescription("");
    setUpdateTimestamp(new Date());
  };

  const handleUpdateSubmit = async () => {
    const newErrors = {};
    if (!updateTitle.trim()) newErrors.title = "Title is required";
    if (!updateDescription.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const updatedNote = {
      title: updateTitle,
      description: updateDescription,
      timestamp: moment(updateTimestamp).format("YYYY-MM-DD HH:mm:ss"),
    };

    try {
      await axios.put(`http://localhost:8080/api/v1/notes/${selectedNote.id}`, updatedNote);
      setOpenUpdateDialog(false);
      setSnackbarMessage("Note updated successfully!");
      setOpenSnackbar(true);
      fetchNotes();
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleDeleteOpen = (note) => {
    setSelectedNote(note);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
    setSelectedNote(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/notes/${selectedNote.id}`);
      setOpenDeleteDialog(false);
      setSnackbarMessage("Note deleted successfully!");
      setOpenSnackbar(true);
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
  };

  const events = notes.map(note => ({
    title: note.title,
    start: new Date(note.timestamp),
    end: new Date(note.timestamp),
    allDay: true,
  }));

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", mt: 6, px: 4, minWidth: "800px" }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ color: "#1a237e", mb: 3 }}
      >
        Store Your New Learning Ideas
      </Typography>

      <Grid container spacing={3} sx={{ flexWrap: "nowrap" }}>
        {/* Input Fields */}
        <Grid item xs={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              background: "#ffffff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <TextField
              inputRef={titleRef}
              label="Main Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value) setErrors((prev) => ({ ...prev, title: "" }));
              }}
              error={!!errors.title}
              helperText={errors.title}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#f5f7fa",
                },
                "& .MuiInputLabel-root": {
                  color: "#546e7a",
                },
              }}
            />
            <TextField
              inputRef={descriptionRef}
              label="Description"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (e.target.value) setErrors((prev) => ({ ...prev, description: "" }));
              }}
              error={!!errors.description}
              helperText={errors.description}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#f5f7fa",
                },
                "& .MuiInputLabel-root": {
                  color: "#546e7a",
                },
              }}
            />
            <TextField
              inputRef={timestampRef}
              label="Date and Time"
              type="datetime-local"
              variant="outlined"
              fullWidth
              value={moment(timestamp).format("YYYY-MM-DDTHH:mm")}
              onChange={handleTimestampChange}
              InputLabelProps={{ shrink: true }}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#f5f7fa",
                },
                "& .MuiInputLabel-root": {
                  color: "#546e7a",
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#4caf50",
                "&:hover": { backgroundColor: "#388e3c" },
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
              onClick={handleSubmit}
            >
              Post
            </Button>
          </Paper>
        </Grid>

        {/* Calendar */}
        <Grid item xs={8}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              background: "#ffffff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              selectable={true}
              select={handleDateSelect}
              height={400}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay"
              }}
              eventBackgroundColor="#3f51b5"
              eventBorderColor="#3f51b5"
              eventTextColor="#ffffff"
              eventDisplay="auto"
              eventContent={(arg) => (
                <div style={{ display: "flex", alignItems: "center", fontSize: "12px" }}>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#3f51b5",
                      borderRadius: "50%",
                      marginRight: "4px",
                    }}
                  />
                  {arg.event.title}
                </div>
              )}
              dayHeaderFormat={{ weekday: "short" }}
              titleFormat={{ month: "short", year: "numeric" }}
              dayCellClassNames={(arg) => {
                const today = moment().startOf("day");
                const cellDate = moment(arg.date).startOf("day");
                return today.isSame(cellDate) ? "fc-day-today" : "";
              }}
              sx={{
                "& .fc": {
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                },
                "& .fc-daygrid-day": {
                  border: "1px solid #e0e0e0",
                },
                "& .fc-day-today": {
                  backgroundColor: "#fff9c4 !important",
                },
                "& .fc-toolbar": {
                  backgroundColor: "#f5f7fa",
                  borderRadius: "8px 8px 0 0",
                  padding: "8px",
                },
                "& .fc-button": {
                  backgroundColor: "#3f51b5",
                  color: "#ffffff",
                  border: "none",
                  "&:hover": {
                    backgroundColor: "#303f9f",
                  },
                },
                "& .fc-button-active": {
                  backgroundColor: "#303f9f !important",
                },
                "& .fc-daygrid-day-number": {
                  fontSize: "14px",
                  color: "#37474f",
                },
                "& .fc-daygrid-day-top": {
                  justifyContent: "center",
                },
                "& .fc-daygrid-day-frame": {
                  padding: "4px",
                },
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Notes List */}
      <Box sx={{ mt: 6 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ color: "#1a237e", mb: 3 }}
        >
          Notes
        </Typography>
        <Grid container spacing={3}>
          {notes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note.id}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: "#e0e0e0",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ color: "#1a237e" }}
                  >
                    {note.title}
                  </Typography>
                  <Box>
                    <IconButton onClick={() => handleUpdateOpen(note)} sx={{ color: "#3f51b5" }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteOpen(note)} sx={{ color: "#ef5350" }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography sx={{ color: "#37474f", mb: 1 }}>
                  {note.description}
                </Typography>
                <Chip
                  label={moment(note.timestamp).format("MMM D, YYYY h:mm A")}
                  size="small"
                  sx={{
                    backgroundColor: "#e8eaf6",
                    color: "#3f51b5",
                    fontWeight: "medium",
                  }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Update Dialog */}
      <Dialog open={openUpdateDialog} onClose={handleUpdateClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: "#ffffff", color: "#1a237e", py: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            Update Note
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <TextField
            label="Main Title"
            variant="outlined"
            fullWidth
            value={updateTitle}
            onChange={(e) => {
              setUpdateTitle(e.target.value);
              if (e.target.value) setErrors((prev) => ({ ...prev, title: "" }));
            }}
            error={!!errors.title}
            helperText={errors.title}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#f5f7fa",
              },
            }}
          />
          <TextField
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            value={updateDescription}
            onChange={(e) => {
              setUpdateDescription(e.target.value);
              if (e.target.value) setErrors((prev) => ({ ...prev, description: "" }));
            }}
            error={!!errors.description}
            helperText={errors.description}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#f5f7fa",
              },
            }}
          />
          <TextField
            label="Date and Time"
            type="datetime-local"
            variant="outlined"
            fullWidth
            value={moment(updateTimestamp).format("YYYY-MM-DDTHH:mm")}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              if (!isNaN(newDate)) setUpdateTimestamp(newDate);
            }}
            InputLabelProps={{ shrink: true }}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#f5f7fa",
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: "#fafafa" }}>
          <Button
            onClick={handleUpdateClose}
            sx={{ color: "#ef5350", borderRadius: 2, px: 4 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateSubmit}
            sx={{
              backgroundColor: "#3f51b5",
              "&:hover": { backgroundColor: "#303f9f" },
              borderRadius: 2,
              px: 4,
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteClose}>
        <DialogTitle sx={{ backgroundColor: "#ffffff", color: "#1a237e", py: 3 }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Typography>Are you sure you want to delete this note?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: "#fafafa" }}>
          <Button onClick={handleDeleteClose} sx={{ color: "#3f51b5", borderRadius: 2, px: 4 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteConfirm}
            sx={{
              backgroundColor: "#ef5350",
              "&:hover": { backgroundColor: "#d32f2f" },
              borderRadius: 2,
              px: 4,
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NoteTaking;
import React, { useState, useEffect, useRef } from "react";
import { DateSelectArg } from "@fullcalendar/core";
import axios from "axios";
import moment from "moment";

interface Note {
  id: number;
  title: string;
  description: string;
  timestamp: string;
}

interface Errors {
  title?: string;
  description?: string;
}

const NoteTaking: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [timestamp, setTimestamp] = useState<Date>(new Date());
  const [notes, setNotes] = useState<Note[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [updateTitle, setUpdateTitle] = useState<string>("");
  const [updateDescription, setUpdateDescription] = useState<string>("");
  const [updateTimestamp, setUpdateTimestamp] = useState<Date>(new Date());

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const timestampRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        ["p", "/", "d", "1", "2", "t", "u", "c", "n", "b"].includes(event.key)
      ) {
        event.preventDefault();
      }

      switch (event.key) {
        case "p":
          handleSubmit();
          break;
        case "/":
          titleRef.current?.focus();
          break;
        case "d":
          descriptionRef.current?.focus();
          break;
        case "1":
          if (notes.length > 0) handleDeleteOpen(notes[0]);
          break;
        case "2":
          if (notes.length > 1) handleDeleteOpen(notes[1]);
          break;
        case "t":
          timestampRef.current?.focus();
          break;
        case "u":
          if (notes.length > 0) handleUpdateOpen(notes[0]);
          break;
        case "c":
          setTitle("");
          setDescription("");
          setTimestamp(new Date());
          setErrors({});
          break;
        case "n":
          setTimestamp((prev) => {
            const next = new Date(prev);
            next.setDate(next.getDate() + 1);
            return next;
          });
          break;
        case "b":
          setTimestamp((prev) => {
            const prevDate = new Date(prev);
            prevDate.setDate(prevDate.getDate() - 1);
            return prevDate;
          });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [notes]);

  const fetchNotes = async () => {
    try {
      const response = await axios.get<Note[]>(
        "http://localhost:8080/api/v1/notes"
      );
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
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
      setSnackbarMessage("Note added successfully!");
      setOpenSnackbar(true);
      fetchNotes();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleDateSelect = (info: DateSelectArg) => {
    const selectedDate = new Date(info.startStr);
    setTimestamp(selectedDate);
  };

  const handleTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) setTimestamp(newDate);
  };

  const handleUpdateOpen = (note: Note) => {
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
    const newErrors: Errors = {};
    if (!updateTitle.trim()) newErrors.title = "Title is required";
    if (!updateDescription.trim())
      newErrors.description = "Description is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const updatedNote = {
      title: updateTitle,
      description: updateDescription,
      timestamp: moment(updateTimestamp).format("YYYY-MM-DD HH:mm:ss"),
    };

    try {
      await axios.put(
        `http://localhost:8080/api/v1/notes/${selectedNote?.id}`,
        updatedNote
      );
      setOpenUpdateDialog(false);
      setSnackbarMessage("Note updated successfully!");
      setOpenSnackbar(true);
      fetchNotes();
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };
  const handleDeleteOpen = (note: Note) => {
    setSelectedNote(note);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
    setSelectedNote(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/notes/${selectedNote?.id}`
      );
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

  const events = notes.map((note) => ({
    title: note.title,
    start: new Date(note.timestamp),
    end: new Date(note.timestamp),
    allDay: true,
  }));

  return <>{/* ⏩ Keep your original JSX here */}</>;
};

export default NoteTaking;

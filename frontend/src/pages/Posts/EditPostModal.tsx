import { useEffect, useState } from "react";
import { User } from "../../types/user-types";
import { userApi } from "../../api/userApi";
import { userPostApi } from "../../api/userPostApi";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { X, ImageIcon, Loader2, Search } from "lucide-react";
import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "../../config/firebaseConfig";
import { PostResponse } from "../../types/post-types";

interface EditPostModalProps {
  open: boolean;
  onClose: () => void;
  post: PostResponse;
  onRefresh: () => void;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  outline: "none",
  borderRadius: 4,
  maxHeight: "90vh",
  overflowY: "auto",
};

const EditPostModal = ({ open, onClose, post, onRefresh }: EditPostModalProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [caption, setCaption] = useState(post.caption);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [existingMedia, setExistingMedia] = useState(post.media);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    setCaption(post.caption);
    setExistingMedia(post.media);
    setSelectedUsers(post.taggedUsers.map(user => user.id));
  }, [post]);

  useEffect(() => {
    userApi
      .getAllUsers()
      .then((res) => {
        setUsers(res);
        setFilteredUsers(res.slice(0, 5));
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load users");
      });
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered.slice(0, 5));
    } else {
      setFilteredUsers(users.slice(0, 5));
    }
  }, [searchQuery, users]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (existingMedia.length + mediaFiles.length + files.length > 3) {
      setError("Maximum 3 media files allowed");
      return;
    }
    setMediaFiles((prev) => [...prev, ...files].slice(0, 3));
  };

  const removeExistingMedia = (index: number) => {
    setExistingMedia(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!caption.trim()) {
      setError("Caption is required");
      return false;
    }

    const captionRegex = /^[\w\s!@#$%^&*(),.?":{}|<>]{1,500}$/;
    if (!captionRegex.test(caption)) {
      setError("Caption contains invalid characters or is too long");
      return false;
    }

    if (existingMedia.length + mediaFiles.length === 0) {
      setError("At least one media file is required");
      return false;
    }

    return true;
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      // Upload new media files
      const newMediaUrls = await Promise.all(
        mediaFiles.map(async (file) => {
          const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          await new Promise((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              null,
              (error) => reject(error),
              () => resolve(uploadTask)
            );
          });

          const url = await getDownloadURL(uploadTask.snapshot.ref);
          return {
            url,
            mediaType: file.type.startsWith("image/") ? "image" : "video",
          };
        })
      );

      // Combine existing and new media
      const allMedia = [...existingMedia, ...newMediaUrls];

      await userPostApi.updatePost(post.id.toString(), currentUserId!, {
        caption,
        media: allMedia,
        taggedUserIds: selectedUsers,
      });

      onRefresh();
      onClose();
    } catch (err) {
      setError("Failed to update post. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Edit Post</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={4}
              placeholder="What's on your mind?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media (Maximum 3 files)
            </label>
            
            {/* Existing Media Preview */}
            {existingMedia.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2 mb-4">
                {existingMedia.map((media, index) => (
                  <div key={`existing-${index}`} className="relative">
                    {media.mediaType === 'image' ? (
                      <img
                        src={media.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <video
                        src={media.url}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeExistingMedia(index)}
                      className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New Media Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
                id="media-input"
                disabled={existingMedia.length + mediaFiles.length >= 3}
              />
              <label
                htmlFor="media-input"
                className={`flex flex-col items-center cursor-pointer ${
                  existingMedia.length + mediaFiles.length >= 3 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <ImageIcon className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">
                  {existingMedia.length + mediaFiles.length >= 3
                    ? "Maximum files reached"
                    : "Click to upload images or videos"}
                </span>
              </label>
            </div>

            {/* New Media Preview */}
            {mediaFiles.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {mediaFiles.map((file, index) => (
                  <div key={`new-${index}`} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewMedia(index)}
                      className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tag Users
            </label>
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {filteredUsers.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserSelect(user.id)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Post"
              )}
            </button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default EditPostModal;
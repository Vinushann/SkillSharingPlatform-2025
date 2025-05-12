import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  X,
  Send,
  Edit,
  Trash2,
} from "lucide-react";
import { UserSummaryDTO, CommentResponse } from "../../types/comment-types";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { likeApi } from "../../api/likeApi";
import { commentApi } from "../../api/commentApi";
import { userPostApi } from "../../api/userPostApi";

interface PostCommentContainerProps {
  postId: string;
  likedByCurrentUser: boolean;
  likeCount: number;
  commentCount: number;
  repostedBy: UserSummaryDTO[];
  onRefresh: () => Promise<void>;
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  outline: "none",
  borderRadius: 2,
  maxHeight: "90vh",
  overflowY: "auto",
};

const PostCommentContainer = ({
  postId,
  likedByCurrentUser,
  likeCount,
  commentCount,
  repostedBy,
  onRefresh,
}: PostCommentContainerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingComment, setEditingComment] = useState<CommentResponse | null>(
    null
  );
  const currentUserId = localStorage.getItem("userId");

  const handleLike = async () => {
    try {
      await likeApi.toggleLike(postId, currentUserId!);
      await onRefresh();
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const loadComments = async () => {
    try {
      const response = await commentApi.getCommentsForPost(postId);
      setComments(response);
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const handleOpenComments = async () => {
    setIsModalOpen(true);
    await loadComments();
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setIsLoading(true);
      await commentApi.createComment(postId, newComment);
      setNewComment("");
      await loadComments();
      await onRefresh();
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await commentApi.deleteComment(commentId);
      await loadComments();
      await onRefresh();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleUpdateComment = async () => {
    if (!editingComment || !editingComment.content.trim()) return;

    try {
      await commentApi.updateComment(editingComment.id, editingComment.content);
      setEditingComment(null);
      await loadComments(); // Refresh comments
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const repostPost = async () => {
    try{
        await userPostApi.repostPost(postId,currentUserId!)
    }
    catch(err){
        console.error(err)
    }
  };

  return (
    <>
      <div className="p-4 flex items-center space-x-4 border-t border-gray-100">
        <button
          onClick={handleLike}
          className="flex items-center space-x-2 text-gray-500 hover:text-red-500 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 text-white hover:from-purple-500 hover:to-indigo-600"
        >
          <Heart
            className={`w-5 h-5 ${likedByCurrentUser ? "fill-white" : ""}`}
          />
          <span>{likeCount}</span>
        </button>
        <button
          onClick={handleOpenComments}
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 text-white hover:from-indigo-500 hover:to-purple-600"
        >
          <MessageCircle className="w-5 h-5" />
          <span>{commentCount}</span>
        </button>
        <button
          onClick={repostPost}
          className="flex items-center space-x-2 text-gray-500 hover:text-green-500 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 text-white hover:from-purple-600 hover:to-violet-700"
        >
          <Share2 className="w-5 h-5" />
          <span>{repostedBy.length}</span>
        </button>
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={modalStyle}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Comments</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <img
                      src={comment.user.profileImageUrl}
                      alt={`${comment.user.firstName}'s avatar`}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium">
                        {comment.user.firstName} {comment.user.lastName}
                      </p>
                      {editingComment?.id === comment.id ? (
                        <div className="mt-2">
                          <textarea
                            value={editingComment.content}
                            onChange={(e) =>
                              setEditingComment({
                                ...editingComment,
                                content: e.target.value,
                              })
                            }
                            className="w-full p-2 border rounded-lg"
                            rows={3}
                          />
                          <div className="flex justify-end space-x-2 mt-2">
                            <button
                              onClick={() => setEditingComment(null)}
                              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleUpdateComment}
                              className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-600">{comment.content}</p>
                      )}
                    </div>
                  </div>
                  {(comment.user.id === currentUserId ||
                    postId === currentUserId) && (
                    <div className="flex space-x-2">
                      {comment.user.id === currentUserId && (
                        <button
                          onClick={() => setEditingComment(comment)}
                          className="p-1 hover:bg-gray-200 rounded-full"
                        >
                          <Edit className="w-4 h-4 text-gray-500" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="p-1 hover:bg-gray-200 rounded-full"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={2}
            />
            <button
              onClick={handleAddComment}
              disabled={isLoading || !newComment.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default PostCommentContainer;

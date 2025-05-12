import { useState } from "react";
import { PostResponse } from "../../types/post-types";
import { ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import moment from "moment";
import { userPostApi } from "../../api/userPostApi";
import PostCommentContainer from "./PostCommentContainer";
import EditPostModal from "./EditPostModal";
import { useNavigate } from "react-router-dom";

interface PostCardProps {
  post: PostResponse;
  onRefresh: () => Promise<void>;
}

const PostCard = ({ post, onRefresh }: PostCardProps) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const currentUserId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const handleProfileClick = (userId:string) => {
    if (userId === currentUserId) {
      navigate("/profile");
    } else {
      navigate(`/profile/${post.postedBy.id}`);
    }
  };

  const nextMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === post.media.length - 1 ? 0 : prev + 1
    );
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === 0 ? post.media.length - 1 : prev - 1
    );
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmed) return;

    try {
      await userPostApi.deletePost(post.id.toString(), currentUserId || "");
      onRefresh();
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 w-4/5 mx-auto">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
      {post.isRepost && (
              <div className="flex items-center mb-2 text-sm text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16l-4-4m0 0l4-4m-4 4h18"
                  />
                </svg>
                <span>
                  Reposted by {post.reposter?.firstName}{" "}
                  {post.reposter?.lastName}
                </span>
              </div>
            )}
        <div className="p-4 flex items-center justify-between">

          <div
            onClick={()=>{handleProfileClick(post.postedBy.id)}}
            className="flex flex-col cursor-pointer hover:bg-gray-50 rounded-lg transition-colors p-2"
          >
          

            <div className="flex items-center space-x-3">
              <img
                src={post.postedBy.profileImageUrl}
                alt={`${post.postedBy.firstName}'s profile`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">
                  {post.postedBy.firstName} {post.postedBy.lastName}
                </h3>
                <p className="text-sm text-gray-500">
                  {moment(post.postedAt).format("MMM D, YYYY")}
                </p>
              </div>
            </div>
          </div>
        </div>
        {!post.isRepost && currentUserId === post.postedBy.id && (
          <div className="flex space-x-2">
            <button
              className="p-2 hover:bg-purple-100 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 text-white"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              className="p-2 hover:bg-red-100 rounded-full bg-gradient-to-r from-red-400 to-pink-500 text-white"
              onClick={handleDelete}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Tagged Users - Moved to the top */}
      {post.taggedUsers.length > 0 && (
        <div className="px-4 pb-3 text-sm text-gray-600 flex items-center">
          <span className="font-medium mr-1">With </span>
          {post.taggedUsers.map((user, index) => (
            <span
            onClick={() => handleProfileClick(user.id)}
            
            key={user.id} className="font-medium text-purple-700 cursor-pointer">
              {user.firstName} {user.lastName}
              {index < post.taggedUsers.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
      )}

      {/* Post Caption */}
      <p className="px-4 pb-4">{post.caption}</p>

      {/* Media Carousel */}
      {post.media.length > 0 && (
        <div className="relative">
          <div className="aspect-video bg-gray-100">
            {post.media[currentMediaIndex].mediaType === "image" ? (
              <img
                src={post.media[currentMediaIndex].url}
                alt={`Post media ${currentMediaIndex + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={post.media[currentMediaIndex].url}
                controls
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {post.media.length > 1 && (
            <>
              <button
                onClick={prevMedia}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMedia}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {post.media.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentMediaIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Post Actions */}
      {!post.isRepost && (
        <PostCommentContainer
          postId={post.id}
          likedByCurrentUser={post.likedByCurrentUser}
          likeCount={post.likeCount}
          commentCount={post.commentCount}
          repostedBy={post.repostedBy}
          onRefresh={onRefresh}
        />
      )}
      <EditPostModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        post={post}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default PostCard;

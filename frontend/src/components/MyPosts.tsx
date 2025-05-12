import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import CreatePostModal from "../pages/Posts/CreatePostModal";
import { PostResponse } from "../types/post-types";
import { userPostApi } from "../api/userPostApi";
import PostCard from "../pages/Posts/PostCard";
import { Loader2, FileX } from "lucide-react";

const MyPosts = () => {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleCreatePost = () => {
    setCreateModalOpened(true);
  };

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId")!;
      const response = await userPostApi.getPostsByUserId(userId, userId);
      setPosts(response);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent inline-block">
            Your Knowledge Hub
          </h1>
          <p className="text-gray-500">
            Manage and showcase all your shared expertise
          </p>
        </div>

        <button
          onClick={handleCreatePost}
          className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          aria-label="Create new post"
        >
          <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            <span className="text-sm font-semibold">New Post</span>
          </span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
          <FileX className="w-16 h-16 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Posts Yet</h3>
          <p>Share your first piece of knowledge!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onRefresh={fetchPosts} />
          ))}
        </div>
      )}

      <CreatePostModal
        opne={createModalOpened}
        onClose={() => {
          setCreateModalOpened(false);
          fetchPosts(); // Refresh posts after creating
        }}
      />
    </div>
  );
};

export default MyPosts;

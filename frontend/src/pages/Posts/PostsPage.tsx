import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import CreatePostModal from "./CreatePostModal";
import { useState } from "react";
import PostList from "./PostList";
const PostsPage = () => {
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const handleCreatePost = () => {
    setCreateModalOpened(true);
  };
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero Section */}
      <div className="relative mb-12 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-violet-900 shadow-xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-purple-700/50 to-violet-900/50"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <svg
            className="absolute top-0 left-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 1920 1080"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path
              fill="url(#grad1)"
              d="M0,0 L1920,0 L1920,1080 L0,1080 Z"
              opacity="0.4"
            >
              <animate
                attributeName="d"
                dur="15s"
                repeatCount="indefinite"
                values="
              M0,0 L1920,0 L1920,1080 L0,1080 Z;
              M0,0 L1920,0 L1850,1080 L70,1080 Z;
              M0,0 L1920,0 L1920,1080 L0,1080 Z"
              />
            </path>
          </svg>
        </div>
        <div className="relative py-16 px-6 sm:px-12 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute -top-8 right-8 w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full opacity-50 blur-xl"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full opacity-40 blur-xl"
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg"
          >
            Share Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-violet-300">
              Skills
            </span>
            , Grow Together
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8"
          >
            Discover amazing tutorials, connect with experts, and elevate your
            expertise
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={handleCreatePost}
              className="px-8 py-3 bg-white text-purple-700 font-medium rounded-full hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-purple-100"
            >
              <Plus className="inline h-5 w-5 mr-2 -mt-1" />
              Share Your Knowledge
            </button>
          </motion.div>
        </div>
      </div>
      <CreatePostModal
        opne={createModalOpened}
        onClose={() => setCreateModalOpened(false)}
      />
      <PostList />
    </div>
  );
};

export default PostsPage;

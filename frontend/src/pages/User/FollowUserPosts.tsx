import { useEffect, useState } from "react";
import { PostResponse } from "../../types/post-types";
import { userPostApi } from "../../api/userPostApi";

interface FollowUserPostsProps {
  userId: string;
}

const FollowUserPosts = ({ userId }: FollowUserPostsProps) => {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!currentUserId) {
          throw new Error("User ID not found");
        }
        
        const fetchedPosts = await userPostApi.getPostsByUserId(userId, currentUserId);
        setPosts(fetchedPosts);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [userId, currentUserId]);

  // Function to render post thumbnail
  const renderPostThumbnail = (post: PostResponse) => {
    // Check if post has media
    if (!post.media || post.media.length === 0) {
      return (
        <div className="bg-gray-100 flex items-center justify-center h-full">
          <span className="text-gray-400 text-sm">No media</span>
        </div>
      );
    }

    // Get first media
    const firstMedia = post.media[0];
    
    // Check media type and render accordingly
    if (firstMedia.mediaType?.includes('image')) {
      return (
        <img 
          src={firstMedia.url} 
          alt={post.caption} 
          className="object-cover w-full h-full"
        />
      );
    } else if (firstMedia.mediaType?.includes('video')) {
      return (
        <div className="relative w-full h-full">
          <img 
            src={firstMedia.url || firstMedia.url} 
            alt={post.caption} 
            className="object-cover w-full h-full"
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-gray-100 flex items-center justify-center h-full">
          <span className="text-gray-400 text-sm">Unsupported media</span>
        </div>
      );
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gray-200"></div>
          <div className="mt-2 text-gray-500 text-sm">Loading posts...</div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render no posts state
  if (posts.length === 0) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-center p-6">
          <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No Posts Yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            This user hasn't shared any posts yet.
          </p>
        </div>
      </div>
    );
  }

  // Render posts grid
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-xl font-semibold mb-4">Posts</h2>
      
      <div className="grid grid-cols-3 gap-1 md:gap-3">
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="aspect-square overflow-hidden relative bg-gray-50 cursor-pointer hover:opacity-90 transition-opacity"
          >
            {renderPostThumbnail(post)}
            
            {/* Show additional indicators */}
            {post.media?.length > 1 && (
              <div className="absolute top-2 right-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            )}
            
            {/* Overlay with post stats */}
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <div className="flex space-x-6 text-white">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="font-medium">{post.likeCount}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="font-medium">{post.commentCount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowUserPosts;
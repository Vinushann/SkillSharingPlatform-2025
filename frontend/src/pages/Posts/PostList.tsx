import { useState, useEffect, useRef } from "react";
import { PostResponse } from "../../types/post-types";
import { userPostApi } from "../../api/userPostApi";
import PostCard from "./PostCard";
import { Loader2, FileX } from "lucide-react";

const PostList = () => {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUserId = localStorage.getItem("userId");
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);

  useEffect(() => {
    fetchPosts(false);
  }, [currentUserId]);

  const fetchPosts = async (preserveScroll = true) => {
    try {
      if (preserveScroll && scrollRef.current) {
        scrollPositionRef.current = scrollRef.current.scrollTop;
      }

      setIsLoading(true);
      const result = await userPostApi.getAllPosts(currentUserId ?? "123123");

      const allPosts: PostResponse[] = [...result];

      // result.forEach((post) => {
      //   if (post.repostedBy.length > 0) {
      //     post.repostedBy.forEach((user) => {
      //       const repost: PostResponse = {
      //         ...post,
      //         reposter: user,
      //         originalPoster: post.postedBy,
      //         postedBy: user,
      //         isRepost: true,
      //       };
      //       const randomIndex = Math.floor(
      //         Math.random() * (allPosts.length + 1)
      //       );
      //       allPosts.splice(randomIndex, 0, repost);
      //     });
      //   }
      // });

      setPosts(allPosts.reverse());
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);

      // Restore scroll position after fetch
      if (preserveScroll && scrollRef.current) {
        scrollRef.current.scrollTo(0, scrollPositionRef.current);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <FileX className="w-16 h-16 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Posts Yet</h3>
        <p>Be the first one to share something amazing!</p>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="space-y-6 overflow-auto max-h-[80vh] px-1">
      {posts.map((post) => (
        <PostCard post={post} key={post.id} onRefresh={() => fetchPosts(true)} />
      ))}
    </div>
  );
};

export default PostList;

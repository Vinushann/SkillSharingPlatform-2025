import { useState, useEffect } from "react";
import { followApi } from "../../api/followApi";
import { User } from "../../types/user-types";

interface FollowUserHeaderProps {
  userId: string;
  user: User;
}

const FollowUserHeader = ({ userId, user }: FollowUserHeaderProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const currentUserId = localStorage.getItem("userId");
  const isCurrentUser = currentUserId === userId;
  
  // Check if current user is following this user
  const checkFollowStatus = async () => {
    try {
      if (!currentUserId || isCurrentUser) return;
      
      const followers = await followApi.getFollowers(userId);
      const isFollowingUser = followers.some(follow => follow.follower?.id === currentUserId);
      setIsFollowing(isFollowingUser);
    } catch (err) {
      console.error("Error checking follow status:", err);
    }
  };
  
  // Fetch follow counts
  const fetchFollowCounts = async () => {
    try {
      const [followers, followings] = await Promise.all([
        followApi.countFollowers(userId),
        followApi.countFollowings(userId)
      ]);
      
      setFollowerCount(followers);
      setFollowingCount(followings);
    } catch (err) {
      console.error("Error fetching follow counts:", err);
    }
  };
  
  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([checkFollowStatus(), fetchFollowCounts()]);
      } catch (err) {
        console.error("Error initializing data:", err);
      }
    };
    
    initializeData();
  }, [userId, currentUserId]);
  
  const handleFollowToggle = async () => {
    if (!currentUserId || isCurrentUser) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (isFollowing) {
        await followApi.unfollowUser(userId,currentUserId);
        setFollowerCount(prev => Math.max(prev - 1, 0));
      } else {
        await followApi.followUser(userId,currentUserId);
        setFollowerCount(prev => prev + 1);
      }
      
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Error toggling follow status:", err);
      setError(isFollowing ? "Failed to unfollow user." : "Failed to follow user.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const getInitials = () => {
    return (user.firstName?.[0] || '') + (user.lastName?.[0] || '');
  };
  
  const getFullName = () => {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Profile Image */}
        <div className="relative">
          {user.profileImageUrl ? (
            <img 
              src={user.profileImageUrl} 
              alt={getFullName()}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-semibold">
              {getInitials()}
            </div>
          )}
          
          {/* Private account indicator */}
          {!user.publicStatus && (
            <div className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-1" title="Private account">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          )}
        </div>
        
        {/* User Info */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
            <h1 className="text-xl font-bold">{getFullName()}</h1>
            <span className="text-gray-500">@{user.username}</span>
            
            {!isCurrentUser && (
              <div className="ml-auto">
                <button
                  onClick={handleFollowToggle}
                  disabled={isLoading}
                  className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                    isFollowing 
                      ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } disabled:opacity-50`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isFollowing ? 'Unfollowing...' : 'Following...'}
                    </div>
                  ) : (
                    isFollowing ? 'Following' : 'Follow'
                  )}
                </button>
              </div>
            )}
          </div>
          
          {/* Bio */}
          {user.bio && (
            <p className="text-gray-700 mb-4">{user.bio}</p>
          )}
          
          {/* User Stats */}
          <div className="flex gap-4 text-sm">
            <div className="flex flex-col items-center">
              <span className="font-semibold text-lg">{followerCount}</span>
              <span className="text-gray-500">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-lg">{followingCount}</span>
              <span className="text-gray-500">Following</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional Info */}
      <div className="mt-5 pt-5 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {user.birthday && (
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {new Date(user.birthday).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          )}
          
          {user.gender && (
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{user.gender}</span>
            </div>
          )}
          
          {user.address && (
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{user.address}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Joined {new Date(user.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long'
            })}</span>
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default FollowUserHeader;
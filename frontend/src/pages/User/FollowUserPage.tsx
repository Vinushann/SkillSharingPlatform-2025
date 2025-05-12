import { useParams } from "react-router-dom";
import FollowUserHeader from "./FollowUserHeader";
import FollowUserPosts from "./FollowUserPosts";
import { useEffect, useState } from "react";
import { followApi } from "../../api/followApi";
import { userApi } from "../../api/userApi";
import { Loader2 } from "lucide-react"; // Import the loader icon from Lucide React
import { User } from "../../types/user-types";

const FollowUserPage = () => {
  const { id } = useParams(); // Extract the user ID from the URL
  const [canViewProfile, setCanViewProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [user, setUser] = useState<User|undefined>();
  useEffect(() => {
    const checkCanViewProfile = async () => {
      try {
        setIsLoading(true); // Start loading

        // Fetch the user's details
        const user = await userApi.getUserById(id!);
        setUser(user)
        // Fetch the followings of the user being viewed
        const followings = await followApi.getFollowings(id!);

        // Check if the profile is public or if the current user is following the viewed user
        const currentUser = localStorage.getItem("userId"); // Get the current user's ID
        if (user.publicStatus || followings.some((follow) => follow.following.id === currentUser)) {
          setCanViewProfile(true);
        } else {
          setCanViewProfile(false);
        }
      } catch (error) {
        console.error(`Error checking can view profile: ${error}`);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    checkCanViewProfile();
  }, [id]); // Re-run when the `id` changes

  // Render loading spinner
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" /> {/* Lucide React spinner */}
      </div>
    );
  }

  

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Pass the user ID directly to the header and posts components */}
      <FollowUserHeader user={user!} userId={id!} />
{ !canViewProfile  ?
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-center">Access Denied</h1>
        <p className="text-center mt-4">You do not have permission to view this profile.</p>
      </div>
:    <FollowUserPosts userId={id!} />}
    </div>
  );
};

export default FollowUserPage;
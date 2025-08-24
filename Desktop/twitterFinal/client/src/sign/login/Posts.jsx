import { useQuery } from '@tanstack/react-query';
import { Post } from './Post';
import { useFollowRemove } from './Follow.js';

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", VITE_BACKEND_URL); // confirm

export const Posts = ({ feedType }) => {
  const token = localStorage.getItem("token"); // JWT token

  const getPostEndPoint = () => {
    switch (feedType) {
      case 'foryou':
        return `${VITE_BACKEND_URL}api/posts/allPosts`;
      case 'following':
        return `${VITE_BACKEND_URL}api/posts/getFollowingPosts`;
      default:
        return `${VITE_BACKEND_URL}api/posts/allPosts`;
    }
  };

  // Fetch current user info
  const { data: authUser, isLoading: authLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch(`${VITE_BACKEND_URL}api/auth/getMe`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
  });

  // Fetch posts
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['posts', feedType],
    queryFn: async () => {
      const res = await fetch(getPostEndPoint(), {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error fetching posts');
      }
      return res.json();
    }
  });

  const { followRemove } = useFollowRemove();

  return (
    <div className="mt-6 p-4">
      {/* Loading & Error */}
      {isLoading && <p className="text-center mt-4">Loading posts...</p>}
      {error && <p className="text-center mt-4 text-red-600">Error loading posts: {error.message}</p>}
      {!isLoading && posts.length === 0 && (
        <p className="text-center mt-4 text-gray-500">No Posts</p>
      )}

      {/* Following List */}
      {feedType === 'following' && (
        <div className="mb-6 ml-0">
          <h2 className="text-lg font-semibold mb-2">You're following:</h2>
          {authLoading && <p>Loading your following...</p>}
          {authUser?.following?.length > 0 ? (
            authUser.following.map((user) => (
              <div key={user._id} className="p-2 border rounded mb-2 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    followRemove(user._id);
                  }}
                  className="bg-black text-white rounded-2xl px-4 py-1 cursor-pointer"
                >
                  Unfollow
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">You're not following anyone yet.</p>
          )}
        </div>
      )}

      {/* Posts List */}
      {posts.map((postData) => (
        <Post key={postData._id} post={postData} feedType={feedType} />
      ))}
    </div>
  );
};

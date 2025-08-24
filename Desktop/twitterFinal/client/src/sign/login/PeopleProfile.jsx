import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import bgProfile from '../../img/noProfile-bg.jpg';
import noProfile from '../../img/no-profile.png';
import { IoMdSearch } from "react-icons/io";
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from 'axios';

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", VITE_BACKEND_URL); // just to confirm

export const PeopleProfile = ({ profileShow, setProfileShow, authUser }) => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [showFullImage, setShowFullImage] = useState(false);
  const [showProfileImage, setShowProfileImage] = useState(false);

  // Track which posts have their comments open
  const [openComments, setOpenComments] = useState(new Set());

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${VITE_BACKEND_URL}api/users/${username}`, {
          withCredentials: true,
        });
        setUserData(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    if (username) fetchUser();
  }, [username]);

  if (!userData) return <p className="p-6">Loading profile...</p>;

  const isFollowing = authUser?.following?.some(f => f._id === userData._id);

  const toggleComments = (postId) => {
    const newSet = new Set(openComments);
    if (newSet.has(postId)) newSet.delete(postId);
    else newSet.add(postId);
    setOpenComments(newSet);
  };

  return (
    <div className='lg:ml-20 p-4'>
      {/* Back + Header */}
      <div className='flex items-center mb-4'>
        <FaArrowLeftLong
          onClick={() => setProfileShow(!profileShow)}
          className='cursor-pointer text-xl'
        />
        <div className='ml-4'>
          <p className='font-bold text-xl'>{userData.fullname}</p>
          <p className='text-gray-500 text-sm'>{userData.posts?.length || 0} posts</p>
        </div>
      </div>

      {/* Cover + Profile Pic */}
      <div className="relative w-full">
        <img
          src={userData.coverImg || bgProfile}
          onClick={() => setShowFullImage(true)}
          className="w-full h-60 object-cover rounded cursor-pointer"
          alt="Cover"
        />
        <img
          src={userData.profileImg || noProfile}
          onClick={() => setShowProfileImage(true)}
          className="w-44 h-44 rounded-full border-4 border-white absolute top-40 left-10 bg-white cursor-pointer"
          alt="Profile"
        />

        {showFullImage && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setShowFullImage(false)}
          >
            <img src={userData.coverImg || bgProfile} className="max-w-full max-h-full" alt="Full Cover" />
          </div>
        )}

        {showProfileImage && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setShowProfileImage(false)}
          >
            <img src={userData.profileImg || noProfile} className="max-w-full max-h-full" alt="Full Profile" />
          </div>
        )}
      </div>

      {/* Follow & Options */}
      <div className='flex justify-end gap-5 mt-4'>
        <IoMdSearch className='border cursor-pointer p-1.5 border-gray-300 rounded-full w-9 h-9' />
        <button className='bg-black text-white px-6 py-2 rounded-full'>
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      </div>

      {/* Bio */}
      <div className='mt-4'>
        <p className='font-bold text-2xl'>{userData.fullname}</p>
        <p className='text-gray-400'>@{userData.username}</p>
        <p className='mt-2'>{userData.bio || "No bio yet"}</p>
        <div className='flex mt-2 gap-4 text-sm text-gray-600'>
          {userData.location && <p>📍 {userData.location}</p>}
          <p>Joined {new Date(userData.createdAt).toLocaleDateString()}</p>
        </div>
        <div className='flex mt-2 gap-5'>
          <p>{userData.following?.length} <span className='text-gray-400'>Following</span></p>
          <p>{userData.followers?.length} <span className='text-gray-400'>Followers</span></p>
        </div>
      </div>

      {/* Mutual Follows */}
      {userData.followers?.length > 0 && (
        <div className='flex mt-3 items-center gap-2 text-sm text-gray-500'>
          <img src={noProfile} className='w-5 h-5 rounded-full' alt="" />
          <p>Followed by {userData.followers[0]?.username}</p>
        </div>
      )}

      {/* Posts */}
      <p className='mt-5 text-gray-500'>
        {userData.posts?.length ? `${userData.posts.length} Posts` : "No Posts"}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {userData.posts && userData.posts.length > 0 ? (
          userData.posts.map((post) => (
            <div key={post._id} className="flex flex-col border border-gray-300 p-2 rounded shadow-sm">
              {post.img && (
                <img
                  src={post.img}
                  alt="Post"
                  className="w-full h-full object-cover rounded aspect-square"
                />
              )}
              {post.text && (
                <p className="mt-2 font-medium text-gray-700">{post.text}</p>
              )}

              {/* Likes & Comments */}
              <div className="flex justify-between mt-1 text-sm text-gray-500">
                <span>👍 {post.likes.length} Likes</span>
                <span 
                  className="cursor-pointer" 
                  onClick={() => toggleComments(post._id)}
                >
                  💬 {post.comments.length} Comments
                </span>
              </div>

              {/* Post Date */}
              <p className="mt-1 text-xs text-gray-400">
                Posted on {new Date(post.createdAt).toLocaleDateString()}
              </p>

              {/* Comments Section */}
              {openComments.has(post._id) && (
                <div className="mt-2 border-t pt-2 text-sm text-gray-700">
                  {post.comments.length > 0 ? (
                    post.comments.map((comment) => (
                      <p key={comment._id}>
                        <span className="font-bold">{comment.user.fullname}: </span>
                        {comment.text}
                      </p>
                    ))
                  ) : (
                    <p>No comments yet</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No posts to show</p>
        )}
      </div>
    </div>
  );
};

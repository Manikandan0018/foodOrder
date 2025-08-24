import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Trash2, Loader2 } from "lucide-react"; // Loader2 = nice spinner

const API_URL = "http://localhost:5000/api/admin";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", VITE_BACKEND_URL); // just to confirm

export default function Admin() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${VITE_BACKEND_URL}api/admin/posts`);
      setPosts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ✅ Delete post
  const handleDeletePost = async (postId) => {
    await axios.delete(`${VITE_BACKEND_URL}api/admin/posts/${postId}`);
    fetchPosts();
  };

  // ✅ Delete comment
  const handleDeleteComment = async (postId, commentId) => {
    await axios.delete(`${VITE_BACKEND_URL}api/admin/posts/${postId}/comments/${commentId}`);
    fetchPosts();
  };

  return (
    <div className="min-h-screen absolute bg-gray-100 right-1 bg-gradient-to-r p-6">
      {/* Header */}
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-800"
      >
        🛡️ Admin Dashboard
      </motion.h1>

      {/* ✅ Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Loader2 size={40} className="text-blue-600" />
          </motion.div>
        </div>
      ) : (
        // ✅ Posts Grid
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white shadow-lg rounded-2xl p-5 hover:shadow-xl transition relative"
            >
              {/* User */}
              <h2 className="font-semibold text-gray-700 mb-2">
                {post.user?.username || "Unknown User"}
              </h2>

              {/* Text */}
              <p className="text-gray-600 mb-3">{post.text}</p>

              {/* Image */}
              {post.img && (
                <img
                  src={post.img}
                  alt="post"
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              )}

              {/* Delete Post Button */}
              <button
                onClick={() => handleDeletePost(post._id)}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg 
                           hover:bg-red-600 transition absolute top-4 right-4 text-sm"
              >
                <Trash2 size={16} /> Delete
              </button>

              {/* Comments Section */}
              <h3 className="mt-4 font-medium text-gray-700">Comments:</h3>
              <div className="space-y-2 mt-2">
                {post.comments.length === 0 && (
                  <p className="text-sm text-gray-500">No comments yet.</p>
                )}
                {post.comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="bg-gray-50 border p-2 rounded-md flex justify-between items-center"
                  >
                    <p className="text-sm">
                      <b>{comment.user?.username}:</b> {comment.text}
                    </p>
                    <button
                      onClick={() =>
                        handleDeleteComment(post._id, comment._id)
                      }
                      className="bg-red-400 text-white px-2 py-1 rounded-md hover:bg-red-500 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

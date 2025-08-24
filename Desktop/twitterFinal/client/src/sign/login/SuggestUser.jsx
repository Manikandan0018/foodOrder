import { useQuery } from "@tanstack/react-query";
import { useFollow } from '../useFollow.js';
import postProfile from '../../img/profile-none.jpg';

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const SuggestUser = ({ setProfileShow, profileShow }) => {
  const token = localStorage.getItem("token");

  const { data: suggestUsers } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      const res = await fetch(`${VITE_BACKEND_URL}api/users/suggested`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unauthorized");
      return data;
    },
  });

  const { follow, isPending } = useFollow();

  const profileOn = (e) => {
    e.preventDefault();
    setProfileShow(!profileShow);
  };

  return (
    <div className="mt-5">
      <h1 className='text-xl font-bold'>Who to follow</h1>
      {suggestUsers?.map((data) => (
        <div key={data._id} onClick={profileOn} className='flex justify-between items-center mt-3'>
          <div className='flex items-center gap-2'>
            <img src={postProfile} className="w-12 h-12 rounded-full" alt="" />
            <div>
              <p>{data.fullname}</p>
              <p className='text-gray-500'>@{data.username}</p>
            </div>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); follow(data._id); }}
            className='bg-black hover:bg-blue-500 text-white rounded-full px-3 h-8'>
            {isPending ? "Following..." : "Follow"}
          </button>
        </div>
      ))}
      <p className='text-blue-600 cursor-pointer mt-2'>Show more</p>
    </div>
  );
};

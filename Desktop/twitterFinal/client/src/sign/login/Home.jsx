import { IoIosSearch } from "react-icons/io";
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import nytech from '../../img/nytech.jpeg';
import { Posts } from './Posts';
import { SuggestUser } from "./SuggestUser.jsx";
import { CreatePost } from "./CreatePost.jsx";
import NotificationPage from "./NotificationPage.jsx";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.trim();

export const Home = ({ notifi }) => {
  const [feedType, setFeedType] = useState('foryou');

  const token = localStorage.getItem("token");

  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      if (!token) return null;
      const res = await fetch(`${VITE_BACKEND_URL}api/auth/getMe`, {
        method: "GET",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      if (!res.ok) return null;
      return res.json();
    },
  });

  if (isLoading || !authUser) return <p>Loading...</p>;

  const fname = authUser.username?.[0]?.toUpperCase() || '?';

  return (
    <div className="flex lg:ml-35">
      <div className="flex-1">
        {notifi && <NotificationPage />}
        {!notifi && (
          <div className="flex flex-col border border-gray-200 w-full lg:w-[700px] px-5">
            <div className="flex justify-around mt-5">
              <p onClick={() => setFeedType('foryou')} className={`cursor-pointer ${feedType === 'foryou' ? "border-b-4 border-blue-400" : ""}`}>For you</p>
              <p onClick={() => setFeedType('following')} className={`cursor-pointer ${feedType === 'following' ? "border-b-4 border-blue-400" : ""}`}>Following</p>
            </div>

            <div className='mt-3 ml-2 flex items-center gap-2'>
              <p className='bg-fuchsia-950 text-white h-7 w-7 rounded-full text-center font-bold'>{fname}</p>
              <p className='text-xl text-gray-500'>What is happening?!</p>
            </div>

            {feedType === 'foryou' && <CreatePost />}
            <Posts feedType={feedType} />
          </div>
        )}
      </div>

      <div className="hidden lg:flex flex-col fixed top-0 right-0 w-[400px] p-5 h-screen overflow-y-auto">
        <div className='flex relative'>
          <IoIosSearch className='absolute scale-110 text-gray-400 mt-3 ml-5' />
          <input type="text" placeholder='Search' className='border border-gray-300 rounded-full w-[300px] h-10 pl-11' />
        </div>

        <div className='mt-8'>
          <h1 className='text-2xl font-bold'>Subscribe to Premium</h1>
          <p className='mt-2'>Subscribe to unlock new features and if eligible, receive a share of revenue.</p>
          <button className='bg-blue-400 mt-4 text-white w-32 h-9 rounded-full'>Subscribe</button>
        </div>

        <div className='mt-5'>
          <h1 className='text-2xl font-bold'>What’s happening</h1>
          <div className='flex mt-2 items-center gap-3'>
            <img src={nytech} className='w-20 h-15' alt="nytech" />
            <div>
              <p className='font-bold'>NY Tech Week: Official Launch</p>
              <p className='text-red-500'>LIVE</p>
            </div>
          </div>
        </div>

        <SuggestUser />

        <div className='mt-5 text-sm'>
          <div className='flex gap-5'>
            <p className='border-r pr-5'>Terms of Service</p>
            <p className='border-r pr-5'>Privacy Policy</p>
            <p>Cookie Policy</p>
          </div>
          <div className='flex gap-5 mt-1'>
            <p className='border-r pr-5'>Accessibility</p>
            <p className='border-r pr-5'>Ads info</p>
            <p>More.... @2025 X Corp</p>
          </div>
        </div>
      </div>
    </div>
  );
};

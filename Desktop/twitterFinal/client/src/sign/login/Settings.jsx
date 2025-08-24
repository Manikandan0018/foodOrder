// Settings.jsx
import { useNavigate } from "react-router-dom";
import { IoIosHome, IoIosNotifications, IoIosContact } from "react-icons/io";
import { CiCircleMore } from "react-icons/ci";
import { useQuery } from '@tanstack/react-query';
import BaseUrl from "../../constant/Url.jsx";
import { Logout } from './Logout.jsx';
import logo from '../../img/twitter-logo.png';

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", VITE_BACKEND_URL); // just to confirm

export const Settings = ({ showSidebar, setShowSidebar, setNoti, noti }) => {
  const navigate = useNavigate();

   const gotoChat = () => {
    navigate('/chat'); 
  };

  const fetchAuthUser = async () => {
    const res = await fetch(`${VITE_BACKEND_URL}api/auth/getMe`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to fetch auth user");
    return res.json();
  };

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: fetchAuthUser,
  });

  if (isLoading || !authUser) return <p>Loading...</p>;

  const fname = authUser.username?.[0]?.toUpperCase() || '?';
  const gotoProfile = () => navigate(`/profile/${authUser.username}`);
  const gotoAdmin = () => navigate("/admin");
  const gotoHome = () => navigate("/");

  return (
    <>
      {/* Overlay for small screens */}
      {/* Overlay for small screens */}
{showSidebar && (
  <div
    className="fixed inset-0  bg-opacity-30 z-40 lg:hidden"
    onClick={() => {
      setNoti(false);      
      setShowSidebar(false); 
    }}
  />
)}



      {/* Sidebar */}
      <div className={`fixed  top-0 left-0 h-full bg-white transform transition-transform pt-20 lg:mt-0 duration-300 ease-in-out
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 z-50`}>

        {/* Logo */}
        <img src={logo} className='w-8 lg:mt-10 ml-4 lg:ml-8' alt="logo" />

        <div className='flex flex-col h-full justify-between p-4'>
          {/* Sidebar Menu */}
          <div className='mt-7 flex flex-col gap-3 items-center lg:items-start lg:ml-8'>
            <div onClick={gotoHome} className='flex items-center gap-2 lg:gap-5 cursor-pointer hover:bg-gray-200 w-12 lg:w-50 h-10 pt-2 pl-3 rounded-3xl'>
              <IoIosHome className='text-2xl' />
              <p className='hidden lg:block scale-150 font-bold'>Home</p>
            </div>

            <div onClick={() => setNoti(!noti)} className='flex items-center gap-2 lg:gap-5 cursor-pointer hover:bg-gray-200 w-12 lg:w-50 h-10 pt-2 pl-3 rounded-3xl'>
              <IoIosNotifications className='text-2xl' />
              <p className='hidden lg:block scale-130'>Notification</p>
            </div>

            <div onClick={gotoProfile} className='flex items-center gap-2 lg:gap-5 cursor-pointer hover:bg-gray-200 w-12 lg:w-50 h-10 pt-2 pl-3 rounded-3xl'>
              <IoIosContact className='text-2xl' />
              <p className='hidden lg:block scale-130'>Profile</p>
            </div>

            <div onClick={gotoChat} className='flex items-center gap-2 lg:gap-5 cursor-pointer hover:bg-gray-200 w-12 lg:w-50 h-10 pt-2 pl-3 rounded-3xl'>
              <IoIosContact className='text-2xl' />
              <p className='hidden lg:block scale-130'>Chat</p>
            </div>

            <div onClick={gotoAdmin} className='flex items-center gap-2 lg:gap-5 cursor-pointer hover:bg-gray-200 w-12 lg:w-50 h-10 pt-2 pl-3 rounded-3xl'>
              <CiCircleMore className='text-2xl' />
              <p className='hidden lg:block scale-130'>Admin</p>
            </div>
          </div>

          {/* Logged-in User Info */}
          <div className='flex items-center justify-center lg:ml-5 mb-20 p-3 w-full lg:w-70 bg-gray-100 gap-3 group'>
            <p className='bg-fuchsia-950 text-white h-10 w-10 text-2xl pt-0.5 rounded-3xl text-center'>{fname}</p>
            <div className='hidden lg:block'>
              <p>{authUser.username}</p>
              <p className="font-bold">{authUser.email}</p>
            </div>
            <div className="relative hidden lg:block">
              <Logout />
              <p className='absolute hidden group-hover:block top-6 left-0 text-sm bg-gray-200 p-1 rounded'>Logout</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// src/pages/Homepage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { Header } from "../Header/Header";
import burger from "../image/burger.jpg";
import peeza from "../image/peeza.jpg";
import salad from "../image/salad.jpg";
import pasda from "../image/pasda.jpg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FaChevronDown } from "react-icons/fa";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [sortOrder, setSortOrder] = useState("default");
  const [filterType, setFilterType] = useState("all"); // 👈 veg/non-veg filter
  const [searchTerm, setSearchTerm] = useState(""); // 👈 search

  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  // Fetch products
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/AllProduct/getProduct")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Add to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to add to cart.");
        return;
      }

      const { data } = await axios.post(
        "http://localhost:5000/api/cart/addCart",
        { product: productId, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Added to cart ✅");
      queryClient.invalidateQueries(["cart"]);
    } catch (error) {
      console.error(error);
      alert("Failed to add to cart.");
    }
  };

  // Add to favorites
  const addToFavorite = useMutation({
    mutationFn: async (productId) => {
      const { data } = await axios.post(
        "http://localhost:5000/api/favorite/add",
        { product: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["favorites"]);
      toast.success(data.message || "Added to favorites ❤️");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to add favorite.");
    },
  });

  // ✅ Apply sorting, filter & search
  // ✅ Apply sorting, filter & search
const processedProducts = [...products]
  .filter((item) => {
    if (filterType === "veg") return item.category?.toLowerCase() === "veg";
    if (filterType === "non-veg")
      return item.category?.toLowerCase() === "non-veg";
    return true;
  })
  .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  .sort((a, b) => {
    const priceA = Number(a.price);
    const priceB = Number(b.price);
    if (sortOrder === "lowToHigh") return priceA - priceB;
    if (sortOrder === "highToLow") return priceB - priceA;
    return 0;
  });


  return (
    <div className="font-sans text-gray-800">
      {/* Navbar */}
      <Header />
      <div className="sticky top-16 z-50 flex justify-center  px-4 py-3 ">
        <div className="flex w-full max-w-md">
          <input
            type="text"
            placeholder="Search delicious food"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-3 bg-gray-100 text-gray-800 rounded-l-full w-full focus:outline-none"
          />
          <button className="px-5 py-3 bg-green-700 rounded-r-full hover:bg-green-800 transition">
            <FiSearch size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Video Background */}
        <video
          src="https://b.zmtcdn.com/data/file_assets/2627bbed9d6c068e50d2aadcca11ddbb1743095925.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        ></video>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b via-black/20 to-black/80"></div>

        {/* Centered Hero Content */}
        <section className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 z-10">
          <h2 className="text-3xl md:text-5xl font-bold drop-shadow-lg">
            MOZZO #1 Fast Delivery. Zero Hassle.
          </h2>
          <p className="mt-2 text-base md:text-lg text-gray-200 drop-shadow-md max-w-lg">
            Explore Top Rated Restaurants, Activities And More
          </p>

          {/* Categories */}
          <div className="flex md:gap-6 gap-4 mt-8 overflow-x-auto md:overflow-visible scrollbar-hide w-full max-w-lg justify-center">
            {[
              { name: "Burger", img: burger },
              { name: "Pizza", img: peeza },
              { name: "Salad", img: salad },
              { name: "Pasta", img: pasda },
            ].map((item, idx) => (
              <span
                key={idx}
                className="flex flex-col items-center min-w-[70px] md:min-w-0"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full shadow-md"
                />
                <p className="mt-2 text-sm md:text-base">{item.name}</p>
              </span>
            ))}
          </div>

          {/* Scroll Down Button */}
          <button
            onClick={() =>
              window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
            }
            className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-md shadow-lg border border-white/30 animate-bounce hover:bg-white/30 transition"
          >
            <FaChevronDown className="text-white text-xl" />
          </button>
        </section>
      </div>

      {/* Sticky Search Bar (outside hero) */}
      {/* <div className="sticky top-0 z-50 flex justify-center backdrop-blur-md px-4 py-3 shadow-md">
        <div className="flex w-full max-w-md">
          <input
            type="text"
            placeholder="Search delicious food"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-3 bg-gray-100 text-gray-800 rounded-l-full w-full focus:outline-none"
          />
          <button className="px-5 py-3 bg-green-700 rounded-r-full hover:bg-green-800 transition">
            <FiSearch size={20} />
          </button>
        </div>
      </div> */}

      {/* Most Popular Items */}
      <section className="px-8 py-10">
        {/* Title + Filters */}
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Most Popular Items</h2>

          <div className="flex gap-3">
            {/* Veg / Non-Veg Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All</option>
              <option value="veg">Veg</option>
              <option value="non-veg">Non-Veg</option>
            </select>

            {/* Price Sort */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="default">Sort by</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {processedProducts.slice(0, visibleCount).length > 0 ? (
            processedProducts.slice(0, visibleCount).map((item) => (
              <div
                key={item._id}
                className="relative bg-white shadow-md rounded-2xl overflow-hidden transform transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-55 w-full bg-gray-100">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Heart button */}
                  <button
                    onClick={() => addToFavorite.mutate(item._id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/70 hover:bg-white transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="h-5 w-5 text-gray-600 hover:text-rose-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 21s-7.2-4.74-9.2-7.2A5.4 5.4 0 011.8 8.7C3 5.5 6 4 8.4 5.2c1.1.5 2.1 1.4 3.1 2.5 1-1.1 2-2 3.1-2.5C18 4 21 5.5 22.2 8.7a5.4 5.4 0 01-1 4.9C19.2 16.26 12 21 12 21z"
                      />
                    </svg>
                  </button>

                  {/* Price badge */}
                  <span className="absolute bottom-3 left-3 bg-white/90 px-3 py-1 rounded-full text-sm font-semibold text-orange-600 shadow">
                    ₹{item.price}
                  </span>
                </div>

                <div className="p-4">
                  <p className="font-semibold text-lg truncate">{item.name}</p>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 uppercase">
                    {item.category}
                  </p>

                  <button
                    onClick={() => addToCart(item._id)}
                    className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
                  >
                    Order
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 text-lg mt-10">
              No food found 🍔
            </p>
          )}
        </div>

        {/* Load More button */}
        {visibleCount < processedProducts.length && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setVisibleCount(visibleCount + 9)}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
            >
              Load More
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

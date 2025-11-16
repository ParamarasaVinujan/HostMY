import React, { useEffect, useState } from 'react'
import { FiSearch } from "react-icons/fi";
import { useLocation, useNavigate } from 'react-router-dom';

function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const [keyword,setKeyword]=useState('');

  const searchHandler = (e)=>{
    e.preventDefault();
    navigate(`/search/${keyword}`);
  }

  const clearKeyword =()=>{
    setKeyword("");
  }

  useEffect(()=>{
    if(location.pathname == '/'){
      clearKeyword();
    }
  },[location])
  return (
    <form onSubmit={searchHandler}>
<div className="p-[2px] rounded-full bg-gradient-to-r from-emerald-500 via-orange-500 to-yellow-400 shadow-lg shadow-orange-200/30 hover:bg-emerald-50 hover:text-orange-500 transition transform hover:scale-110 shadow-md">
  <div className="flex items-center bg-white rounded-full px-2 hover:bg-emerald-50 hover:text-orange-500 transition transform hover:scale-108 shadow-md">           
            <input
              type="text"
              value={keyword}
              onChange={(e)=>setKeyword(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 text-sm outline-none rounded-l-full"
            />
            <button className="px-4 py-2 text-gray-500 hover:text-emerald-500 transition">
              <FiSearch size={18} />
            </button>
          </div>
          </div>
    </form>
  )
}

export default Search

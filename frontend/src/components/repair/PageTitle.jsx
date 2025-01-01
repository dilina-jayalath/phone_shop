import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiPlusSm } from "react-icons/hi";

const PageTitle = ({ label, btn, btnTitle, link, btnStyle }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(link);
  };

  return (
    <div className={`flex flex-row items-start items-center justify-between mb-4 p-2`}>
      {/* Title */}
      <p className='text-xl md:text-2xl lg:text-3xl font-bold mr-2'>{label}</p> 
      {/* Conditionally render button */}
      {btn ? (
        <button
          className={`${btnStyle} flex flex-row items-center gap-2 px-4 py-2 md:px-6 md:py-2 rounded-lg text-sm md:text-base`}
          onClick={handleNavigation}
        >
          {/* Icon visible at all sizes */}
          <HiPlusSm className='w-8 h-8'/>
          {/* Hide text on mobile (sm) and show on md and larger */}
          <p className='hidden md:block font-medium'>{btnTitle}</p>
        </button>
      ) : null}
    </div>
  );
};

export default PageTitle;

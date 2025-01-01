import React from "react";

const Badge = ({ text , available }) => {
  return (
<>
{text === "New" && (    
    <div className="bg-primeColor w-[92px] h-[35px] text-white flex justify-center items-center text-base font-semibold hover:bg-black duration-300 cursor-pointer">
      {text} 
    </div>
  )}

  {available == false && (
    <div className="bg-red-500 w-[150px] h-[35px] text-white flex justify-center items-center text-base font-semibold hover:bg-red-800 duration-300 cursor-pointer">
      {"Out Of Stock"}
    </div>
  )}
</>
  );
};

export default Badge;

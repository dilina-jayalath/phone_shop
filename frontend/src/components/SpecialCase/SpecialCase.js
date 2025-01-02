import React from "react";
import { Link } from "react-router-dom";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { MdBook, MdLogin, MdSwitchAccount } from "react-icons/md";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { signOut } from "../../redux/authSlice";
import { resetCart } from "../../redux/orebiSlice";
import { CgLogIn, CgLogOut } from "react-icons/cg";
import { BsPersonBadgeFill, BsPhone } from "react-icons/bs";

const SpecialCase = () => {
  const { isSignedIn, userId } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  

  return (
    <div className="fixed top-52 right-2 z-20 hidden md:flex flex-col gap-2">

    {!userId ? (

      <Link to="/signin">
      <div className="bg-white w-16 h-[70px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center shadow-testShadow overflow-x-hidden group cursor-pointer">
        <div className="flex justify-center items-center">
          <CgLogIn className="text-2xl -translate-x-12 group-hover:translate-x-3 transition-transform duration-200" />

          <CgLogIn className="text-2xl -translate-x-3 group-hover:translate-x-12 transition-transform duration-200" />
        </div>
        <p className="text-xs font-semibold font-titleFont">Login</p>
      </div>
    </Link>


    
    ):(           <>
       <Link to="/orders">
      <div className="bg-white w-16 h-[70px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center shadow-testShadow overflow-x-hidden group cursor-pointer">
        <div className="flex justify-center items-center">
          <MdBook className="text-2xl -translate-x-12 group-hover:translate-x-3 transition-transform duration-200" />

          <MdBook className="text-2xl -translate-x-3 group-hover:translate-x-12 transition-transform duration-200" />
        </div>
        <p className="text-xs font-semibold font-titleFont">Orders</p>
      </div>
    </Link>
    <Link to="/repair">
        <div className="bg-white w-16 h-[70px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center shadow-testShadow overflow-x-hidden group cursor-pointer">
          <div className="flex justify-center items-center">
            <BsPhone className="text-2xl -translate-x-12 group-hover:translate-x-3 transition-transform duration-200" />

            <BsPhone className="text-2xl -translate-x-3 group-hover:translate-x-12 transition-transform duration-200" />
          </div>
          <p className="text-xs font-semibold font-titleFont">Repair </p>
        </div>
      </Link>
    </>)}
      <Link to="/cart">
        <div className="bg-white w-16 h-[70px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center shadow-testShadow overflow-x-hidden group cursor-pointer relative">
          <div className="flex justify-center items-center">
            <RiShoppingCart2Fill className="text-2xl -translate-x-12 group-hover:translate-x-3 transition-transform duration-200" />

            <RiShoppingCart2Fill className="text-2xl -translate-x-3 group-hover:translate-x-12 transition-transform duration-200" />
          </div>
          <p className="text-xs font-semibold font-titleFont">Buy Now</p>
          {/* {products.length > 0 && (
            <p className="absolute top-1 right-2 bg-primeColor text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-semibold">
              {products.length}
            </p>
          )} */}
        </div>
      </Link>
      <Link to="/admin">
        <div className="bg-white w-16 h-[70px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center shadow-testShadow overflow-x-hidden group cursor-pointer relative">
          <div className="flex justify-center items-center">
            <BsPersonBadgeFill className="text-2xl -translate-x-12 group-hover:translate-x-3 transition-transform duration-200" />

            <BsPersonBadgeFill className="text-2xl -translate-x-3 group-hover:translate-x-12 transition-transform duration-200" />
          </div>
          <p className="text-xs font-semibold font-titleFont">Admin</p>
          {/* {products.length > 0 && (
            <p className="absolute top-1 right-2 bg-primeColor text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-semibold">
              {products.length}
            </p>
          )} */}
        </div>
      </Link>


      <div>
      {userId ? (
              <div   onClick={() => { dispatch(signOut()); dispatch(resetCart()); }}>
              <div className="bg-white w-16 h-[70px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center shadow-testShadow overflow-x-hidden group cursor-pointer">
                <div className="flex justify-center items-center">
                  <CgLogOut className="text-2xl -translate-x-12 group-hover:translate-x-3 transition-transform duration-200" />
      
                  <CgLogOut className="text-2xl -translate-x-3 group-hover:translate-x-12 transition-transform duration-200" />
                </div>
                <p className="text-xs font-semibold font-titleFont">Logout</p>
              </div>
            </div>
      ) : (
        <></>
      )}
    </div>
    </div>
  );
};

export default SpecialCase;

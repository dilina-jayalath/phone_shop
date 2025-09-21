import React, { useState, useEffect } from "react";
import { BsSuitHeartFill } from "react-icons/bs";
import { GiReturnArrow } from "react-icons/gi";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineLabelImportant } from "react-icons/md";
import Image from "../../designLayouts/Image";
import Badge from "./Badge";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, clearCartMessage } from "../../../redux/orebiSlice";

const imagePath = "http://localhost/api/products/";


const Product = (props) => {
  const dispatch = useDispatch();
  const cartMessage = useSelector((state) => state.orebi.cartMessage);
  const [showMessage, setShowMessage] = useState(false);

  // Handle cart message display
  useEffect(() => {
    if (cartMessage) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
        dispatch(clearCartMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [cartMessage, dispatch]);
  const id = props.id;
  const idString = (id) => {
    return String(id).toLowerCase().split(" ").join("");
  };
  const rootId = idString(id);

  const navigate = useNavigate();
  const productItem = props;
  
  // Check if product is available and has stock
  const isAvailable = props.availability === "yes" || props.availability === "true" || props.availability === true;
  const hasStock = props.qty && parseInt(props.qty) > 0;
  const inStock = isAvailable && hasStock;
  
  const handleProductDetails = () => {
    navigate(`/product/${rootId}`, {
      state: {
        item: productItem,
      },
    });
  };
  
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: props.id,
        name: props.productName,
        quantity: 1,
        image: props.img,
        badge: props.badge,
        price: props.price,
        colors: props.color,
        availability: props.availability,
        qty: props.qty,
        type: props.type, // Add product type
        maxQty: parseInt(props.qty), // Store max available quantity
      })
    );
  };
  return (
    <div className="w-full relative group">
      {/* Toast Notification */}
      {showMessage && cartMessage && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
          cartMessage.type === 'success' ? 'bg-green-500 text-white' :
          cartMessage.type === 'warning' ? 'bg-yellow-500 text-white' :
          'bg-red-500 text-white'
        }`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {cartMessage.type === 'success' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {cartMessage.type === 'warning' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {cartMessage.type === 'error' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L10 11.414l1.293-1.293a1 1 0 001.414-1.414L9 8.586 7.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{cartMessage.text}</p>
            </div>
            <button
              onClick={() => {
                setShowMessage(false);
                dispatch(clearCartMessage());
              }}
              className="ml-auto -mx-1.5 -my-1.5 text-white hover:text-gray-200 rounded-lg p-1.5 inline-flex h-8 w-8"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-80 max-h-80 relative overflow-y-hidden ">
        <div>
          <Image className="w-full h-full" imgSrc={imagePath+props.img} />
        </div>
        <div className="absolute top-6 left-8">
          {props.badge == "yes" && <Badge text="New" />}
        </div>
        <div className="absolute bottom-1 right-5">
          {props.available == "no" && <Badge available={false} />}
        </div>
        <div className="w-full h-12 absolute bg-white -bottom-[130px] group-hover:bottom-0 duration-700">
          <ul className="w-full h-full flex flex-col items-end justify-center gap-2 font-titleFont px-2 border-l border-r"> 
          
            <li
              onClick={handleProductDetails}
              className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
            >
              View Details
              <span className="text-lg">
                <MdOutlineLabelImportant />
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-80 py-6 flex flex-col gap-1 border-[1px] border-t-0 px-4"  >
        <div className="flex items-center justify-between font-titleFont" onClick={handleProductDetails}>
          <h2 className="text-lg text-primeColor font-bold">
            {props.productName}
          </h2>
          <p className="text-[#767676] text-[14px]">Rs. {props.price}</p>
        </div>
        <div>
          <p className="text-[#767676] text-[14px]">{props.color}</p>
          {inStock ? (
            <p
              onClick={handleAddToCart}
              className="mt-5 radius-[20px] font-normal border-b-gray-200 flex items-center justify-center gap-2 p-1 hover:bg-blue-600 hover:text-white cursor-pointer duration-300"
            >
              Add to Cart
              <span>
                <FaShoppingCart />
              </span>
            </p>
          ) : (
            <p className="mt-5 radius-[20px] font-normal border-b-gray-200 flex items-center justify-center gap-2 p-1 bg-gray-300 text-gray-500 cursor-not-allowed">
              Out of Stock
              <span>
                <FaShoppingCart />
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;

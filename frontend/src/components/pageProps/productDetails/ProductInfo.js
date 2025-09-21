import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";

const ProductInfo = ({ productInfo }) => {
  const dispatch = useDispatch();
  
  // Check if product is available and has stock
  const isAvailable = productInfo.availability === "yes" || productInfo.availability === "true" || productInfo.availability === true;
  const hasStock = productInfo.qty && parseInt(productInfo.qty) > 0;
  const inStock = isAvailable && hasStock;
  
  const handleAddToCart = () => {
    if (!inStock) {
      alert("This product is currently out of stock");
      return;
    }
    
    dispatch(
      addToCart({
        id: productInfo.id,
        name: productInfo.productName,
        quantity: 1,
        image: productInfo.img,
        badge: productInfo.badge,
        price: productInfo.price,
        colors: productInfo.color,
        availability: productInfo.availability,
        qty: productInfo.qty,
        type: productInfo.type, // Add product type
        maxQty: parseInt(productInfo.qty), // Store max available quantity
      })
    );
  };
  
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-4xl font-semibold">{productInfo.productName}</h2>
      <p className="text-xl font-semibold">${productInfo.price}</p>
      <p className="text-base text-gray-600">{productInfo.des}</p>
      <p className="text-sm">Be the first to leave a review.</p>
      <p className="font-medium text-lg">
        <span className="font-normal">Colors:</span> {productInfo.color}
      </p>
      
      {/* Stock Status Display */}
      <div className="flex items-center gap-2">
        <span className="font-medium">Stock Status:</span>
        {inStock ? (
          <span className="text-green-600 font-medium">
            In Stock ({productInfo.qty} available)
          </span>
        ) : (
          <span className="text-red-600 font-medium">Out of Stock</span>
        )}
      </div>
      
      {inStock ? (
        <button
          onClick={handleAddToCart}
          className="w-full py-4 bg-primeColor hover:bg-black duration-300 text-white text-lg font-titleFont"
        >
          Add to Cart
        </button>
      ) : (
        <button
          disabled
          className="w-full py-4 bg-gray-400 text-white text-lg font-titleFont cursor-not-allowed"
        >
          Out of Stock
        </button>
      )}
      <p className="font-normal text-sm">
  <span className="text-base font-medium">Categories:</span> 
  Smartphones, Feature Phones, Refurbished Phones, Smartwatches, Gaming Laptops
  <span className="ml-2"><span className="text-base font-medium">Tags:</span> featured</span>
  <span className="ml-2"><span className="text-base font-medium">SKU:</span> N/A</span>
</p>

    </div>
  );
};

export default ProductInfo;

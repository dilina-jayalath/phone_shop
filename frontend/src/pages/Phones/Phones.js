import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import ShopSideNav from "../../components/pageProps/shopPage/ShopSideNav";
import Product from "../../components/home/Products/Product";
import axios from "axios";


const Phones = () => {

  const [products, setItems] = useState([]);  // Change initial state to an empty array

  useEffect(() => {
    
    const getItemsDB = () => {
      axios
        .get(
          "http://localhost/api/get_product.php/phones"
        )
        .then((res) => {
          console.log(res.data);
          if (res.data.length == null){
            alert("No products available");
            setItems([]);
          }else{
            setItems(res.data);
          }

        })
        .catch((err) => {
          alert(err.message);
        });
    };

    if (products.length === 0){

      getItemsDB();
    }
  }, []);




  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Phone" />
      {/* ================= Products Start here =================== */}
      <div className="w-full h-full flex pb-20 gap-10">
        <div className="w-[20%] lgl:w-[25%] hidden mdl:inline-flex h-full">
          <ShopSideNav />
        </div>
        <div className="w-full lgl:w-[75%]">
        { products.length === 0 ? <h1>No products available</h1> :          
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item) => (
            <Product
            id={item.id}
            img={item.imageName}
            productName={item.productName}
            price={item.price}
            color={item.color}
            badge={item.condition}
            des={item.description}
            available={item.availability}
          />
            ))}
          </div>}
        </div>
      </div>
      {/* ================= Products End here ===================== */}
    </div>
  );
};

export default Phones;

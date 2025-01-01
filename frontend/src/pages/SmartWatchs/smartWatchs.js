import React, { useState } from "react";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import ShopSideNav from "../../components/pageProps/shopPage/ShopSideNav";
import Product from "../../components/home/Products/Product";
import {paginationItems} from "../../constants/index"


const SmartWatchs = () => {



  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Smart Watches" />
      {/* ================= Products Start here =================== */}
      <div className="w-full h-full flex pb-20 gap-10">
        <div className="w-[20%] lgl:w-[25%] hidden mdl:inline-flex h-full">
          <ShopSideNav />
        </div>
        <div className="w-full lgl:w-[75%]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginationItems.map((item) => (
              <Product
                key={item._id}
                _id={item._id}
                img={item.img}
                productName={item.productName}
                price={item.price}
                color={item.color}
                badge={item.badge}
                des={item.des}
                available={item.available}
              />
            ))}
          </div>
        </div>
      </div>
      {/* ================= Products End here ===================== */}
    </div>
  );
};

export default SmartWatchs;

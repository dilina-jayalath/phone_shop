import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";
import axios from "axios";




const Phones = (props) => {

  const [products, setItems] = useState([]);  // Change initial state to an empty array

  useEffect(() => {
    
    const getItemsDB = () => {
      axios
        .get(
          `http://localhost/api/get_product.php/${props.path}`
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

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };
  return (
    <div className="w-full pb-16 p-5">
      <Heading heading={props.name} />
      {products.length < 4 ? <h1></h1> :
      <Slider {...settings}>

            {products.map((item) => (
              <div key={item.id} className="w-full">
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
              </div>
            ))}

      </Slider>
      }
    </div>
  );
};

export default Phones;

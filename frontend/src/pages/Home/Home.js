import React from 'react'
import { Link } from 'react-router-dom'
import Banner from '../../components/home/Banner/Banner'
import BannerBottom from '../../components/home/Banner/BannerBottom'
import Phones from '../../components/home/Items/Items'
import YearProduct from '../../components/home/YearProduct/YearProduct'

function Home() {
  return (
    <>
   
    <Banner />
    <BannerBottom/>
    
    {/* Product Finder CTA Section */}
    <div className="max-w-container mx-auto px-4 py-16">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Not Sure What to Buy?</h2>
        <p className="text-lg mb-6 opacity-90">
          Answer a few simple questions and let us find the perfect product for you!
        </p>
        <Link 
          to="/product-finder"
          className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
        >
          🔍 Find My Perfect Product
        </Link>
      </div>
    </div>
    
    <Phones name={"Smart Phones"} path={'phones'}/>
    <YearProduct/>
    <Phones name={"Smart Watches"} path={'watches'}/>
    <Phones name={"Accessories"} path={'accessories'}/>

    </>
  )
}

export default Home
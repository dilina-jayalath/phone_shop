import React from 'react'
import Banner from '../../components/home/Banner/Banner'
import BannerBottom from '../../components/home/Banner/BannerBottom'
import Phones from '../../components/home/Items/Items'
import YearProduct from '../../components/home/YearProduct/YearProduct'

function Home() {
  return (
    <>
   
    <Banner />
    <BannerBottom/>
    <Phones name={"New Arrival"}/>
    <YearProduct/>
    <Phones name={"Special Offers"}/>
    </>
  )
}

export default Home
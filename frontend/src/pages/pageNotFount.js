import React from 'react'
import Image from '../assets/images/emptyCart.png'

function pageNotFount() {
  return (
    <>
    <div className="contains items-center justify-center flex flex-col p-6">
    <h1>404 PageNotFound</h1>
    <img src={Image}/>
    </div>
    </>
  )
}

export default pageNotFount
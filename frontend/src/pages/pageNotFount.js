import React from 'react'
import Image from '../assets/images/pnf.png'
import { CgSearchFound } from "react-icons/cg";
import { TbError404 } from "react-icons/tb";

function pageNotFount() {
  return (
    <>
    <div className="contains items-center justify-center flex flex-col p-6">
    <img src={Image}  alt="emptyCart" className="w-1/3 h-1/3"/>

    </div>
    </>
  )
}

export default pageNotFount
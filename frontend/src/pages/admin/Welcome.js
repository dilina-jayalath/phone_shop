import React from 'react'
import { motion } from "framer-motion";

function Welcome() {
  return (
    <motion.div
    initial={{ y: 30, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.4 }}
    className="flex flex-col mdl:flex-row justify-center items-center gap-4 pb-20"
  >
    <div className='flex justify-end items-center text-6xl font-bold p-48'>Welcome To Admin Dashboard</div>
    </motion.div>
  )
}

export default Welcome
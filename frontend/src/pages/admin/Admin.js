import React from 'react'
import Content from '../../components/admin/Content'
import { Outlet } from 'react-router-dom'

function Admin() {
  return (
    <div className='flex'>
        <Content/>
        <Outlet className="container mx-auto"/>
    </div>
  )
}

export default Admin
import React from 'react'


export const AdminHeader = () => {
  return (
    <>
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-orange-600">MOZZU</h1>
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <a href="/" className="hover:text-orange-600">Home</a>
          <a href="/admin/orders" className="hover:text-orange-600">Orders</a>
          <a href="/admin/dashboard" className="hover:text-orange-600">Dashboard</a>
        </nav>
       
      </header>

    </>
  )
}

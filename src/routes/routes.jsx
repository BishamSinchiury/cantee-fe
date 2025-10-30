import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from '@/pages/Login'
import FoodList from '@/pages/FoodList'
import AvailableToday from '@/pages/AvailableToday'

const AppRoutes = () => {
  return (
    <Routes>
        <Route path='login' element={<Login />}/>
         <Route path='/' element={<FoodList />}/>
         <Route path='today' element={<AvailableToday />}/>
         <Route path='/' element={<FoodList />}/>

    </Routes>
  )
}

export default AppRoutes;
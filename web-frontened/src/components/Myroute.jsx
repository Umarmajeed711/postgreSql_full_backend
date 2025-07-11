import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Signup } from '../pages/signup'
import { Login } from '../pages/login'
import Home from '../pages/Home'
import { GlobalContext } from '../context/Context'
import Category from './Category'
import Products from '../pages/Products'


const Myroute = () => {


  let {state , dispatch} = useContext(GlobalContext)


  return (

   <div>
    {
     (state?.isLogin == true) ?
    
    <Routes>
        <Route path='/home' index  element={<Home/>}></Route>
        
         <Route path='/Category' element={<Category/>}></Route>
    {/* <Route path='/AddProduct' element={<AddProduct/>}></Route> */}
    <Route path='/Product' element={<Products/>}></Route>
    <Route path="*" element={<Navigate to="/home" />}></Route>
    </Routes>
    
   
     : (state?.isLogin == false) ?
    <Routes>
    <Route path='/signup' element={<Signup/>}></Route>
    <Route path='/login' element={<Login/>}></Route>
     {/* <Route path='/Category' element={<Category/>}></Route> */}
    {/* <Route path='/AddProduct' element={<AddProduct/>}></Route> */}
    {/* <Route path='/Product' element={<Products/>}></Route> */} 
    <Route path="*" element={<Navigate to="/login" />}></Route>
    </Routes>
     : 
     <div className='flex justify-center items-center main'>
      <div className='loading'></div>

     </div>
    }

</div>

  )
}

export default Myroute
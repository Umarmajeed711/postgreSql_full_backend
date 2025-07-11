import React, { useState } from 'react';
import { useContext } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdOutlineClose } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../context/Context';
import api from './api';

const Navbar = () => {

  let {state,dispatch} = useContext(GlobalContext)

    const [show, setShow] = useState(false);

  const showSideBar = () => {
    setShow(!show);
    console.log("show side bar");
  };


  const logout = async () => {
        try{
          let user_logout = api.get("/logout")
          console.log("user logout",user_logout);
          
        }
        catch(error){
          console.log(error);
          
        }
  }


    return(

        <div className='top-0 sticky shadow-md  h-20   nav-bar w-full'>
            <header className=" mx-auto px-8 py-4 flex justify-between items-center">
              {/* max-w-7xl */}
            
                <div className="text-3xl md:text-4xl  lg:text-[50px]  logo">
         Exclusive 
        </div>


               <div className="md:hidden">
          <button onClick={showSideBar}>
            {show ? <MdOutlineClose /> : <GiHamburgerMenu />}
          </button>
        </div>

        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium ">
          <li className="link text-xl ">
            <Link to="/">Home</Link>
          </li>
          <li className="link text-xl">
            <Link to="/">Contact</Link>
          </li>
          <li className="link text-xl">
          
            <Link to="/">About</Link>
          </li>
          <li className="link text-xl">
            
            <Link to="/">SignUp</Link>
          </li>
           <li className="link text-xl">
            
            <Link to="/Category">Category</Link>
          </li>
           <li className="link text-xl">
            
            <Link to="/Product">Products</Link>
          </li>
          {
            (state?.isLogin) ? <button onClick={logout}>logout</button>:null
          }
         
          
        </ul>

            </header>

            {show ? (
        <nav className=" md:hidden nav-bar px-4 pt-2 pb-4 shadow-md  ">
          {/* sideLinks */}
          <ul className="space-y-3 text-gray-700 font-medium">
            <li className="link text-sm sm:text-xl" onClick={showSideBar}>
              <Link to="/">Home</Link>
            </li>
            <li className="link text-sm sm:text-xl" onClick={showSideBar}>
              <Link to="/">Contact</Link>
            </li>
            <li className="link text-sm sm:text-xl" onClick={showSideBar}>
              <Link to="/">About</Link>
            </li>
            <li className="link text-sm sm:text-xl" onClick={showSideBar}>
              <Link to="/">Sign Up</Link>
            </li>
          </ul>
        </nav>
      ) : null}


            
        </div>
    )
}
export default Navbar;
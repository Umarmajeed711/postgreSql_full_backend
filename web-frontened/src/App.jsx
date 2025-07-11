import './App.css';
import Myroute from './components/Myroute';
import { useContext,useEffect } from 'react';
import { GlobalContext } from './context/Context';
import axios from 'axios';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { Signup } from './pages/signup';
import { Login } from './pages/login';
import Category from './components/Category';
import AddProduct from './components/AddProduct';
import Products from './pages/Products';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NewArrivals from './components/NewArrivals';
import api from './components/api';

function App() {
 

 // data store in a context api
 let {state , dispatch} = useContext(GlobalContext);





// important

//   useEffect(() => {
//       // Add a request interceptor
//       axios.interceptors.request.use(function (config) {
//          // Do something before request is sent

//          config.withCredentials = true

//          return config;
//       }, function (error) {
//          // Do something with request error
//          return Promise.reject(error);
//       });

//       // Add a response interceptor
//       axios.interceptors.response.use(function (response) {
//          // Any status code that lie within the range of 2xx cause this function to trigger
//          // Do something with response data
//          return response;
//       }, function (error) {

//          if (error.response.status === 401) {
//             dispatch({
//                type: 'USER_LOGOUT'
//             });
//          }
//          // Any status codes that falls outside the range of 2xx cause this function to trigger
//          // Do something with response error
//          return Promise.reject(error);
//       });
//    }, [])

//  const getUserData = async() => {
//       try {
//         let res = await api.get('/profile');
//         dispatch({type: "USER_LOGIN", user: res.data?.user})
        
//       } catch (error) {
//         dispatch({type: "USER_LOGOUT"})
//       }
//     }
//     getUserData();


const checkLogin = async () => {

  try{
    let response = await api.get(`/user-detail`)
    
     dispatch({ type: "USER_LOGIN", payload: response.data.user });
    console.log(response);
    

 
    
    
    
  }
  catch(error){
      dispatch({type: "USER_LOGOUT"})

    console.log(error);
    
  }

}

useEffect(() => {
checkLogin()

  

},[])
  




  return (
    <div >

      <Navbar/>
      <Myroute/>
      {/* <NewArrivals/> */}
      {/* <Footer/> */}


      

    
    </div>
  );
}

export default App;
 
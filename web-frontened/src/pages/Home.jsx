import React, { useContext } from 'react'
import '../App.css'
import { Link } from 'react-router'
import { GlobalContext } from "../context/Context";
import api from '../components/api';
import { useState } from 'react';

const Home = () => {
  let { state, dispatch } = useContext(GlobalContext);

  const [file,setFile] = useState()
 
  const uploadImage = async (e) =>{
    e.preventDefault(false)

    try{
      let result =  await api.post("/upload")
      console.log(result);
      

    }
    catch(error){

    }

  }
  return (
    <div className='flex justify-center items-center main'>
        
        <div className="flex  flex-col items-center" >

       <p className='text-4xl text-[#00246b] drop-shadow-2xl'> WELCOME {state?.user.name} </p>

       <p><Link to={'/Profile'}  className="text-blue-400 hover:text-blue-500">see your profile</Link></p>

       {/* <form onSubmit={uploadImage}>


        <input type="file"  name='files' value={file} onChange={(e) => {setFile(e.target.files)}}/>
        <button>submit</button>


       </form> */}
       
  
       
      </div>
     
            
    </div>
    
  )
}

export default Home
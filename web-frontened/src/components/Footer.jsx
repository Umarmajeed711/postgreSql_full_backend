import React from 'react'

const Footer = () => {
  return (
    <footer className=' bg-black text-white' >
        <div className='mx-5 my-5 lg:mx-10  lg:my-8 '>

        <div className='flex justify-between gap-5 lg:gap-10 p-5 lg:p-10 flex-wrap'>

            {/* Exclusive */}
            

            <div className='flex flex-col gap-4 '>
                <p className='text-xl md:text-2xl font-semibold'>Exlusive</p>
                <p className='text-xl '>Subscribe</p>
                <div>
                    <p className='text-[16px] font-light'>Get 10% of your first order</p>
                    <form className='flex relative mt-2'>

                        <input type="email" required name='email' placeholder='Enter your email' className='bg-transparent border border-white rounded p-1 flex justify-center items-center text-gray-300' />
                        <button className='absolute top-0 right-0 bottom-0 px-2'>X</button>


                    </form>
                    

                </div>
            </div>


            {/* Support */}

            <div className='flex gap-5 flex-col'>
                <p className='text-xl '>Support</p>
                <div className='flex flex-col gap-2 font-light'>
                    <p>1111-/ DHA Head Office Karachi,Pakistan</p>
                    <a href="mailto:abc@gmail.com">exclusive@gmail.com</a>
                    <a href="tell:111222333">+111 222 333</a>
                </div>
            </div>
    

             {/* Accounts */}

            <div className='flex gap-5 flex-col'>
                <p className='text-xl'>Accounts</p>

                <ul className='flex flex-col gap-2 font-light'>
                    <li><a href="/">My Account</a></li>
                    <li><a href="/">Register/login</a></li>
                    <li><a href="/">Cart</a></li>
                    <li><a href="/">Whislist</a></li>
                    <li><a href="/">Shop</a></li>
                    
                </ul>
            </div>

            {/* Quick Link */}

            <div className='flex gap-5 flex-col'>
                <p className='text-xl'>Quick Link</p>

                <ul className='flex flex-col gap-2 font-light'>
                    <li><a href="/">Privacy Policy</a></li>
                    <li><a href="/">Terms of Use</a></li>
                    <li><a href="/">FAQ</a></li>
                    <li><a href="/">Contact</a></li>
                    
                </ul>
            </div>

            {/* Follow US */}

             <div className='flex gap-5 flex-col'>
                <p className='text-xl'>Follow Us</p>

                <ul className='flex flex-col gap-2 font-light'>
                    <li><a href="/">Facebook</a></li>
                    <li><a href="/">Instagram</a></li>
                    <li><a href="/">Twitter</a></li>
                </ul>
            </div>


        </div>

        </div>

    </footer>
  )
}

export default Footer
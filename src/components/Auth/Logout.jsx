import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, clear } from 'services/LocalStorage'

const Logout = () => {
    const navigate = useNavigate();
    const userName = getUser()
    const handleLogout = () => {
        clear();
        navigate('/login')
    }
    return (

        <div className="flex items-center">
            <div className="text-white font-dinPro mr-3 ">{userName}</div>

            <div className='relative group'>

                <img
                    className="h-[50px]"
                    loading="lazy"
                    src={`${process.env.PUBLIC_URL}/images/user.png`}
                    alt="Hygge Logo"
                />
                <div className="hidden absolute right-0 bg-[#f9f9f9] min-w-[80px] shadow-md p-3 z-10 cursor-pointer group-hover:block">
                    <button className='text-[#265B65] w-[80px] h-[20px]' onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

        </div>




    )
}

export default Logout
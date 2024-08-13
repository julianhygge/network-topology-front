import React, { forwardRef, useEffect } from 'react';
import './Login.css';

const Otp = forwardRef((props, ref) => {
    const { register, handleSubmit, onOtpSubmit, isLoading } = props;
    // useEffect(() => {
    //     console.log(ref);
    //     ref[0].current.focus();
        
     
    // }, []);
    return (

        <div className='login_form w-[30vw] h-[70vh] col-start-4 flex flex-col justify-evenly items-center bg-[#265B65] rounded-[2vw]'>
            <img
                loading="lazy"
                src={`${process.env.PUBLIC_URL}/images/HyggeLogo.png`}
                alt="Hygge Logo"
                className='w-[5vw] mb-[-1vh]'

            />
            <form onSubmit={handleSubmit(onOtpSubmit)}>
                <h4 className='text-white'>Enter OTP</h4>
                <label>Enter 6-digit verification code sent to your mobile number.</label>
                <div className='w-full'>

                    {Array.from({ length: 6 }).map((_, i) => {

                        return (
                            <input
                                key={i}
                                ref={ref[i]}
                                type="text"
                                id={`otp${i + 1}`}
                                name={`otp${i + 1}`}
                                className='w-[14%] h-[55px] rounded-[14px] text-center border-none mt-[1vh] text-[25px] mr-2'
                                maxLength="1"
                                {...register(`otp${i + 1}`, { required: true })}
                            //   onKeyUp={(e) => onOtpInputKeyUp(e, isLast ? -1 : i + 1, isFirst ? -1 : i - 1)}
                            />
                        );
                    })}

                    <button type="submit" disabled={isLoading} className="mt-20 text-[1.3vw] border-none w-[95%] h-[6vh] bg-[#F4B840] font-[400] rounded-[0.8vw] text-[#265B65] mb-[40px]">
                        Login
                    </button>
                </div>

            </form>

        </div>

    )
});

export default Otp;
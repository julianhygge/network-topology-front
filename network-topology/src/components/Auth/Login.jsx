import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import OtpInput from "react-otp-input";

import { requestOtp, verifyOtp } from "services/Auth";
import {
  setToken,
  setUser,
  setRole,
  setPhoneNumber,
} from "services/LocalStorage";
import { HTTP_STATUS_CODES } from "services/Config";
import "./Login.css";

const Login = () => {
  const [otpRequested, setOtpRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [otpError, setOtpError] = useState(false);
  const [maxAttemptsReached, setMaxAttemptsReached] = useState(false);
  const [unexpectedError, setUnexpectedError] = useState(false);
  const [stateToken, setStateToken] = useState("");
  const [otp, setOtp] = useState("");
  const [phoneNumb, setPhoneNumb] = useState('');

  const methods = useForm({
    defaultValues: {
      phone_number: "",
    },
  });

  const setRequestOtpState = () => {
    setIsLoading(false);
    setOtpRequested(true);
    setOtp("");
  };

  const handleInput = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 10) {
      setPhoneNumb(numericValue)
    }

  }

  const setRequestPhoneState = () => {
    setMaxAttemptsReached(false);
    setIsLoading(false);
    setOtpRequested(false);
    setOtpError(false);
    setUnexpectedError(false);
    setOtp("");
    reset({ phone_number: "" });
  };

  const processError = (error) => {
    setRequestPhoneState();
    if (error.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      setIsAuthorized(false);
    } else {
      setUnexpectedError(true);
    }
  };

  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;

  const navigate = useNavigate();
  const HandleClick = () => {
    navigate("/");
  };

  const onRequestOtp = async () => {
    setIsLoading(true);
    // const phoneNumber = data.phone_number;

    try {
      const res = await requestOtp(phoneNumb);
      if (res.status === "RESTRICTED") {
        setRequestPhoneState();
        setMaxAttemptsReached(true);
        return;
      }
      setRequestOtpState();
      setStateToken(res.state_token);
      setPhoneNumber(phoneNumb);
    } catch (error) {
      processError(error);
    }
  };

  const onOtpSubmit = async () => {
    setIsLoading(true);

    try {
      const res = await verifyOtp(stateToken, otp);

      if (res.status === "SUCCESS") {
        setToken(res.session_token);
        setUser(res.name);
        setRole(res.role);
        navigate("/");
        return;
      }
      if (res.status === "OTP_RESTRICTED") {
        setRequestPhoneState();
        setMaxAttemptsReached(true);
        return;
      }
      if (res.status === "OTP_FAILED") {
        setRequestOtpState();
        setOtpError(true);
        return;
      }
      setRequestOtpState();
      setOtpError(true);
    } catch (error) {
      processError(error);
    }
  };

  return (
    <>
      {/* Header */}
      <div>
        <header className="flex justify-between items-center w-full gap-10 px-9 py-4 text-xl font-medium bg-navColor">
          <img
            loading="lazy"
            src={`${process.env.PUBLIC_URL}/images/HyggeLogo.png`}
            alt="Hygge Logo"
            className="shrink-0 w-[50px] cursor-pointer"
            onClick={HandleClick}
          />
          <h1 className="flex-auto my-auto max-md:max-w-full text-white font-dinPro">
            Welcome to Hygge Power Trading Simulator
          </h1>
        </header>
      </div>

      {/* Login */}
      {!otpRequested && (
        <div className="grid grid-cols-[1fr_auto_2fr_auto_1fr] items-center h-[90vh] bg-white">
          <img
            loading="lazy"
            src={`${process.env.PUBLIC_URL}/images/HyggeTextLogo.png`}
            alt="Hygge Logo"
            className="ml-[15vw] w-[45vh]"
          />
          <div className="login_form w-[30vw] h-[70vh] col-start-4 flex flex-col justify-evenly items-center bg-[#265B65] rounded-[2vw]">
            <img
              className="w-[5vw] mb-[-1vh]"
              loading="lazy"
              src={`${process.env.PUBLIC_URL}/images/HyggeLogo.png`}
              alt="Hygge Logo"
            />

            <form onSubmit={onRequestOtp} className="w-4/5 h-fit" noValidate>
              <h4 className="mb-[75px] font-medium text-[1.1vw] text-center text-white">
                Enter the Mobile Number you have registered with us for this
                platform
              </h4>
              <label className="flex-grow text-[16px] font-medium ml-[10px] text-white">
                Enter Mobile Number
              </label>
              <input
                type="text"
                value={phoneNumb}
                onChange={handleInput}
                maxLength={10}
                className={`text-[30px] w-full h-[7vh] font-medium py-[1vh] px-[1vw] tracking-[8px] rounded-[0.8vw] mb-[-4vh] mt-[5px] text-center ${
                  errors.phone_number && "border-red-500"
                }`}
                name="phone_number"
                placeholder=""
                // {...register("phone_number", {
                //   required: "Phone Number is required",
                //   pattern: {
                //     value: /^[0-9]{10}$/,
                //     message: "Invalid phone number format",
                //   },
                //   maxLength: {
                //     value: 10,
                //     message: "Phone Number cannot exceed 10 digits",
                //   },
                  
                // })}
              />
               
            </form>
            {errors.phone_number && (
                <span className="text-red-500 text-2xl">
                  {errors.phone_number.message}
                </span>
              )}
            <button
              type="submit"
              disabled={isLoading || phoneNumb.length<10}
              className="text-[1.3vw] border-none w-[80%] h-[6vh] bg-[#F4B840] font-normal rounded-[0.8vw] text-[#265B65] mb-[40px]"
              onClick={onRequestOtp}
            >
              Next
            </button>
            {!isAuthorized && (
              <label className="text-orange-500 text-[1.5vw]">
                Phone number is not authorized
              </label>
            )}
            {maxAttemptsReached && (
              <label className="text-orange-500 text-[1.5vw]">
                Reached max verification attempts
              </label>
            )}
            {unexpectedError && (
              <label className="text-orange-500 text-[1.5vw]">
                Unexpected error please try later
              </label>
            )}
          </div>
        </div>
      )}

      {/* OTP Parts */}
      {otpRequested && isAuthorized && (
        <div className="grid grid-cols-[1fr_auto_2fr_auto_1fr] items-center h-[90vh] bg-white">
          <img
            loading="lazy"
            src={`${process.env.PUBLIC_URL}/images/HyggeTextLogo.png`}
            alt="Hygge Logo"
            className="ml-[15vw] w-[45vh]"
          />
          <div className="login_form w-[31vw] h-[70vh] col-start-4 flex flex-col justify-evenly items-center bg-[#265B65] rounded-[2vw]">
            <img
              loading="lazy"
              src={`${process.env.PUBLIC_URL}/images/HyggeLogo.png`}
              alt="Hygge Logo"
              className="w-[5vw] mb-[-1vh]"
            />
            <form onSubmit={handleSubmit(onOtpSubmit)}>
              <h4 className="text-white mb-3">Enter OTP</h4>
              <label>
                Enter the 6-digit verification code sent to your mobile number.
              </label>
              <div className="w-full flex justify-center mt-4">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  isInputNum
                  shouldAutoFocus
                  renderInput={(props) => <input {...props} />}
                  inputStyle={{
                    width: "14%",
                    height: "55px",
                    fontSize: "25px",
                    borderRadius: "14px",
                    border: "none",
                    marginRight: "8px",
                    textAlign: "center",
                  }}
                  containerStyle={{
                    justifyContent: "space-between",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-20 text-[1.3vw] border-none w-[95%] h-[6vh] bg-[#F4B840] font-[400] rounded-[0.8vw] text-[#265B65] mb-[40px]"
              >
                Login
              </button>

              {otpError && (
                <label className="text-orange-500 text-[1.5vw]">
                  Please enter a valid OTP
                </label>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;

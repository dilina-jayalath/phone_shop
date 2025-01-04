import React, { useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { Link, Navigate } from "react-router-dom";
import { logoLight } from "../../assets/images";
import { useDispatch } from "react-redux";
import { signIn } from "../../redux/authSlice";
import axios from 'axios';

const SignIn = () => {

  const dispatch = useDispatch();
  // ============= Initial State Start here =============
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // ============= Initial State End here ===============
  // ============= Error Msg Start here =================
  const [errEmail, setErrEmail] = useState("");
  const [errPassword, setErrPassword] = useState("");

  // ============= Error Msg End here ===================
  const [successMsg, setSuccessMsg] = useState("");
  // ============= Event Handler Start here =============


  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };
  // ============= Event Handler End here ===============
 
  const handleSignUp = async (e) => {
    e.preventDefault();
  
    if (!email) {
      setErrEmail("Enter your email");
    }
  
    if (!password) {
      setErrPassword("Create a password");
    }
  
    // Proceed if both email and password are present
    if (email && password) {
      try {
        const response = await axios.post("http://localhost/api/user.php/signin", { email, password });
  
        if (response.data) {
          const { message, token } = response.data;
  
          // Display success message
          console.log(message);
          message === "Login successful." ?  alert(`Success: ${message}`) || setSuccessMsg(`Success: ${message}`) :  alert(`please Login again: ${message}`);

  
          // Dispatch sign-in action if token exists
          if (token) {
            dispatch(signIn(email));
          }
  
          // Clear form fields
          setEmail("");
          setPassword("");
        }
      } catch (error) {
        // Handle errors
        if (error.response) {
          // Backend returned an error
          alert(`Error: ${error.response.data.message || "Something went wrong."}`);
          console.error("Backend error:", error.response.data);
        } else if (error.request) {
          // No response from the server
          alert("Error: No response from the server. Please try again later.");
          console.error("No response:", error.request);
        } else {
          // Other errors
          alert(`Error: ${error.message}`);
          console.error("Error:", error.message);
        }
      }
    }
  };
  


  return (
    <div className="w-full h-screen flex items-center justify-center">
  
      <div className="w-full lgl:w-1/4 h-full">
        {successMsg ? (
          <div className="w-full lgl:w-[500px] h-full flex flex-col justify-center">
            <p className="w-full px-4 py-10 text-green-500 font-medium font-titleFont">
              {successMsg}
            </p>
            <Link to="/">
              <button
                className="w-full h-10 bg-primeColor text-gray-200 rounded-md text-base font-titleFont font-semibold 
            tracking-wide hover:bg-black hover:text-white duration-300"
              >
                HOME
              </button>
            </Link>
          </div>
        ) : (
          <form className="w-full lgl:w-[450px] h-screen flex items-center justify-center">
            <div className="px-6 py-4 w-full h-[90%] flex flex-col justify-center overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
              <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-3xl mdl:text-4xl mb-4">
                Sign in
              </h1>
              <div className="flex flex-col gap-3">
                {/* Email */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Work Email
                  </p>
                  <input
                    onChange={handleEmail}
                    value={email}
                    name="email"
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="email"
                    placeholder="john@workemail.com"
                  />
                  {errEmail && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errEmail}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Password
                  </p>
                  <input
                    onChange={handlePassword}
                    value={password}
                    name="password"
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="password"
                    placeholder="Create password"
                  />
                  {errPassword && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errPassword}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleSignUp}
                  className="bg-primeColor hover:bg-black text-gray-200 hover:text-white cursor-pointer w-full text-base font-medium h-10 rounded-md  duration-300"
                >
                  Sign In
                </button>
                <p className="text-sm text-center font-titleFont font-medium">
                  Don't have an Account?{" "}
                  <Link to="/signup">
                    <span className="hover:text-blue-600 duration-300">
                      Sign up
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignIn;

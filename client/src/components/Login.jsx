import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Login Component
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const emailOrUsernameRef = useRef();
  const passwordRef = useRef();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const loginData = {
      usernameOrEmail: emailOrUsernameRef.current.value,
      password: passwordRef.current.value,
    };
    
    axios
      .post("http://localhost:3000/api/v1/auth/sign-in", loginData)
      .then((response) => {
        const publicKey = response.data.publicKey;
        localStorage.setItem("signedIn", publicKey);
        login();
        navigate("/home");
      })
      .catch((err) => {
        console.error("Login failed:", err.response?.data || err.message);
      });
  };

  return (
    <FormLayout title="Login">
      <form className="space-y-4" onSubmit={handleLogin}>
        <InputField
          label="Username/Email"
          id="usernameOrEmail"
          type="text"
          placeholder="Enter your username/email"
          inputRef={emailOrUsernameRef}
        />
        <PasswordField
          label="Password"
          id="password"
          inputRef={passwordRef}
          showPassword={showPassword}
          toggleShowPassword={() => setShowPassword(!showPassword)}
        />
        <SubmitButton label="Login" />
      </form>
      <OptionalLink href="#" text="Forgot your password?" />
      <AccountAction text="Don't have an account?" actionText="Sign up" onClick={() => navigate("/signup")} />
    </FormLayout>
  );
};

// Signup Component
const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    const signupData = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    axios
      .post("http://localhost:3000/api/v1/auth/sign-up", signupData)
      .then((response) => {
        const publicKey = response.data.publicKey;
        localStorage.setItem("signedIn", publicKey);
        login();
        navigate("/home");
      })
      .catch((err) => {
        console.error("Signup failed:", err.response?.data || err.message);
      });
  };

  return (
    <FormLayout title="Sign Up">
      <form className="space-y-4" onSubmit={handleSignup}>
        <InputField
          label="Username"
          id="username"
          type="text"
          placeholder="Enter your username"
          inputRef={usernameRef}
        />
        <InputField label="Email" id="email" type="email" placeholder="Enter your email" inputRef={emailRef} />
        <PasswordField
          label="Password"
          id="password"
          inputRef={passwordRef}
          showPassword={showPassword}
          toggleShowPassword={() => setShowPassword(!showPassword)}
        />
        <SubmitButton label="Sign Up" />
      </form>
      <OptionalLink href="#" text="Need help?" />
      <AccountAction text="Already have an account?" actionText="Login" onClick={() => navigate("/login")} />
    </FormLayout>
  );
};

// Shared Components
const FormLayout = ({ title, children }) => (
  <div className="absolute top-[50%] translate-x-[-50%] left-[50%] translate-y-[-50%] w-full max-w-md p-8 bg-emerald-50/40 dark:bg-emerald-900/30 rounded-lg shadow-2xl shadow-emerald-700/50 dark:shadow-emerald-500/50 outline outline-[1.5px] outline-lime-500 dark:outline-emerald-700 text-emerald-900 dark:text-lime-300">
    <h2 className="text-2xl font-semibold mb-6 text-center">{title}</h2>
    {children}
  </div>
);

const InputField = ({ label, id, type, placeholder, inputRef }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      ref={inputRef}
      className="w-full px-4 py-2 bg-lime-100 dark:bg-emerald-800 border border-emerald-300 dark:border-lime-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-lime-500 text-emerald-900 dark:text-lime-300"
      placeholder={placeholder}
    />
  </div>
);

const PasswordField = ({ label, id, showPassword, toggleShowPassword, inputRef }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium mb-1">
      {label}
    </label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        id={id}
        ref={inputRef}
        className="w-full px-4 py-2 bg-lime-100 dark:bg-emerald-800 border border-emerald-300 dark:border-lime-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-lime-500 text-emerald-900 dark:text-lime-300"
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
      <button
        type="button"
        onClick={toggleShowPassword}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-emerald-700 dark:text-lime-300"
      >
        {showPassword ? "Hide" : "Show"}
      </button>
    </div>
  </div>
);

const SubmitButton = ({ label }) => (
  <div>
    <button
      type="submit"
      className="w-full py-2 px-4 bg-emerald-400 dark:bg-lime-500 text-white dark:text-emerald-900 font-medium rounded-md hover:bg-emerald-500 dark:hover:bg-lime-400 transition-all"
    >
      {label}
    </button>
  </div>
);

const OptionalLink = ({ href, text }) => (
  <div className="mt-4 text-center">
    <a href={href} className="text-sm text-emerald-600 dark:text-lime-400 hover:underline">
      {text}
    </a>
  </div>
);

const AccountAction = ({ text, actionText, onClick }) => (
  <div className="mt-4 text-center">
    <p className="text-sm text-emerald-700 dark:text-lime-400">
      {text}
      <span
        onClick={onClick}
        className="cursor-pointer font-medium text-emerald-600 dark:text-lime-300 hover:underline ml-1"
      >
        {actionText}
      </span>
    </p>
  </div>
);

export { Login, Signup };

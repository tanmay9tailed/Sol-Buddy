import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isLoggedIn } = useAuth();

  const navbarRef = useRef(null);
  useEffect(() => {
    if (navbarRef.current) {
      gsap.to(navbarRef.current, {
        opacity: 1,
        y: 100,
        duration: 2,
        ease: "elastic.out",
      });
    }
  }, []);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      localStorage.removeItem("signedIn");
      logout();
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav
      ref={navbarRef}
      className="fixed top-[-100px] left-0 right-0 flex items-center justify-between px-6 py-4 bg-emerald-400 dark:bg-emerald-900 shadow-md z-10"
    >
      <a href="/" className="text-3xl font-extrabold font-sans text-emerald-950 dark:text-lime-300">
        SolBuddy
      </a>
      <div>
        <button
          onClick={handleLoginLogout}
          className="py-2 px-4 bg-emerald-800 text-emerald-600 dark:bg-lime-500 dark:text-emerald-900 font-medium rounded-md hover:bg-emerald-950 dark:hover:bg-lime-400 transition-all"
        >
          {isLoggedIn ? "Logout" : "Login/Signup"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

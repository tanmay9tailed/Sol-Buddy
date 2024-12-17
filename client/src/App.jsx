import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const { pathname } = useLocation();

  const navigate = useNavigate()

  useEffect(() => {
    if (pathname === "/") {
      gsap.to("#mainTitle", {
        delay: 1,
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.to("#subTitle", {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 1.3,
        ease: "power3.out",
      });

      gsap.to("#productReveal", {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 1.6,
        ease: "power3.out",
      });

      gsap.to("#features", {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 1.9,
        ease: "power3.out",
      });

      gsap.to("#features > div", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        delay: 2,
        ease: "power3.out",
      });

      gsap.to("#scrollTriggerSection", {
        scrollTrigger: {
          trigger: "#scrollTriggerSection",
          start: "top 60%",
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      });
    }
  }, [pathname]);

  const handleStart = () => {
    const token  = localStorage.getItem("signedIn");
    if(token){
      navigate("/home")
    }else{
      alert("First signup...")
      navigate("/signup")
    }
  }

  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-bl from-lime-100 to-emerald-300 text-emerald-900 dark:bg-gradient-to-bl dark:from-lime-900 dark:to-emerald-950 dark:text-lime-300 pt-20">
        <Navbar />
        {pathname === "/" ? (
          <>
            <div className="h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
              {/* Hero Section */}
              <div className="text-center space-y-8 px-4">
                <h1 className="text-4xl md:text-6xl font-bold opacity-0 translate-y-10" id="mainTitle">
                  Tired of Traditional Telegram Bots?
                </h1>
                <p className="text-xl md:text-2xl opacity-0 translate-y-10" id="subTitle">
                  Let&apos;s explore something revolutionary...
                </p>
              </div>

              {/* Product Reveal Section */}
              <div className="mt-32 text-center opacity-0 translate-y-10" id="productReveal">
                <div className="relative">
                  <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-500 to-lime-500 dark:from-emerald-300 dark:to-lime-300 bg-clip-text text-transparent">
                    Meet SolBuddy
                  </h2>
                  <p className="mt-4 text-2xl md:text-3xl">Your Smart Companion on Solana</p>
                </div>
              </div>

              {/* Features Section */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 px-4 opacity-0 translate-y-10" id="features">
                <div className="p-6 rounded-xl bg-emerald-50/30 dark:bg-emerald-900/30 backdrop-blur-sm opacity-0 translate-y-10">
                  <h3 className="text-xl font-bold mb-2">Easy to Use</h3>
                  <p>You don't need to know anything about Solana</p>
                </div>
                <div className="p-6 rounded-xl bg-emerald-50/30 dark:bg-emerald-900/30 backdrop-blur-sm opacity-0 translate-y-10">
                  <h3 className="text-xl font-bold mb-2">No Code Required</h3>
                  <p>You can use it without writing any code</p>
                </div>
                <div className="p-6 rounded-xl bg-emerald-50/30 dark:bg-emerald-900/30 backdrop-blur-sm opacity-0 translate-y-10">
                  <h3 className="text-xl font-bold mb-2">Secure & Fast</h3>
                  <p>Built on Solana for lightning-fast transactions</p>
                </div>
                <div className="p-6 rounded-xl bg-emerald-50/30 dark:bg-emerald-900/30 backdrop-blur-sm opacity-0 translate-y-10">
                  <h3 className="text-xl font-bold mb-2">Private Key Protection</h3>
                  <p>No need to expose your private keys</p>
                </div>
                <div className="p-6 rounded-xl bg-emerald-50/30 dark:bg-emerald-900/30 backdrop-blur-sm opacity-0 translate-y-10">
                  <h3 className="text-xl font-bold mb-2">Automated Trading</h3>
                  <p>Set up automated trading strategies with ease</p>
                </div>
                <div className="p-6 rounded-xl bg-emerald-50/30 dark:bg-emerald-900/30 backdrop-blur-sm opacity-0 translate-y-10">
                  <h3 className="text-xl font-bold mb-2">Real-time Updates</h3>
                  <p>Get instant notifications about your transactions</p>
                </div>
              </div>
            </div>

            {/* Scroll Trigger Section */}
            <div
              className="h-[50vh] flex flex-col items-center justify-center text-center opacity-0 translate-y-10"
              id="scrollTriggerSection"
            >
              <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-lime-500 dark:from-emerald-300 dark:to-lime-300 bg-clip-text text-transparent">
                Start Your Journey with SolBuddy
              </h1>
              <p className="mt-4 text-lg md:text-xl text-emerald-800 dark:text-lime-300">
                Simplify your Solana experience with cutting-edge tools and unmatched security.
              </p>
              <div>
                <button onClick={handleStart} className="mt-10 py-3 px-6 bg-emerald-700 text-lime-300 dark:bg-lime-500 dark:text-emerald-900 font-semibold rounded-md hover:bg-emerald-800 dark:hover:bg-lime-400 transition-all shadow-md">
                  Get Started Now
                </button>
              </div>
            </div>
          </>
        ) : (
          <Outlet />
        )}
      </div>
    </>
  );
};

export default App;

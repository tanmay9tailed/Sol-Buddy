import { useThemeDetector } from '../utils/DarkMode';
const Toggler = () => {
  const { toggleTheme } = useThemeDetector();

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <div className="relative w-14 h-7 bg-gradient-to-r from-emerald-200 to-lime-300 dark:from-emerald-700 dark:to-lime-900 rounded-full p-1 transition-colors duration-300">
          {/* Sun Icon */}
          <div className="absolute right-1 top-1/2 -translate-y-1/2 text-yellow-400 dark:text-emerald-800 transition-opacity duration-300 opacity-100 dark:opacity-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="5" fill="currentColor" className="text-yellow-500" />
              <line
                x1="12"
                y1="1"
                x2="12"
                y2="5"
                stroke="currentColor"
                className="text-yellow-500"
                strokeLinecap="round"
                strokeWidth={2}
              />
              <line
                x1="12"
                y1="19"
                x2="12"
                y2="23"
                stroke="currentColor"
                className="text-yellow-500"
                strokeLinecap="round"
                strokeWidth={2}
              />
              <line
                x1="1"
                y1="12"
                x2="5"
                y2="12"
                stroke="currentColor"
                className="text-yellow-500"
                strokeLinecap="round"
                strokeWidth={2}
              />
              <line
                x1="19"
                y1="12"
                x2="23"
                y2="12"
                stroke="currentColor"
                className="text-yellow-500"
                strokeLinecap="round"
                strokeWidth={2}
              />
              <line
                x1="4.22"
                y1="4.22"
                x2="6.34"
                y2="6.34"
                stroke="currentColor"
                className="text-yellow-500"
                strokeLinecap="round"
                strokeWidth={2}
              />
              <line
                x1="17.66"
                y1="17.66"
                x2="19.78"
                y2="19.78"
                stroke="currentColor"
                className="text-yellow-500"
                strokeLinecap="round"
                strokeWidth={2}
              />
              <line
                x1="17.66"
                y1="6.34"
                x2="19.78"
                y2="4.22"
                stroke="currentColor"
                className="text-yellow-500"
                strokeLinecap="round"
                strokeWidth={2}
              />
              <line
                x1="4.22"
                y1="19.78"
                x2="6.34"
                y2="17.66"
                stroke="currentColor"
                className="text-yellow-500"
                strokeLinecap="round"
                strokeWidth={2}
              />
            </svg>
          </div>

          {/* Moon Icon */}
          <div className="absolute left-1 top-1/2 -translate-y-1/2 text-emerald-100 transition-opacity duration-300 opacity-0 dark:opacity-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="url(#moonGradient)"
              viewBox="0 0 24 24"
              stroke="url(#moonStroke)"
              strokeWidth={2}
            >
              <defs>
                <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4ADE80" />
                  <stop offset="100%" stopColor="#34D399" />
                </linearGradient>
                <linearGradient id="moonStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A7F3D0" />
                  <stop offset="100%" stopColor="#6EE7B7" />
                </linearGradient>
              </defs>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </div>

          {/* Toggle Button */}
          <div className="w-5 h-5 rounded-full bg-white dark:bg-lime-200 shadow-md transform transition-transform duration-300 translate-x-0 dark:translate-x-7"></div>
        </div>
      </button>
    </div>
  );
};

export default Toggler;

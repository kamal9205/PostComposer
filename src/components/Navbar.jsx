// Navbar.jsx
export default function Navbar({ downloadLink, extraClassName = "" }) {
  return (
    <nav className={`fixed top-0 left-0 right-0 z-30 bg-white/90 shadow flex items-center justify-between px-4 py-3 ${extraClassName}`}>
      <span className="text-base md:text-lg font-medium text-gray-800">
        If you want to see the posts around you, download the app
      </span>
      <button
        className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold shadow transition"
        onClick={() => window.open(downloadLink, "_blank")}
      >
        Download App
      </button>
    </nav>
  );
}

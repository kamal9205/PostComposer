import { useState } from "react";
import Navbar from "./components/Navbar";
import MapView from "./components/MapView";
import PostComposer from "./components/PostComposer";

function App() {
  const [posted, setPosted] = useState(false);

  // Height of the navbar ("Drop" or Navbar component)
  const NAV_HEIGHT = 80; // px (Tailwind h-20 is 5rem = 80px)
  const GAP = 0;         // Adjust for extra gap under the navbar if needed

  return (
    <div className="relative w-screen h-screen bg-gray-100 overflow-hidden">
      {/* --- Top Bar: "Drop" or Navbar --- */}
      {!posted ? (
        <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-start h-20 bg-white/70 shadow px-6">
          <span className="text-xl font-semibold text-blue-700">Drop</span>
        </div>
      ) : (
        <Navbar downloadLink="https://your-app-download-link.com" extraClassName="" />
      )}

      {/* --- Map fills screen beneath nav, with PostComposer overlayed at bottom --- */}
      <div
        className="w-full"
        style={{
          position: "absolute",
          top: NAV_HEIGHT + GAP,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <MapView />

        {/* PostComposer overlay, floating at bottom */}
        <div className="absolute left-0 right-0 bottom-0 z-40 flex justify-center pointer-events-none">
          <div className="w-full max-w-md px-2 mb-4 pointer-events-auto">
            {/* The "grow when camera open" logic is INSIDE PostComposer */}
            <PostComposer onPost={() => setPosted(true)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

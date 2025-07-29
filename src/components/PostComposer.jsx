import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

export default function PostComposer({ onPost }) {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const [mode, setMode] = useState(""); // "photo" | "video" | "text"
  const [imgSrc, setImgSrc] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [caption, setCaption] = useState("");
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [videoChunks, setVideoChunks] = useState([]);
  const [posting, setPosting] = useState(false);

  // Photo capture
  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
      setVideoSrc(null);
    }
  }, []);

  // Video recording
  const startRecording = useCallback(() => {
    setRecording(true);
    setImgSrc(null);
    setVideoSrc(null);
    setVideoChunks([]);
    setCaption("");
    setText("");
    mediaRecorderRef.current = new window.MediaRecorder(
      webcamRef.current.stream,
      { mimeType: "video/webm" }
    );
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setVideoChunks((prev) => [...prev, event.data]);
      }
    };
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(videoChunks, { type: "video/webm" });
      setVideoSrc(URL.createObjectURL(blob));
    };
    mediaRecorderRef.current.start();
  }, [videoChunks]);

  const stopRecording = useCallback(() => {
    setRecording(false);
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
  }, []);

  // Reset all states
  const resetAll = () => {
    setImgSrc(null);
    setVideoSrc(null);
    setCaption("");
    setText("");
    setMode("");
    setRecording(false);
    setVideoChunks([]);
  };

  // Post
  const canPost =
    !!imgSrc || !!videoSrc || (mode === "text" && text.trim().length > 0);

  const handlePost = () => {
    setPosting(true);
    setTimeout(() => {
      if (onPost) onPost();
      resetAll();
      setPosting(false);
    }, 1000);
  };

  const handleRemove = () => {
  setImgSrc(null);
  setVideoSrc(null);
  setCaption("");
  setText("");
  setMode("");
  setRecording(false);
  setVideoChunks([]);
};


  // Render
  return (
    <div
      className={
        "bg-white rounded-2xl shadow-xl p-4 w-full max-w-md mx-auto border border-gray-200 transition-all duration-300 " +
        (mode === "photo" || mode === "video"
          ? "min-h-[540px] md:min-h-[650px]"
          : "min-h-[200px]")
      }
    >
      {/* Mode Select Row */}
      <div className="flex justify-between mb-3">
        <button
          aria-label="Photo"
          onClick={() => resetAll() || setMode("photo")}
          className={`rounded-full p-3 bg-gray-100 border
            ${mode === "photo" ? "border-blue-500 bg-blue-50" : "border-gray-200"}
            hover:bg-blue-100 hover:border-blue-400 transition`}
        >
          {/* Camera icon */}
          <svg width="22" height="22" fill="currentColor" className="text-blue-600" viewBox="0 0 24 24"><path d="M12 7.5a4.5 4.5 0 1 1 0 9.001 4.5 4.5 0 0 1 0-9zM4.5 20A2.5 2.5 0 0 1 2 17.5v-9A2.5 2.5 0 0 1 4.5 6h2.127a2.5 2.5 0 0 0 2.075-1.1l1.016-1.524A2.5 2.5 0 0 1 11.609 2h.782a2.5 2.5 0 0 1 2.056 1.376l1.016 1.524A2.5 2.5 0 0 0 17.373 6H19.5A2.5 2.5 0 0 1 22 8.5v9A2.5 2.5 0 0 1 19.5 20h-15z"/></svg>
        </button>
        <button
          aria-label="Video"
          onClick={() => resetAll() || setMode("video")}
          className={`rounded-full p-3 bg-gray-100 border
            ${mode === "video" ? "border-blue-500 bg-blue-50" : "border-gray-200"}
            hover:bg-blue-100 hover:border-blue-400 transition`}
        >
          {/* Video icon */}
          <svg width="24" height="24" fill="currentColor" className="text-blue-600" viewBox="0 0 24 24"><path d="M17 10.5V7a2 2 0 0 0-2-2H5.5A2.5 2.5 0 0 0 3 7.5v9A2.5 2.5 0 0 0 5.5 19H15a2 2 0 0 0 2-2v-3.5l3 3v-9l-3 3z"/></svg>
        </button>
        <button
          aria-label="Text"
          onClick={() => resetAll() || setMode("text")}
          className={`rounded-full p-3 bg-gray-100 border
            ${mode === "text" ? "border-blue-500 bg-blue-50" : "border-gray-200"}
            hover:bg-blue-100 hover:border-blue-400 transition`}
        >
          {/* NEW Text SVG icon */}
          <svg width="22" height="22" stroke="currentColor" fill="currentColor" className="text-blue-600" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="2" rx="1"/><rect x="2" y="11" width="20" height="2" rx="1"/><rect x="2" y="16" width="13" height="2" rx="1"/></svg>
        </button>
      </div>

      {/* CAMERA MODE */}
      {mode === "photo" && !imgSrc && (
        <div className="relative w-full flex flex-col items-center mb-2 transition-all duration-300">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="w-full max-w-lg h-[400px] md:h-[520px] rounded object-cover border"
            videoConstraints={{
              facingMode: "environment",
              width: 640,
              height: 480,
            }}
          />
          <button
            onClick={capturePhoto}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold"
          >
            Click Photo
          </button>
          {/* Close button resets! */}
          <button
            onClick={resetAll}
            className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded font-semibold"
            title="Close"
          >
            Close
          </button>
        </div>
      )}

      {/* Photo Preview */}
      {imgSrc && (
        <div className="w-full mb-2 relative">
          <img src={imgSrc} alt="preview" className="w-full h-40 md:h-48 rounded-lg object-contain" />
          <button
            onClick={handleRemove}
            className="absolute top-1 right-1 bg-white bg-opacity-90 text-gray-700 rounded-full p-1 hover:bg-red-500 hover:text-white transition"
            title="Remove"
          >&times;</button>
        </div>
      )}

      {/* VIDEO MODE */}
      {mode === "video" && !videoSrc && (
        <div className="relative w-full flex flex-col items-center mb-2 transition-all duration-300">
          <Webcam
            ref={webcamRef}
            audio={true}
            className="w-full max-w-lg h-[400px] md:h-[520px] rounded object-cover border"
            videoConstraints={{
              facingMode: "environment",
              width: 550,
              height: 320,
            }}
          />
          <button
            onClick={recording ? stopRecording : startRecording}
            className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded font-semibold
              ${recording ? "bg-red-500 hover:bg-red-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
          >
            {recording ? "Stop Recording" : "Start Recording"}
          </button>
          {/* Close video */}
          <button
            onClick={resetAll}
            className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded font-semibold"
            title="Close"
          >
            Close
          </button>
        </div>
      )}

      {/* Video Preview */}
      {videoSrc && (
        <div className="w-full mb-2 relative">
          <video src={videoSrc} controls className="w-full h-40 md:h-48 rounded-lg object-contain" />
          <button
            onClick={handleRemove}
            className="absolute top-1 right-1 bg-white bg-opacity-90 text-gray-700 rounded-full p-1 hover:bg-red-500 hover:text-white transition"
            title="Remove"
          >&times;</button>
        </div>
      )}

      {/* TEXT MODE */}
      {mode === "text" && (
        <textarea
          className="w-full border border-gray-300 rounded px-3 py-2 mb-2 mt-2 focus:outline-none focus:border-blue-500 resize-none"
          placeholder="Write something..."
          rows={3}
          value={text}
          onChange={e => setText(e.target.value)}
          maxLength={500}
        />
      )}

      {/* Caption, only for photo or video */}
      {(imgSrc || videoSrc) && (
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-2 mt-2 focus:outline-none focus:border-blue-500"
          placeholder="Enter caption..."
          value={caption}
          onChange={e => setCaption(e.target.value)}
          maxLength={200}
        />
      )}

      {/* Upload/Post Button */}
      <button
        type="button"
        disabled={!canPost || posting}
        onClick={handlePost}
        className={`w-full mt-2 py-2 rounded-lg font-semibold transition
          ${canPost && !posting ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}
        `}
      >
        {posting ? "Posting..." : "Upload Post"}
      </button>
    </div>
  );
}

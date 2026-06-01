// import React, { useRef, useState } from "react";
// import useFirebaseStorage from "../../hooks/useFirebaseStorage";
// import { HiOutlinePhotograph, HiOutlineX, HiOutlineCloudUpload } from "react-icons/hi";

// /**
//  * ImageUpload — drag & drop / click to upload to Firebase Storage
//  *
//  * Props:
//  *   value        — current image URL string
//  *   onChange     — called with new URL after upload
//  *   folder       — Firebase Storage folder name (default: "uploads")
//  *   placeholder  — text shown when empty
//  */
// const ImageUpload = ({ value, onChange, folder = "uploads", placeholder = "Click or drag to upload image" }) => {
//   const inputRef = useRef();
//   const [dragging, setDragging] = useState(false);
//   const { uploadFile, uploading, progress, error } = useFirebaseStorage();

//   const handleFile = async (file) => {
//     if (!file) return;
//     try {
//       const url = await uploadFile(file, folder);
//       onChange(url);
//     } catch (err) {
//       // error is already set in hook
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setDragging(false);
//     const file = e.dataTransfer.files[0];
//     if (file) handleFile(file);
//   };

//   const handleRemove = (e) => {
//     e.stopPropagation();
//     onChange("");
//   };

//   return (
//     <div className="w-full">
//       {value ? (
//         /* Preview */
//         <div className="relative group rounded-xl overflow-hidden border border-slate-700">
//           <img src={value} alt="Upload preview" className="w-full h-48 object-cover" />
//           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
//             <button type="button" onClick={() => inputRef.current?.click()}
//               className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs rounded-lg backdrop-blur-sm transition-all">
//               Replace
//             </button>
//             <button type="button" onClick={handleRemove}
//               className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-all">
//               <HiOutlineX className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       ) : (
//         /* Drop zone */
//         <div
//           onClick={() => inputRef.current?.click()}
//           onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
//           onDragLeave={() => setDragging(false)}
//           onDrop={handleDrop}
//           className={`w-full h-36 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
//             ${dragging ? "border-blue-500 bg-blue-500/10" : "border-slate-700 hover:border-slate-500 hover:bg-slate-800/50"}`}>
//           {uploading ? (
//             <div className="flex flex-col items-center gap-2 w-full px-8">
//               <div className="w-7 h-7 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
//               <div className="w-full bg-slate-700 rounded-full h-1.5">
//                 <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
//               </div>
//               <p className="text-xs text-slate-400">{progress}% uploading...</p>
//             </div>
//           ) : (
//             <>
//               <HiOutlineCloudUpload className="w-8 h-8 text-slate-500" />
//               <p className="text-sm text-slate-400">{placeholder}</p>
//               <p className="text-xs text-slate-600">PNG, JPG, WebP up to 5MB</p>
//             </>
//           )}
//         </div>
//       )}

//       {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}

//       <input ref={inputRef} type="file" accept="image/*" className="hidden"
//         onChange={(e) => handleFile(e.target.files[0])} />
//     </div>
//   );
// };

// export default ImageUpload;





import React, { useRef, useState } from "react";
import axios from "axios";
import { HiOutlineCloudUpload, HiOutlineX } from "react-icons/hi";

const ImageUpload = ({ value, onChange, folder = "uploads", placeholder = "Click or drag to upload image" }) => {
  const inputRef = useRef();
  const [dragging,  setDragging]  = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [error,     setError]     = useState("");

  const handleFile = async (file) => {
    if (!file) return;

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setError("Only JPEG, PNG, WebP and GIF images are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }

    setError("");
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/upload/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (e) => {
            setProgress(Math.round((e.loaded / e.total) * 100));
          },
        }
      );

      // imgBB URL is now returned — this gets saved in MongoDB
      onChange(res.data.data.url);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Check IMGBB_API_KEY in backend .env");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange("");
    setError("");
  };

  return (
    <div className="w-full">
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-700">
          <img src={value} alt="Cover preview" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs rounded-lg backdrop-blur-sm transition-all"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-all"
            >
              <HiOutlineX className="w-4 h-4" />
            </button>
          </div>
          <span className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded">
            imgBB ✓
          </span>
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`w-full h-36 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all
            ${uploading ? "cursor-not-allowed" : "cursor-pointer"}
            ${dragging ? "border-blue-500 bg-blue-500/10" : "border-slate-700 hover:border-slate-500 hover:bg-slate-800/50"}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 w-full px-8">
              <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-400">Uploading to imgBB… {progress}%</p>
            </div>
          ) : (
            <>
              <HiOutlineCloudUpload className="w-8 h-8 text-slate-500" />
              <p className="text-sm text-slate-400">{placeholder}</p>
              <p className="text-xs text-slate-600">PNG, JPG, WebP up to 5MB</p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 mt-1.5">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
};

export default ImageUpload;

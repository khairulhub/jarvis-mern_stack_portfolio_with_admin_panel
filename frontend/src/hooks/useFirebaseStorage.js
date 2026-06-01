import { useState } from "react";
import { storage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "../config/firebase";

/**
 * useFirebaseStorage — upload files to Firebase Storage
 *
 * Usage:
 *   const { uploadFile, uploading, progress, error } = useFirebaseStorage();
 *   const url = await uploadFile(file, "blogs/cover.jpg");
 */
const useFirebaseStorage = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadFile = (file, path) => {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error("No file provided"));

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        const err = new Error("File size exceeds 5MB limit");
        setError(err.message);
        return reject(err);
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        const err = new Error("Only JPEG, PNG, WebP and GIF images are allowed");
        setError(err.message);
        return reject(err);
      }

      setUploading(true);
      setProgress(0);
      setError(null);

      // Build storage path: e.g. "blogs/1234567890-cover.jpg"
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name.replace(/\s+/g, "_")}`;
      const storagePath = path ? `${path}/${fileName}` : `uploads/${fileName}`;

      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(pct);
        },
        (err) => {
          setUploading(false);
          setError(err.message);
          reject(err);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setUploading(false);
            setProgress(100);
            resolve(downloadURL);
          } catch (err) {
            setUploading(false);
            setError(err.message);
            reject(err);
          }
        }
      );
    });
  };

  const deleteFile = async (fileUrl) => {
    try {
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  return { uploadFile, deleteFile, uploading, progress, error };
};

export default useFirebaseStorage;

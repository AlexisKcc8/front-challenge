import { useState } from "react";

export const useFetch = () => {
  const [photos, setPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const fetchPhoto = async () => {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/photos");
      const data = await res.json();
      setPhotos(data);
      setCurrentPhotoIndex(0);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  return { fetchPhoto, photos, currentPhotoIndex };
};

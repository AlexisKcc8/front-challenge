import React, { useEffect, useRef, useState } from "react";
import { useFetch } from "./useFetch";

export const useMoveable = () => {
  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);
  const RefParent = useRef(null); // Referencia al contenedor padre
  const { fetchPhoto, photos } = useFetch();

  useEffect(() => {
    fetchPhoto();
  }, []);

  const addMoveable = () => {
    // Create a new moveable component and add it to the array
    const COLORS = ["red", "blue", "yellow", "green", "purple"];
    // console.log(console.log(photos));
    setMoveableComponents([
      ...moveableComponents,
      {
        id: Math.floor(Math.random() * Date.now()),
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        updateEnd: true,
      },
    ]);
  };

  const updateMoveable = (id, newComponent, updateEnd = true) => {
    const updatedMoveables = moveableComponents.map((moveable, i) => {
      if (moveable.id === id) {
        return { id, ...newComponent, updateEnd };
      }
      return moveable;
    });
    setMoveableComponents(updatedMoveables);
  };

  const deleteMoveable = (idMoveable) => {
    //* eliminamos un hijo moveable del array
    const updatedMoveables = moveableComponents.filter(
      (moveable) => moveable.id !== idMoveable
    );
    setMoveableComponents(updatedMoveables);
    if (selected === idMoveable) {
      setSelected(null);
    }
  };

  const handleResizeStart = (index, e) => {
    const [handlePosX] = e.direction;

    if (handlePosX === -1) {
      const initialLeft = e.left;
      const initialWidth = e.width;

      // Se establece el evento onResize para actualizar la posición izquierda en función del cambio de ancho
      e.onResize = ({ width }) => {
        const deltaWidth = width - initialWidth;
        const newLeft = initialLeft - deltaWidth;
        updateMoveable(e.target.id, { left: newLeft, width }, false);
      };
    }
  };
  return {
    addMoveable,
    RefParent,
    moveableComponents,
    updateMoveable,
    handleResizeStart,
    setSelected,
    selected,
    deleteMoveable,
    photos,
  };
};

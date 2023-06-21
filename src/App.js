import { useState, useEffect, useRef } from "react";
import { Box } from "./components/Box";
import { useFetch } from "./hooks/useFetch";

const App = () => {
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

  return (
    <main style={{ height: "100vh", width: "100vw" }}>
      <button onClick={addMoveable}>Add Moveable1</button>
      {/* <button onClick={example}>click</button> */}
      <section
        id="parent"
        ref={RefParent}
        style={{
          position: "relative",
          background: "black",
          height: "80vh",
          width: "80vw",
        }}
      >
        {moveableComponents.map((item, index) => (
          <Box
            {...item}
            key={index}
            index={index}
            updateMoveable={updateMoveable}
            handleResizeStart={handleResizeStart}
            setSelected={setSelected}
            isSelected={selected === item.id}
            deleteMoveable={deleteMoveable}
            RefParent={RefParent}
            photo={photos[index % photos.length]}
          />
        ))}
      </section>
    </main>
  );
};

export default App;

// const Component = ({
//   updateMoveable,
//   top,
//   left,
//   width,
//   height,
//   index,
//   color,
//   id,
//   setSelected,
//   isSelected = false,
//   updateEnd,
// }) => {
//   const ref = useRef();

//   const [nodoReferencia, setNodoReferencia] = useState({
//     top,
//     left,
//     width,
//     height,
//     index,
//     color,
//     id,
//   });

//   let parent = document.getElementById("parent");
//   let parentBounds = parent?.getBoundingClientRect();

//   const onResize = async (e) => {
//     // ACTUALIZAR ALTO Y ANCHO
//     let newWidth = e.width;
//     let newHeight = e.height;

//     const positionMaxTop = top + newHeight;
//     const positionMaxLeft = left + newWidth;

//     if (positionMaxTop > parentBounds?.height)
//       newHeight = parentBounds?.height - top;
//     if (positionMaxLeft > parentBounds?.width)
//       newWidth = parentBounds?.width - left;

//     updateMoveable(id, {
//       top,
//       left,
//       width: newWidth,
//       height: newHeight,
//       color,
//     });

//     // ACTUALIZAR NODO REFERENCIA
//     const beforeTranslate = e.drag.beforeTranslate;

//     ref.current.style.width = `${e.width}px`;
//     ref.current.style.height = `${e.height}px`;

//     let translateX = beforeTranslate[0];
//     let translateY = beforeTranslate[1];

//     ref.current.style.transform = `translate(${translateX}px, ${translateY}px)`;

//     setNodoReferencia({
//       ...nodoReferencia,
//       translateX,
//       translateY,
//       top: top + translateY < 0 ? 0 : top + translateY,
//       left: left + translateX < 0 ? 0 : left + translateX,
//     });
//   };

//   const onResizeEnd = async (e) => {
//     let newWidth = e.lastEvent?.width;
//     let newHeight = e.lastEvent?.height;

//     const positionMaxTop = top + newHeight;
//     const positionMaxLeft = left + newWidth;

//     if (positionMaxTop > parentBounds?.height)
//       newHeight = parentBounds?.height - top;
//     if (positionMaxLeft > parentBounds?.width)
//       newWidth = parentBounds?.width - left;

//     const { lastEvent } = e;
//     const { drag } = lastEvent;
//     const { beforeTranslate } = drag;

//     const absoluteTop = top + beforeTranslate[1];
//     const absoluteLeft = left + beforeTranslate[0];

//     updateMoveable(
//       id,
//       {
//         top: absoluteTop,
//         left: absoluteLeft,
//         width: newWidth,
//         height: newHeight,
//         color,
//       },
//       true
//     );
//   };

//   return (
//     <>
//       <div
//         ref={ref}
//         className="draggable"
//         id={"component-" + id}
//         style={{
//           position: "absolute",
//           top: top,
//           left: left,
//           width: width,
//           height: height,
//           background: color,
//         }}
//         onClick={() => setSelected(id)}
//       />

//       <Moveable
//         target={isSelected && ref.current}
//         resizable
//         draggable
//         onDrag={(e) => {
//           updateMoveable(id, {
//             top: e.top,
//             left: e.left,
//             width,
//             height,
//             color,
//           });
//         }}
//         onResize={onResize}
//         onResizeEnd={onResizeEnd}
//         keepRatio={false}
//         throttleResize={1}
//         renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
//         edge={false}
//         zoom={1}
//         origin={false}
//         padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
//       />
//     </>
//   );
// };

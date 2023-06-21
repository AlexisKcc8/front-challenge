import { useEffect, useRef, useState } from "react";
import Moveable from "react-moveable";

export const Box = ({
  id,
  top,
  index,
  left,
  width,
  height,
  color,
  updateMoveable,
  handleResizeStart,
  setSelected,
  isSelected,
  deleteMoveable,
  photo,
  RefParent,
}) => {
  const ref = useRef();
  const moveableRef = useRef();
  const [nodoReferencia, setNodoReferencia] = useState({
    top,
    left,
    width,
    height,
    index,
    color,
    id,
  });
  let parent = document.getElementById("parent");

  let parentBounds = parent?.getBoundingClientRect();
  useEffect(() => {
    // Actualizamos el componente oveable cuando cambian los valores
    moveableRef.current.updateRect();
  }, [top, left, width, height]);

  // const onResize = (e) => {
  //   const { width, height } = e;
  //   updateMoveable(id, { top, left, width, height });
  // };
  const onResize = async (e) => {
    // ACTUALIZAR ALTO Y ANCHO
    let newWidth = e.width;
    let newHeight = e.height;

    const positionMaxTop = top + newHeight;
    const positionMaxLeft = left + newWidth;

    if (positionMaxTop > parentBounds?.height)
      newHeight = parentBounds?.height - top;
    if (positionMaxLeft > parentBounds?.width)
      newWidth = parentBounds?.width - left;

    updateMoveable(id, {
      top,
      left,
      width: newWidth,
      height: newHeight,
      color,
    });

    // ACTUALIZAR NODO REFERENCIA
    const beforeTranslate = e.drag.beforeTranslate;

    ref.current.style.width = `${e.width}px`;
    ref.current.style.height = `${e.height}px`;

    let translateX = beforeTranslate[0];
    let translateY = beforeTranslate[1];

    ref.current.style.transform = `translate(${translateX}px, ${translateY}px)`;

    setNodoReferencia({
      ...nodoReferencia,
      translateX,
      translateY,
      top: top + translateY < 0 ? 0 : top + translateY,
      left: left + translateX < 0 ? 0 : left + translateX,
    });
  };

  const onResizeEnd = () => {
    updateMoveable(id, { top, left, width, height }, true);
  };

  return (
    <>
      <div
        ref={ref}
        className={`draggable ${isSelected ? "selected" : ""}`}
        id={"component-" + id}
        style={{
          position: "absolute",
          top: top,
          left: left,
          width: width,
          height: height,
          background: color,
        }}
        onClick={() => setSelected(id)}
      >
        <img src={photo?.thumbnailUrl} alt={photo?.title} className="img-box" />
        <button className="delete" onClick={() => deleteMoveable(id)}>
          Delete
        </button>
      </div>

      <Moveable
        ref={moveableRef}
        target={ref.current}
        resizable
        draggable
        onDrag={(e) => {
          updateMoveable(id, {
            top: e.top,
            left: e.left,
            width,
            height,
            color,
          });
        }}
        onResize={onResize}
        onResizeStart={(e) => handleResizeStart(id, e)}
        onResizeEnd={onResizeEnd}
        onDragEnd={() =>
          updateMoveable(id, { top, left, width, height, color }, true)
        }
        parent={RefParent.current}
        origin={false}
        keepRatio={false}
        edge={false}
        throttleResize={0}
        throttleDrag={0}
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        rotatable={false}
        snappable={true}
        snappers={[
          ({ left, top, right, bottom }) => [
            Math.round(left),
            Math.round(top),
            Math.round(right),
            Math.round(bottom),
          ],
        ]}
        snappableRadius={10}
        snapCenter={true}
        snapVertical={true}
        snapHorizontal={true}
        onRenderEnd={() =>
          updateMoveable(id, { top, left, width, height, color }, true)
        }
      />
    </>
  );
};

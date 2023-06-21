import { Box } from "./components/Box";
import { useMoveable } from "./hooks/useMoveable";

const App = () => {
  const {
    addMoveable,
    RefParent,
    moveableComponents,
    updateMoveable,
    handleResizeStart,
    setSelected,
    selected,
    deleteMoveable,
    photos,
  } = useMoveable();

  return (
    <main style={{ height: "100vh", width: "100vw" }}>
      <button onClick={addMoveable}>Add Moveable1</button>
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

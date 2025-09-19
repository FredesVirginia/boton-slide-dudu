import { useRef, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { LuDot } from "react-icons/lu";

export interface IButtonSlider {
  disable?: boolean;
  loading?: boolean;
  confirmmed?: boolean;
  children?: React.ReactNode;
  simulateApi?: boolean; // nuevo → para decidir si se simula la API
}

export default function ButtonSlider({ disable = false, loading, confirmmed, children, simulateApi = false }: IButtonSlider) {
  const offset = 5;
  const handleWidth = 44;

  // estados internos
  const [dragX, setDragX] = useState(offset);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"idle" | "loading" | "confirmed">("idle");

  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    if (disable || phase !== "idle") return;
    isDragging.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !sliderRef.current || phase !== "idle") return;

    const rect = sliderRef.current.getBoundingClientRect();
    const sliderWidth = rect.width;

    let newX = e.clientX - rect.left - handleWidth / 2;
    newX = Math.max(offset, Math.min(newX, sliderWidth - handleWidth - offset));

    setDragX(newX);
  };

  const handleMouseUp = () => {
    if (!sliderRef.current || phase !== "idle") return;
    isDragging.current = false;

    const sliderWidth = sliderRef.current.offsetWidth;
    const half = sliderWidth / 2;

    if (dragX + handleWidth / 2 >= half) {
      setIsActive(true);
      setDragX(sliderWidth - handleWidth - offset);

      if (simulateApi) {
        // 🔄 ciclo automático
        setTimeout(() => {
          setPhase("loading");
          setTimeout(() => {
            setPhase("confirmed");
            setTimeout(() => {
              setIsActive(false);
              setDragX(offset);
              setPhase("idle");
            }, 2000);
          }, 2000);
        }, 500);
      }
    } else {
      setIsActive(false);
      setDragX(offset);
    }
  };

  // lógica para props externas
  const isLoading = loading || (simulateApi && phase === "loading");
  const isConfirmed = confirmmed || (simulateApi && phase === "confirmed");

  return (
    <div className="app">
      <div
        className={`slider-container ${
          confirmmed || phase === "confirmed"
            ? "confirmed"
            : loading || phase === "loading"
            ? "loading"
            : isActive
            ? "active"
            : ""
        }`}
        ref={sliderRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* confirmed */}
        {isConfirmed && (
          <div className="slider-center fade-in">
            <div className="slider-handle confirmed">
              <TiTick size={28} />
            </div>
          </div>
        )}

        {/* loading */}
        {!isConfirmed && isLoading && (
          <div className="slider-center fade-in">
            <Loading />
          </div>
        )}

        {/* idle */}
        {!isLoading && !isConfirmed && (
          <>
            <div className="slider-handle" style={{
        left: `${dragX}px`,
        transform: "translateY(-50%)",
        transition: isDragging.current ? "none" : "background 0.1s ease, color 0.1s ease, transform 0.1s ease",
      }} onMouseDown={handleMouseDown}
            
            >
              <FaChevronRight />
            </div>
            <span className={`slider-text ${isActive ? "fade-out" : "fade-in"}`}>{children}</span>
          </>
        )}
      </div>
    </div>
  );
}

const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "2px",
      }}
    >
      <LuDot color="blue" />
      <LuDot color="blue" />
      <LuDot color="blue" />
    </div>
  );
};

import { useRef, useState } from "react";
import "./App.css";

import { FaChevronRight } from "react-icons/fa";
import ButtonSlider from "./ButtonSlider";

function App() {
  const offset = 5;
  const [dragX, setDragX] = useState(offset);
  const [isActive, setIsActive] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleWidth = 44;

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const sliderWidth = rect.width;

    let newX = e.clientX - rect.left - handleWidth / 2;
    newX = Math.max(offset, Math.min(newX, sliderWidth - handleWidth - offset));

    setDragX(newX);
  };

  const handleMouseUp = () => {
    if (!sliderRef.current) return;
    isDragging.current = false;

    const sliderWidth = sliderRef.current.offsetWidth;
    const half = sliderWidth / 2;

    if (dragX + handleWidth / 2 >= half) {
      setIsActive(true);
      setDragX(sliderWidth - handleWidth - offset);
    } else {
      setIsActive(false);
      setDragX(offset);
    }
  };

  return (
    <div className="app">
     <ButtonSlider simulateApi>Simulación API</ButtonSlider>

     <ButtonSlider>Desliza para avanzar</ButtonSlider>

<ButtonSlider confirmmed>Confirmado externo</ButtonSlider>

<ButtonSlider loading>Loading externo</ButtonSlider>



    </div>
  );
}

export default App;

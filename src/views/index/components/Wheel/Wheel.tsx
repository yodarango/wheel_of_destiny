import { useWheelContext } from "../../../../context/WheelContextProvider";
import { useEffect, useRef, useState } from "react";
import { playTickSound } from "./playTickSound";
import { Dialog } from "../Dialog";

// styles
import "./Wheel.scss";

export const Wheel = () => {
  const {
    state: { isWheelSpinning, wheelColors, slicesData },
    handleToggleSpinningWheel: onUpdateWheelSpinning,
    handleRemoveItemFromList: onRemoveItem,
  } = useWheelContext();

  const wheelContainer = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  const playTick = playTickSound;

  // draw pie chart function
  function drawPieChart(
    canvas: React.RefObject<HTMLCanvasElement>,
    data: string[],
    numberOfSlices: number,
    wheelColors: string[],
    size: number = 300
  ) {
    if (canvas.current === null) return;

    canvas.current.width = size;
    canvas.current.height = size;

    const ctx: CanvasRenderingContext2D = canvas.current.getContext("2d")!;

    // Dynamic sizing based on canvas size
    const x = canvas.current.width / 2;
    const y = canvas.current.height / 2;
    const radius =
      Math.min(canvas.current.width, canvas.current.height) / 2 - 20; // Adjust radius based on canvas size, leave some margin

    let start = 0;
    const totalValue = numberOfSlices * 100;
    const fontSize = Math.max(10, canvas.current.height * 0.1 - data.length); // Adjust as needed

    let index = 0;
    for (let value of data) {
      // Draw the pie piece
      ctx.beginPath();
      ctx.moveTo(x, y);
      let endAngle = start + Math.PI * 2 * (100 / totalValue);
      ctx.arc(x, y, radius, start, endAngle, false);
      let sliceColor = wheelColors[index % wheelColors.length];
      ctx.fillStyle = sliceColor;
      ctx.fill();

      // Draw the text with the appropriate color based on the slice color
      drawText(value, start, endAngle, sliceColor);

      start = endAngle;
      index += 1;
    }

    function drawText(
      text: string,
      startAngle: number,
      endAngle: number,
      sliceColor: string
    ) {
      let angle = (startAngle + endAngle) / 2;
      let textRadius = radius * 0.7; // Adjust as needed
      let textX = x + Math.cos(angle) * textRadius;
      let textY = y + Math.sin(angle) * textRadius;

      // Calculate the available space in the slice
      let arcLength = (endAngle - startAngle) * radius;

      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(angle);

      // Set the text color based on the background color
      ctx.fillStyle = isLight(sliceColor) ? "black" : "white";

      ctx.font = `${fontSize - text.length * 1.2}px Arial`;

      // Measure how wide the text will be
      let textWidth = ctx.measureText(text).width;

      if (textWidth > arcLength) {
        // If the text is too wide, truncate it and add an ellipsis
        let truncatedText = text;
        while (
          ctx.measureText(truncatedText + "...").width > arcLength &&
          truncatedText.length > 0
        ) {
          truncatedText = truncatedText.substring(0, truncatedText.length - 1);
        }
        text = truncatedText + "...";
        textWidth = ctx.measureText(text).width; // Update the text width
      }

      // Render the text (now possibly truncated with an ellipsis)
      ctx.fillText(text, -textWidth / 2, 0);

      ctx.restore();
    }

    // Utility function to determine if the color is light or dark
    function isLight(color: string): boolean {
      // Convert hex to RGB first
      let r, g, b;
      if (color.charAt(0) === "#") {
        let bigint = parseInt(color.substring(1), 16);
        r = (bigint >> 16) & 255;
        g = (bigint >> 8) & 255;
        b = bigint & 255;
      } else {
        // If input is in another format, handle or throw an error here
        throw new Error("Color format not supported.");
      }

      // HSP equation from http://alienryderflex.com/hsp.html
      let hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

      // Using the HSP value, determine whether the color is light or dark
      return hsp > 127.5;
    }
  }

  // local state
  const [canvasSize, setCanvasContainerStyles] = useState<number>(530);

  const [dialogData, setDialogData] = useState({
    title: "",
    message: "",
    show: false,
  });

  // it wll be called every time the user updates any data
  const drawChart = (numberOfSlices: number) => {
    if (!canvas.current) return;

    if (!slicesData) return;

    const ctx = canvas.current?.getContext("2d");

    // get the size of the container
    let containerSize = wheelContainer.current?.clientWidth;

    if (!containerSize) return;
    containerSize =
      containerSize < 800 && containerSize > 500
        ? containerSize - 200
        : containerSize >= 800
        ? 600
        : containerSize * 0.9;

    setCanvasContainerStyles(containerSize);

    ctx!.clearRect(0, 0, canvas.current.width, canvas.current.height);
    drawPieChart(
      canvas,
      slicesData,
      numberOfSlices,
      wheelColors,
      containerSize
    );
  };

  // resize the wheel based on the container size
  function resizeWheel() {
    // debounce(() => {
    drawChart(slicesData.length);
    // });
  }

  // resize the wheel on window resize
  useEffect(() => {
    window.addEventListener("resize", () => {
      resizeWheel();
    });

    return () => {
      window.removeEventListener("resize", () => {
        resizeWheel();
      });
    };
  }, []);

  // re-draw the chart every time the user updates the data
  useEffect(() => {
    if (slicesData && wheelColors) {
      drawChart(slicesData.length);
    }
  }, [slicesData, wheelColors, canvas.current]);

  // the last slice item in the wheel
  const [lastChosenItem, setLastChosenItem] = useState(-1);

  // spin the wheel
  function spinWheel(removeChosenName = false) {
    if (slicesData.length === 1) location.reload();

    setDialogData({ ...dialogData, show: false });

    if (isWheelSpinning) {
      console.log(
        "%cYou cannot spin the wheel while it is in progress",
        "color: white; text-shadow: 1px 1px black; font-weight: bold; background-color: tomato; padding: 2px;"
      );
      return;
    }

    let numberOfSlices = slicesData.length;
    onUpdateWheelSpinning();
    if (lastChosenItem >= 0 && removeChosenName) {
      const newNumberOfSlices = numberOfSlices - 1;
      drawChart(newNumberOfSlices);
    }

    let startRotation = lastChosenItem * (360 / numberOfSlices) || 0;
    let endRotation = startRotation + 5 * 360 + Math.floor(Math.random() * 360);
    let duration = 7000;
    let previousRotation = 0;
    let tickInterval = 360 / numberOfSlices;

    let startTime: any = null;

    function rotate(timestamp: any) {
      if (!canvas.current) return;

      if (!startTime) startTime = timestamp;
      let timeElapsed = timestamp - startTime;
      let currentRotation =
        (endRotation - startRotation) *
          (-Math.pow(2, (-10 * timeElapsed) / duration) + 1) +
        startRotation;

      if (
        Math.floor(currentRotation / tickInterval) >
          Math.floor(previousRotation / tickInterval) &&
        slicesData.length > 1
      ) {
        playTick();
      }
      previousRotation = currentRotation;

      canvas.current.style.transform = `rotate(${currentRotation}deg)`;

      if (timeElapsed < duration && slicesData.length > 1) {
        requestAnimationFrame(rotate);
      } else {
        let selectedIndex =
          Math.floor(
            slicesData.length -
              (currentRotation % 360) / (360 / slicesData.length)
          ) % slicesData.length;

        if (removeChosenName) {
          onRemoveItem(selectedIndex);
        }
        onUpdateWheelSpinning();
        if (slicesData.length > 1 && slicesData[selectedIndex] !== undefined) {
          setLastChosenItem(selectedIndex);

          setDialogData({
            title: `Congratulations ${slicesData[selectedIndex]}`,
            message: `Destiny has called your name`,
            show: true,
          });
        } else {
          spinWheel();
        }
      }
    }

    requestAnimationFrame(rotate);
  }

  return (
    <>
      {dialogData.show && (
        <Dialog
          onClose={() => setDialogData({ ...dialogData, show: false })}
          onCancel={() => spinWheel(true)}
          onOk={() => spinWheel(false)}
          message={dialogData.message}
          title={dialogData.title}
        />
      )}

      <section
        className='wheel-of-destiny-33kl__canvas-container d-flex align-items-start justify-content-center w-100'
        ref={wheelContainer}
      >
        <div
          className='canvas-container-33kl__canvas d-flex align-items-center justify-content-center'
          style={{
            height: canvasSize,
            width: canvasSize,
          }}
        >
          <button
            className='wheel-of-destiny-33kl__canvas-spin-btn bg-alpha position-absolute color-primary shadow'
            onClick={() => spinWheel()}
          >
            <b>Spin</b>
          </button>
          <canvas ref={canvas} />
          <div
            id='wheel-of-destiny-33kl__canvas-tick'
            className='wheel-of-destiny-33kl__canvas-tick'
          />
        </div>
      </section>
    </>
  );
};

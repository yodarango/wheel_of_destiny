import { useEffect, useRef, useState } from "react";
import { debounce } from "../../../../lib/debounce";
import { Dialog } from "../Dialog";

type WheelProps = {
  onUpdateWheelSpinning: (isWheelSpinning: boolean) => void; // to prevent multiple spins or data updates during
  isWheelSpinning: boolean; // to prevent multiple spins or data updates during
  wheelColors: string[]; // the color palette iterates over its contents until all slices have a color
  slicesData: string[]; // each item is a slice in the wheel
};

export const Wheel = (props: WheelProps) => {
  const {
    isWheelSpinning = false,
    onUpdateWheelSpinning,
    wheelColors = [],
    slicesData = [],
  } = props;

  const canvas = useRef<HTMLCanvasElement>(null);
  const ctx = canvas.current?.getContext("2d");

  // draw pie chart function

  function drawPieChart(
    canvas: React.RefObject<HTMLCanvasElement>,
    data: string[],
    numberOfSlices: number,
    wheelColors: string[]
  ) {
    if (canvas.current === null) return;

    canvas.current.width = 530;
    canvas.current.height = 530;

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
  const [canvasContainerStyles, setCanvasContainerStyles] = useState<{
    width: string;
    height: string;
  }>({
    width: `530px`,
    height: `530px`,
  });

  const [numberOfSlices, setNumberOfSlices] = useState(slicesData.length); // to get the area of each

  const [dialogData, setDialogData] = useState({
    oncancel: () => {},
    onOk: () => {},
    title: "",
    message: "",
    show: false,
  });

  // sill be called every time the user updates any data
  const drawChart = () => {
    if (!canvas.current || !ctx) return;

    if (!slicesData || numberOfSlices === 0) return;

    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
    drawPieChart(canvas, slicesData, numberOfSlices, wheelColors);
  };

  // set the canvas and draw the chart
  useEffect(() => {
    if (!canvas.current) return;
    const w = window.innerWidth;
    const multiplyValue: number =
      w < 500 ? 0.8 : w < 700 ? 0.7 : w < 1000 ? 0.6 : 0.5;

    const trueWheelSize =
      w * multiplyValue < 700 ? Math.round(w * multiplyValue) : 700;

    // update size of the canvas container
    setCanvasContainerStyles({
      width: `${trueWheelSize}px`,
      height: `${trueWheelSize}px`,
    });

    // update size of the canvas
    canvas.current.width = trueWheelSize;
    canvas.current.height = trueWheelSize;

    drawChart();
  }, [canvas.current]);

  function resizeWheel(w: number, isInitialLoad: boolean = true) {
    if (isInitialLoad) return;
    if (w > 1400) return;

    const multiplyValue: number =
      w < 500 ? 0.8 : w < 700 ? 0.7 : w < 1000 ? 0.6 : 0.5;

    const trueWheelSize = Math.round(w * multiplyValue);
    setCanvasContainerStyles({
      width: `${trueWheelSize}px`,
      height: `${trueWheelSize}px`,
    });

    debounce(() => {
      if (!canvas.current) return;

      canvas.current.height = trueWheelSize;
      canvas.current.width = trueWheelSize;

      drawChart();
    });
  }

  // resize the wheel on window resize
  useEffect(() => {
    window.addEventListener("resize", ({ target }) => {
      const w = (target as Window).innerWidth;
      resizeWheel(w, false);
    });
  }, []);

  useEffect(() => {
    // re-draw the chart when the user updates the data
    if (slicesData || wheelColors) {
      setNumberOfSlices(slicesData.length);
      drawChart();
    }
  }, [slicesData, wheelColors]);
  let lastChosenItem = -1; // the slice chosen in the last round

  function spinWheel(removeChosenName = false) {
    if (slicesData.length === 1) location.reload();
    dialogData.show = false;
    if (isWheelSpinning) {
      console.log(
        "%cYou cannot spin the wheel while it is in progress",
        "color: white; text-shadow: 1px 1px black; font-weight: bold; background-color: tomato; padding: 2px;"
      );
      return;
    }

    onUpdateWheelSpinning(true);
    if (lastChosenItem >= 0 && removeChosenName) {
      slicesData.splice(lastChosenItem, 1);
      setNumberOfSlices(slicesData.length);
      drawChart(); // Assuming drawChart is a function that redraws your chart
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
        playTickSound();
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
        onUpdateWheelSpinning(false);
        if (slicesData.length > 1 && slicesData[selectedIndex] !== undefined) {
          lastChosenItem = selectedIndex;

          setDialogData({
            oncancel: () => spinWheel(true),
            onOk: () => spinWheel(false),
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

  // tick sound
  function playTickSound() {
    const audioContext = new window.AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(500, audioContext.currentTime); // Further reduced frequency for a lower sound
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Reduced volume for less noise
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }
  return (
    <>
      {dialogData.show && (
        <Dialog
          onClose={() => (dialogData.show = false)}
          onCancel={dialogData.oncancel}
          message={dialogData.message}
          title={dialogData.title}
          onOk={dialogData.onOk}
        />
      )}

      <section className='wheel-of-destiny-33kl__canvas-container d-flex align-items-start justify-content-center w-100'>
        <div
          className='canvas-container-33kl__canvas d-flex align-items-center justify-content-center'
          style={{
            height: canvasContainerStyles.height,
            width: canvasContainerStyles.width,
          }}
        >
          <button
            className='wheel-of-destiny-33kl__canvas-spin-btn bg-alpha position-absolute color-primary shadow'
            onClick={() => spinWheel()}
          >
            <b>Spin</b>
          </button>
          <canvas ref={canvas}></canvas>
          <div
            id='wheel-of-destiny-33kl__canvas-tick'
            className='wheel-of-destiny-33kl__canvas-tick'
          ></div>
        </div>
      </section>
    </>
  );
};

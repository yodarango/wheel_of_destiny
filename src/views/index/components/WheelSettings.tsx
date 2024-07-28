// WheelSettings.tsx
import { wheelColorPalettes as colors } from "../../../data/wheelColorPalettes";
import { useWheelContext } from "../../../context/WheelContextProvider";
import { useState, ChangeEvent } from "react";

// styles
import "./WheelSettings.scss";

export const WheelSettings = () => {
  const {
    handleUpdateSlices: onSlicesChange,
    handleOrderSlices: onOrderChange,
    handleChangeColor: onColorChange,
    handleWheelTitle: onTitleChange,
    handleShuffleSlices: onShuffle,
    state: { wheelTitle: titleInput, wheelThemeId, slicesData: slicesInput },
  } = useWheelContext();
  const [colorPaletteId, setColorPaletteId] = useState(wheelThemeId);
  const [isOrderAtoZ, setIsOrderAtoZ] = useState(true);
  const [openPalettePicker, setOpenPalettePicker] = useState(false);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const slices = e.target.value.split(/\r?\n/);
    onSlicesChange(slices);
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onTitleChange(e.target.value);
  };

  const handleOrderSlices = () => {
    setIsOrderAtoZ(!isOrderAtoZ);
    onOrderChange(!isOrderAtoZ);
  };

  const handleColorChange = (id: number, colors: string[]) => {
    setColorPaletteId(id);
    onColorChange({ colors, id });
  };

  const handleOpenPalettePicker = () => {
    setOpenPalettePicker(!openPalettePicker);
  };

  const slicesValue = slicesInput.join("\n");
  const titleValue = titleInput;

  return (
    <section className='wheel-of-destiny-33kl__input_container'>
      <div className='bg-gamma p-4'>
        <div className='d-flex aling-items-center justify-content-center w-100 mb-4'>
          <div className='w-100 mb-4'>
            <h4 className='fs-4 color-alpha w-100 mb-2'>Enter slices</h4>
            <textarea
              className='w-100 input wheel-of-destiny-33kl__text-area d-block color-alpha bg-beta rounded border-tertiary p-3 w-100 mb-4'
              onChange={handleTextChange}
              value={slicesValue}
            ></textarea>
            <div className='d-flex align-items-center justify-content-start gap-4'>
              <div
                className='d-flex align-items-center justify-content-start gap-2'
                id='randomize-slices-shuffle-09jt'
              >
                <button className='bg-zeta p-1' onClick={onShuffle}>
                  <span className='icon icon-shuffle-outline color-alpha'></span>
                </button>
                <p>Randomize</p>
              </div>

              <div className='d-flex align-items-center justify-content-start gap-2'>
                <button className='bg-zeta p-1' onClick={handleOrderSlices}>
                  <span
                    className={`icon ${
                      isOrderAtoZ
                        ? "icon-chevron-down-outline"
                        : "icon-chevron-up-outline"
                    } color-alpha`}
                  ></span>
                </button>
                <p>{isOrderAtoZ ? "A to Z" : "Z to A"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className='mb-4'>
          <h4 className='fs-4 color-alpha w-100 mb-2'>
            Give this wheel a name
          </h4>
          <input
            className='border-tertiary border p-3 input rounded bg-beta d-block color-alpha w-100'
            onChange={handleTitleChange}
            value={titleValue}
          />
        </div>

        <div className='colors-section'>
          <button
            className='bg-zeta d-flex align-items-center justify-content-start mb-2'
            onClick={handleOpenPalettePicker}
          >
            <h4 className='fs-4 color-alpha w-100'>Choose a palette</h4>
            <span
              className={`icon icon-chevron-forward-outline color-alpha ${
                openPalettePicker ? "open-color-palette" : ""
              }`}
            ></span>
          </button>
          {openPalettePicker && (
            <div className='pallete-container'>
              {colors.map((color) => (
                <div
                  key={color.id}
                  className={`colors-section_hex d-flex align-items-center justify-content-start mb-2 ${
                    colorPaletteId === color.id ? "" : "opacity-20"
                  }`}
                  onClick={() => handleColorChange(color.id, color.colors)}
                >
                  {color.colors.map((hex, index) => (
                    <span
                      key={index}
                      className='d-block'
                      style={{
                        backgroundColor: hex,
                        width: `${100 / color.colors.length}%`,
                      }}
                    ></span>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

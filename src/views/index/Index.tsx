// Index.tsx
import { generateRandomCode } from "../../lib/generateRandomCode";
import { WheelSettings } from "./components/WheelSettings";
import { SavedWheels } from "./components/SavedWheels";
import React, { useState, useEffect } from "react";
import { Wheel } from "./components/Wheel/Wheel";
import { Header } from "./components/Header";
import { TSavedSlices } from "../../types";

const WHEEL_STATUS_UNSAVED = 1;
const WHEEL_STATUS_SAVED = 2;
const WHEEL_STATUS_UPDATING = 3;

const initialWheelColors = [
  "#f8b195",
  "#f67280",
  "#ffc1d3",
  "#d4c0e5",
  "#1d4260",
];

export const Index: React.FC = () => {
  const [wheelStatus, setWheelStatus] = useState<number>(WHEEL_STATUS_UNSAVED);
  const [wheelTitle, setWheelTitle] = useState<string>("WHEEL OF DESTINY 🎡");
  const [currentWheelId, setCurrentWheelId] = useState<string>("");
  const [slicesData, setSlicesData] = useState<string[]>([
    "One",
    "Two",
    "Three",
    "Four",
  ]);
  const [wheelColors, setWheelColors] = useState<string[]>(initialWheelColors);
  const [isWheelSpinning, setIsWheelSpinning] = useState<boolean>(false);
  const [wheelThemeId, setWheelThemeId] = useState<number>(-1);
  const [isShowingSlicesList, setIsShowingSlicesList] =
    useState<boolean>(false);
  const [savedSlices, setSavedSlices] = useState<TSavedSlices>({});

  useEffect(() => {
    getLocalStorageData();
  }, []);

  // gets the data from the local storage
  const getLocalStorageData = () => {
    const lastWheelUsed = localStorage.getItem("wod__last-wheel-used");
    const wheelsSaved = localStorage.getItem("wod__wheels-saved");
    if (lastWheelUsed && wheelsSaved) {
      const wheelsSavedObj = JSON.parse(wheelsSaved);
      const findWheelSaved = wheelsSavedObj[lastWheelUsed];

      setWheelColors(findWheelSaved.colors || initialWheelColors);
      setSlicesData(findWheelSaved.slices);
      setWheelTitle(findWheelSaved.title);
      setWheelThemeId(findWheelSaved.themeId);
      setWheelStatus(WHEEL_STATUS_SAVED);
      setCurrentWheelId(lastWheelUsed);
      setSavedSlices(wheelsSavedObj);
    } else {
      setCurrentWheelId(generateRandomCode());
    }
  };

  // updates the slices of the wheel
  const handleUpdateSlices = (slices: string[]) => {
    setSlicesData(slices);
    handleUpdateWheelStatus(currentWheelId);
  };

  // updates the title of the wheels
  const handleWheelTitle = (title: string) => {
    setWheelTitle(title);
    handleUpdateWheelStatus(currentWheelId);
  };

  // saves the current wheel on the screen
  const handleSave = () => {
    const wheelsSaved = localStorage.getItem("wod__wheels-saved");
    const newWheel = {
      themeId: wheelThemeId,
      colors: wheelColors,
      slices: slicesData,
      title: wheelTitle,
    };

    let wheelToSave: Record<string, any> = {};

    if (wheelsSaved) {
      const wheelsSavedObj = JSON.parse(wheelsSaved);
      wheelToSave = wheelsSavedObj;
    }
    // else {
    //   wheelToSave[`currentWheelId`] = newWheel;
    // }
    wheelToSave[currentWheelId] = newWheel;
    localStorage.setItem("wod__wheels-saved", JSON.stringify(wheelToSave));
    localStorage.setItem("wod__last-wheel-used", currentWheelId);
    setWheelStatus(WHEEL_STATUS_SAVED);
    setSavedSlices(wheelToSave);
  };

  // creates a new wheel but does not saves it
  const handleCreateNewWheel = () => {
    setCurrentWheelId(generateRandomCode());
    setSlicesData(["One", "Two", "Three", "Four"]);
    setWheelStatus(WHEEL_STATUS_UNSAVED);
    setWheelTitle("WHEEL OF DESTINY 🎡");
    setWheelColors(initialWheelColors);
    setWheelThemeId(-1);
  };

  // selects a saved wheel from the list
  const handleSelectASavedWheel = (data: {
    id: string;
    title: string;
    slices: string[];
    colors: string[];
  }) => {
    setIsShowingSlicesList(!isShowingSlicesList);
    setCurrentWheelId(data.id);
    setWheelTitle(data.title);
    setSlicesData(data.slices);
    setWheelStatus(WHEEL_STATUS_SAVED);
    setWheelColors(data.colors);
    localStorage.setItem("wod__last-wheel-used", data.id);
  };

  // orders the slices from A to Z or Z to A
  const handleOrderSlices = (isOrderAtoZ: boolean) => {
    const sortedSlices = [...slicesData].sort((a, b) =>
      isOrderAtoZ ? a.localeCompare(b) : b.localeCompare(a)
    );
    setSlicesData(sortedSlices);
    handleUpdateWheelStatus(currentWheelId);
  };

  // shuffles the slices
  const handleShuffleSlices = () => {
    const shuffledSlices = [...slicesData];
    for (let i = shuffledSlices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledSlices[i], shuffledSlices[j]] = [
        shuffledSlices[j],
        shuffledSlices[i],
      ];
    }
    setSlicesData(shuffledSlices);
    handleUpdateWheelStatus(currentWheelId);
  };

  // updates the wheel status
  const handleUpdateWheelStatus = (wheelId: string) => {
    const wheelsSaved = localStorage.getItem("wod__wheels-saved");
    if (wheelsSaved) {
      const wheelsSavedObj = JSON.parse(wheelsSaved);
      const findWheelSaved = wheelsSavedObj[wheelId];
      setWheelStatus(
        findWheelSaved ? WHEEL_STATUS_UPDATING : WHEEL_STATUS_UNSAVED
      );
    }
  };

  // changes the color palette of the wheel
  const handleChangeColor = (data: { colors: string[]; id: number }) => {
    setWheelColors(data.colors);
    setWheelThemeId(data.id);
    handleUpdateWheelStatus(currentWheelId);
  };

  // removes a slice from the text area
  const handleRemoveItemFromList = (index: number) => {
    const newSlices = slicesData.filter((_, i) => i !== index);
    setSlicesData(newSlices);
    handleUpdateWheelStatus(currentWheelId);
  };

  // remove a wheel from the saved list
  const handleRemoveWheel = (id: string) => {
    const wheelsSaved = localStorage.getItem("wod__wheels-saved");
    if (wheelsSaved) {
      const wheelsSavedObj = JSON.parse(wheelsSaved);
      delete wheelsSavedObj[id];
      localStorage.setItem("wod__wheels-saved", JSON.stringify(wheelsSavedObj));

      // remove last wheel used if it was the one removed
      const lastWheelUsed = localStorage.getItem("wod__last-wheel-used");
      if (lastWheelUsed === id) {
        localStorage.removeItem("wod__last-wheel-used");
      }
      handleCreateNewWheel();
    }

    // remove the wheel from the saved list
    const newSavedSlices = { ...savedSlices };
    delete newSavedSlices[id];
    setSavedSlices(newSavedSlices);
  };

  return (
    <section>
      <Header
        onShowFolders={() => setIsShowingSlicesList(!isShowingSlicesList)}
        onRemove={() => handleRemoveWheel(currentWheelId)}
        onCreateNew={handleCreateNewWheel}
        wheelStatus={wheelStatus}
        wheelTitle={wheelTitle}
        onUpdate={handleSave}
        onSave={handleSave}
      />
      <div className='wheel-of-destiny-33kl__container d-flex align-items-start justify-content-start m-auto'>
        {isShowingSlicesList ? (
          <SavedWheels
            onClose={() => setIsShowingSlicesList(!isShowingSlicesList)}
            onSelect={handleSelectASavedWheel}
            onRemove={handleRemoveWheel}
            slices={savedSlices}
          />
        ) : (
          <WheelSettings
            onSlicesChange={handleUpdateSlices}
            onOrderChange={handleOrderSlices}
            onColorChange={handleChangeColor}
            onTitleChange={handleWheelTitle}
            onShuffle={handleShuffleSlices}
            colorPaletteId={wheelThemeId}
            slicesInput={slicesData}
            titleInput={wheelTitle}
          />
        )}
        <Wheel
          onUpdateWheelSpinning={setIsWheelSpinning}
          onRemoveItem={handleRemoveItemFromList}
          isWheelSpinning={isWheelSpinning}
          wheelColors={wheelColors}
          slicesData={slicesData}
        />
      </div>
    </section>
  );
};

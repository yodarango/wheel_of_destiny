// Index.tsx
import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Wheel } from "./components/Wheel/Wheel";
import { WheelSettings } from "./components/WheelSettings";
import { SlicesList } from "./components/SlicesList";
import { generateRandomCode } from "../../lib/generateRandomCode";

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

type Slice = {
  title: string;
  slices: string[];
};

type SavedSlices = {
  [key: string]: Slice;
};

export const Index: React.FC = () => {
  const [currentWheelId, setCurrentWheelId] = useState<string>("");
  const [wheelTitle, setWheelTitle] = useState<string>("WHEEL OF DESTINY 🎡");
  const [wheelStatus, setWheelStatus] = useState<number>(WHEEL_STATUS_UNSAVED);
  const [slicesData, setSlicesData] = useState<string[]>([
    "One",
    "Two",
    "Three",
    "Four",
  ]);
  const [wheelThemeId, setWheelThemeId] = useState<number>(-1);
  const [isWheelSpinning, setIsWheelSpinning] = useState<boolean>(false);
  const [wheelColors, setWheelColors] = useState<string[]>(initialWheelColors);
  const [isShowingSlicesList, setIsShowingSlicesList] =
    useState<boolean>(false);
  const [savedSlices, setSavedSlices] = useState<SavedSlices>({});

  useEffect(() => {
    getLocalStorageData();
  }, []);

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

  const handleUpdateSlices = (slices: string[]) => {
    setSlicesData(slices);
    handleUpdateWheelStatus(currentWheelId);
  };

  const handleWheelTitle = (title: string) => {
    setWheelTitle(title);
    handleUpdateWheelStatus(currentWheelId);
  };

  const handleSave = () => {
    const wheelsSaved = localStorage.getItem("wod__wheels-saved");
    const newWheel = {
      slices: slicesData,
      title: wheelTitle,
      colors: wheelColors,
      themeId: wheelThemeId,
    };

    if (wheelsSaved) {
      const wheelsSavedObj = JSON.parse(wheelsSaved);
      wheelsSavedObj[currentWheelId] = newWheel;
      localStorage.setItem("wod__wheels-saved", JSON.stringify(wheelsSavedObj));
      localStorage.setItem("wod__last-wheel-used", currentWheelId);
    } else {
      const wheelsSavedObj = {
        [currentWheelId]: newWheel,
      };
      localStorage.setItem("wod__wheels-saved", JSON.stringify(wheelsSavedObj));
      localStorage.setItem("wod__last-wheel-used", currentWheelId);
    }

    setWheelStatus(WHEEL_STATUS_SAVED);
  };

  const handleCreateNewWheel = () => {
    setCurrentWheelId(generateRandomCode());
    setSlicesData(["One", "Two", "Three", "Four"]);
    setWheelStatus(WHEEL_STATUS_UNSAVED);
    setWheelTitle("WHEEL OF DESTINY 🎡");
    setWheelColors(initialWheelColors);
    setWheelThemeId(-1);
  };

  const handleSelectASavedWheel = (data: {
    id: string;
    title: string;
    slices: string[];
  }) => {
    setIsShowingSlicesList(!isShowingSlicesList);
    setCurrentWheelId(data.id);
    setWheelTitle(data.title);
    setSlicesData(data.slices);
    setWheelStatus(WHEEL_STATUS_SAVED);
    localStorage.setItem("wod__last-wheel-used", data.id);
  };

  const handleOrderSlices = (isOrderAtoZ: boolean) => {
    const sortedSlices = [...slicesData].sort((a, b) =>
      isOrderAtoZ ? a.localeCompare(b) : b.localeCompare(a)
    );
    setSlicesData(sortedSlices);
    handleUpdateWheelStatus(currentWheelId);
  };

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

  const handleChangeColor = (data: { colors: string[]; id: number }) => {
    setWheelColors(data.colors);
    setWheelThemeId(data.id);
    handleUpdateWheelStatus(currentWheelId);
  };

  return (
    <section>
      <Header
        onShowFolders={() => setIsShowingSlicesList(!isShowingSlicesList)}
        onCreateNew={handleCreateNewWheel}
        onRemove={handleCreateNewWheel}
        wheelStatus={wheelStatus}
        wheelTitle={wheelTitle}
        onUpdate={handleSave}
        onSave={handleSave}
      />
      <div className='wheel-of-destiny-33kl__container d-flex align-items-start justify-content-start m-auto'>
        {isShowingSlicesList ? (
          <SlicesList
            onClose={() => setIsShowingSlicesList(!isShowingSlicesList)}
            onSelect={handleSelectASavedWheel}
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
          isWheelSpinning={isWheelSpinning}
          wheelColors={wheelColors}
          slicesData={slicesData}
        />
      </div>
    </section>
  );
};

// WheelContext.tsx
import React, { useState, useEffect, ReactNode } from "react";
import { generateRandomCode } from "../lib/generateRandomCode";
import { WheelContext, defaultWheelColors } from "./WheelContext";
import { TSavedSlices, TSlice } from "../types";

const WHEEL_STATUS_UNSAVED = 1;
const WHEEL_STATUS_SAVED = 2;
const WHEEL_STATUS_UPDATING = 3;

export const WheelContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [wheelStatus, setWheelStatus] = useState<number>(WHEEL_STATUS_UNSAVED);
  const [wheelTitle, setWheelTitle] = useState<string>("WHEEL OF DESTINY 🎡");
  const [currentWheelId, setCurrentWheelId] = useState<string>("");
  const [slicesData, setSlicesData] = useState<string[]>([
    "One",
    "Two",
    "Three",
    "Four",
  ]);
  const [wheelColors, setWheelColors] = useState<string[]>(defaultWheelColors);
  const [isWheelSpinning, setIsWheelSpinning] = useState<boolean>(false);
  const [wheelThemeId, setWheelThemeId] = useState<number>(-1);
  const [isShowingWheelsList, setIsShowingWheelsList] =
    useState<boolean>(false);
  const [savedSlices, setSavedSlices] = useState<TSavedSlices>(
    {} as TSavedSlices
  );

  useEffect(() => {
    getLocalStorageData();
  }, []);

  const getLocalStorageData = () => {
    const lastWheelUsed = localStorage.getItem("wod__last-wheel-used");
    const wheelsSaved = localStorage.getItem("wod__wheels-saved");
    if (lastWheelUsed && wheelsSaved) {
      const wheelsSavedObj = JSON.parse(wheelsSaved);
      const findWheelSaved = wheelsSavedObj[lastWheelUsed];

      setWheelThemeId(findWheelSaved.themeId);
      setWheelColors(findWheelSaved.colors);
      setSlicesData(findWheelSaved.slices);
      setWheelTitle(findWheelSaved.title);
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
    wheelToSave[currentWheelId] = newWheel;
    localStorage.setItem("wod__wheels-saved", JSON.stringify(wheelToSave));
    localStorage.setItem("wod__last-wheel-used", currentWheelId);
    setWheelStatus(WHEEL_STATUS_SAVED);
    setSavedSlices(wheelToSave);
  };

  const handleCreateNewWheel = () => {
    setCurrentWheelId(generateRandomCode());
    setSlicesData(["One", "Two", "Three", "Four"]);
    setWheelStatus(WHEEL_STATUS_UNSAVED);
    setWheelTitle("WHEEL OF DESTINY 🎡");
    setWheelColors(defaultWheelColors);
    setWheelThemeId(-1);
  };

  const handleSelectASavedWheel = (data: TSlice) => {
    setIsShowingWheelsList(!isShowingWheelsList);
    setCurrentWheelId(data.id);
    setWheelTitle(data.title);
    setWheelStatus(WHEEL_STATUS_SAVED);
    setSlicesData(data.slices);
    setWheelColors(data.colors);
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

  const handleRemoveItemFromList = (index: number) => {
    const newSlices = slicesData.filter((_, i) => i !== index);
    handleUpdateSlices(newSlices);
    // setSlicesData(newSlices);
    // handleUpdateWheelStatus(currentWheelId);
  };

  const handleRemoveWheel = (id: string) => {
    const wheelsSaved = localStorage.getItem("wod__wheels-saved");
    if (wheelsSaved) {
      const wheelsSavedObj = JSON.parse(wheelsSaved);
      delete wheelsSavedObj[id];
      localStorage.setItem("wod__wheels-saved", JSON.stringify(wheelsSavedObj));

      const lastWheelUsed = localStorage.getItem("wod__last-wheel-used");
      if (lastWheelUsed === id) {
        localStorage.removeItem("wod__last-wheel-used");
      }
      handleCreateNewWheel();
    }

    const newSavedSlices = { ...savedSlices };
    delete newSavedSlices[id];
    setSavedSlices(newSavedSlices);
  };

  const handleToggleSpinningWheel = (value: boolean) => {
    setIsWheelSpinning(value);
  };

  const handleToggleShowWheelsList = () => {
    setIsShowingWheelsList(!isShowingWheelsList);
  };

  return (
    <WheelContext.Provider
      value={{
        state: {
          wheelStatus,
          wheelTitle,
          currentWheelId,
          slicesData,
          wheelColors,
          isWheelSpinning,
          wheelThemeId,
          isShowingWheelsList,
          savedSlices,
        },
        handleToggleShowWheelsList,
        handleToggleSpinningWheel,
        handleSelectASavedWheel,
        handleRemoveItemFromList,
        handleCreateNewWheel,
        handleShuffleSlices,
        handleUpdateSlices,
        handleChangeColor,
        handleOrderSlices,
        handleWheelTitle,
        handleRemoveWheel,
        handleSave,
      }}
    >
      {children}
    </WheelContext.Provider>
  );
};

export const useWheelContext = () => {
  const context = React.useContext(WheelContext);
  if (!context) {
    throw new Error("useWheelContext must be used within a WheelProvider");
  }
  return context;
};

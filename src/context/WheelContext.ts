import { createContext } from "react";
import { TSlice } from "../types";

export const defaultWheelColors = [
  "#f8b195",
  "#f67280",
  "#ffc1d3",
  "#d4c0e5",
  "#1d4260",
];

export const defaultState = {
  slicesData: ["One", "Two", "Three", "Four"],
  wheelColors: defaultWheelColors,
  wheelTitle: "WHEEL OF DESTINY 🎡",
  isShowingWheelsList: false,
  isWheelSpinning: false,
  currentWheelId: "",
  wheelThemeId: -1,
  savedSlices: {},
  wheelStatus: 1,
};

export type TWheelContext = {
  state: {
    isShowingWheelsList: boolean; // opens the drawer that shows the list of saved wheels
    currentWheelId: string; // the current selected wheel
    isWheelSpinning: false; // if the wheel is spinning
    wheelColors: string[]; // the selected colors of the wheel. Probably should get rid of this and handle it with the themeId
    slicesData: string[]; // the strings that will be displayed in the wheel
    wheelThemeId: number; // the selected theme of the wheel
    isWheelSaved: number; // whether the wheel is saved or not
    wheelTitle: string; // the title of the wheel
    savedSlices: {}; // the saved slices to local storage
  };
  handleChangeColor: (data: { colors: string[]; id: number }) => {};
  handleOrderSlices: (isOrderAtoZ: boolean) => {};
  handleRemoveItemFromList: (index: number) => {};
  handleSelectASavedWheel: (slice: TSlice) => {};
  handleUpdateSlices: (slices: string[]) => {};
  handleWheelTitle: (title: string) => {};
  handleRemoveWheel: (id: string) => {};
  handleToggleShowWheelsList: () => {};
  handleToggleSpinningWheel: () => {};
  handleCreateNewWheel: () => {};
  handleShuffleSlices: () => {};
  handleSave: () => {};
};

export const defaultContext = {
  state: defaultState,
  handleChangeColor: (_: { colors: string[]; id: number }) => {},
  handleSelectASavedWheel: (_: TSlice) => {},
  handleRemoveItemFromList: (_: number) => {},
  handleUpdateSlices: (_: string[]) => {},
  handleOrderSlices: (_: boolean) => {},
  handleRemoveWheel: (_: string) => {},
  handleToggleShowWheelsList: () => {},
  handleToggleSpinningWheel: () => {},
  handleWheelTitle: (_: string) => {},
  handleCreateNewWheel: () => {},
  handleShuffleSlices: () => {},
  handleSave: () => {},
};

export const WheelContext = createContext(defaultContext);

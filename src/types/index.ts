export type TSlice = {
  themeId: number;
  colors: string[];
  slices: string[];
  title: string;
  id: string;
};

export type TSavedSlices = {
  [key: string]: TSlice;
};

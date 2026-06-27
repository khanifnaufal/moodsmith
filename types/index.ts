export type FontPairing = {
  id: string;
  heading: string;
  body: string;
  mood: string[];
  googleFontsUrl: string;
};

export type ColorPalette = {
  name: string;
  colors: string[]; // array of 5 hex codes
};

export type MoodResult = {
  palette: ColorPalette;
  font: FontPairing;
  moodInput: string;
  createdAt: string;
  id: string;
};

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

export type TemplatePalette = {
  id: string;
  name: string;
  inspiredBy: string;
  colors: string[]; // 5 hex
  fontId: string; // refer ke id di FONT_PAIRINGS
  description: string;
};

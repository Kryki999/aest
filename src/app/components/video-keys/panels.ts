export type Panel = {
  title: string;
  subtitle: string;
  image: string;
  video: string;
  shiftClass: string;
};

export const PANELS: Panel[] = [
  {
    title: "HELLFIELD, MACIAS - Fendi RMX",
    subtitle: "Klip Muzyczny",
    image: "https://image.mux.com/BSGBcuzgEiulmCqZi6L6wxg6uUuxP1zJ3fcTnQ402y5Y/thumbnail.jpg",
    video: "https://stream.mux.com/BSGBcuzgEiulmCqZi6L6wxg6uUuxP1zJ3fcTnQ402y5Y.m3u8",
    shiftClass: "-translate-y-5",
  },
  {
    title: "Ace Dean - Do Rana",
    subtitle: "Klip Muzyczny",
    image: "https://image.mux.com/GDQazxEbxbhCohMMwurmMreTzkZJnCEdpgbm3oCeF1c/thumbnail.jpg",
    video: "https://stream.mux.com/GDQazxEbxbhCohMMwurmMreTzkZJnCEdpgbm3oCeF1c.m3u8",
    shiftClass: "translate-y-0",
  },
  {
    title: "Cleo, Margarita, Martirenti - DOM",
    subtitle: "Klip Muzyczny",
    image: "https://image.mux.com/7IrKgRphrIL1nMr2JqIgBw2AgnQxuk4dHQobDketA8c/thumbnail.jpg",
    video: "https://stream.mux.com/7IrKgRphrIL1nMr2JqIgBw2AgnQxuk4dHQobDketA8c.m3u8",
    shiftClass: "translate-y-5",
  },
  {
    title: "Vin Vinci & Stecu ft Amster - MORDOR",
    subtitle: "Klip Muzyczny",
    image: "https://image.mux.com/9CVKhvqqfDqU6VUJSey013yrJT66zlwT77ASHqPyjwyQ/thumbnail.jpg",
    video: "https://stream.mux.com/9CVKhvqqfDqU6VUJSey013yrJT66zlwT77ASHqPyjwyQ.m3u8",
    shiftClass: "translate-y-0",
  },
  {
    title: "HELLFIELD, DIVIX - Ale Ale",
    subtitle: "Klip Muzyczny",
    image: "/alealehd.webp",
    video: "https://stream.mux.com/hYMbdGGUQP8XU31Hr63Aha5lBjrAfSswz9txpfGmlRI.m3u8",
    shiftClass: "-translate-y-5",
  },
  {
    title: "HELLFIELD, MACIAS - Fendi RMX",
    subtitle: "Klip Muzyczny",
    image: "https://image.mux.com/BSGBcuzgEiulmCqZi6L6wxg6uUuxP1zJ3fcTnQ402y5Y/thumbnail.jpg",
    video: "https://stream.mux.com/BSGBcuzgEiulmCqZi6L6wxg6uUuxP1zJ3fcTnQ402y5Y.m3u8",
    shiftClass: "-translate-y-5",
  },
  {
    title: "Ace Dean - Do Rana",
    subtitle: "Klip Muzyczny",
    image: "https://image.mux.com/GDQazxEbxbhCohMMwurmMreTzkZJnCEdpgbm3oCeF1c/thumbnail.jpg",
    video: "https://stream.mux.com/GDQazxEbxbhCohMMwurmMreTzkZJnCEdpgbm3oCeF1c.m3u8",
    shiftClass: "translate-y-0",
  },
  {
    title: "Cleo, Margarita, Martirenti - DOM",
    subtitle: "Klip Muzyczny",
    image: "https://image.mux.com/7IrKgRphrIL1nMr2JqIgBw2AgnQxuk4dHQobDketA8c/thumbnail.jpg",
    video: "https://stream.mux.com/7IrKgRphrIL1nMr2JqIgBw2AgnQxuk4dHQobDketA8c.m3u8",
    shiftClass: "translate-y-5",
  },
  {
    title: "Vin Vinci & Stecu ft Amster - MORDOR",
    subtitle: "Klip Muzyczny",
    image: "https://image.mux.com/9CVKhvqqfDqU6VUJSey013yrJT66zlwT77ASHqPyjwyQ/thumbnail.jpg",
    video: "https://stream.mux.com/9CVKhvqqfDqU6VUJSey013yrJT66zlwT77ASHqPyjwyQ.m3u8",
    shiftClass: "translate-y-0",
  },
];

export const MULTI_TRACK_COUNT = 9;
export const SWIPE_THRESHOLD_PX = 40;
export const HERO_MOBILE_STAGGER_PATTERN = [0, 14, -14, 0, -14];
export const HERO_MOBILE_STAGGER_PAD_PX = 18;
export const VERTICAL_GESTURE_TOLERANCE_PX = 10;

export const mod = (n: number, m: number) => ((n % m) + m) % m;

export const tileLayoutId = (idx: number) => `video-keys-tile-${idx}`;

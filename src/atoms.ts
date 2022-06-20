import { atom } from "recoil";

export const indexState = atom({
  key: "index",
  default: 0,
});

export const arState = atom({
  key: "arrId",
  default: [],
});

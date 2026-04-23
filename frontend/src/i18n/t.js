import { bg } from "./bg";

const dict = bg;

export function t(path) {
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), dict) ?? path;
}
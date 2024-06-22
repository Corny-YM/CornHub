import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isUndefined(value: any): boolean {
  return typeof value === "undefined";
}

export function isValidURL(url: string) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

export const getRelativeTime = (date: Date, suffix = true) => {
  const now = new Date().getTime();
  const past = new Date(date).getTime();
  const diffInSeconds = Math.floor((now - past) / 1000);

  const units = [
    { name: "năm", value: 31536000 }, // 60 * 60 * 24 * 365
    { name: "tháng", value: 2592000 }, // 60 * 60 * 24 * 30
    { name: "ngày", value: 86400 }, // 60 * 60 * 24
    { name: "giờ", value: 3600 }, // 60 * 60
    { name: "phút", value: 60 },
    { name: "giây", value: 1 },
  ];

  for (let unit of units) {
    const quotient = Math.floor(diffInSeconds / unit.value);
    if (quotient > 0) {
      if (!suffix) return `${quotient} ${unit.name}`;
      return `${quotient} ${unit.name} trước`;
    }
  }

  return "vừa xong"; // Just now
};

export const formatDate = (
  value: Date | string,
  seperator = "/",
  suffix = true
) => {
  if (!value) return "---";
  const date = new Date(value);
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  const month =
    date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const minute =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  const formattedDate = `${day}${seperator}${month}${seperator}${year}`;
  const formattedHour = `${hour}:${minute}`;
  if (!suffix) return formattedDate;
  return `${formattedDate} ${formattedHour}`;
};

export const formatToLocaleDate = (str: string | Date) => {
  const date = new Date(str);

  const datePart = date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  const timePart = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${datePart}, ${timePart}`;
};

export const formatAmounts = (viewCount: number, fixed: number = 1) => {
  let result = "";
  if (viewCount <= 0) return 0;
  if (viewCount < 1000) {
    result = viewCount.toString();
  } else if (viewCount < 1000000) {
    result = (viewCount / 1000).toFixed(fixed) + " N";
  } else if (viewCount < 1000000000) {
    result = (viewCount / 1000000).toFixed(fixed) + " Tr";
  } else {
    result = (viewCount / 1000000000).toFixed(fixed) + " T";
  }
  return result.replace(".", ",");
};

export const getRandomItems = <T>(arr: T[], num: number = 3): T[] => {
  // Create a shallow copy of the array to avoid modifying the original array
  const shuffled = arr.slice();

  // Shuffle the array using the Fisher-Yates algorithm
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // swap item value
  }

  // Return the first 'num' items from the shuffled array
  return shuffled.slice(0, num);
};

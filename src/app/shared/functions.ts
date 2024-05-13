import { timer } from "rxjs";

export const checkRoute = (originalUrl: string, patternUrl: string | RegExp) => {
  if (typeof patternUrl === 'string') {
    return originalUrl.includes(patternUrl);
  } else {
    return patternUrl.test(originalUrl);
  }
}

export const capitalizeFirstLetterWord = (orignalWord: string) => {
  const wordDivision = orignalWord.split(' ');
  const firstWord: string | any = wordDivision.shift();
  const wordCapitalize = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
  return `${wordCapitalize} ${wordDivision.map((word: string) => word.toLowerCase()).join(' ')}`;
}

export const createTimer = (timerInMilliseconds: number, action: Function) => {
  const snackbarTime = timerInMilliseconds;
  timer(snackbarTime).subscribe(_ => action());
}

export const getLocalStorage = (key: string) => {
  return localStorage.getItem(key);
}

export const setLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
}

export const deleteLocalStorage = (key: string) => {
  localStorage.removeItem(key);
}

export const getToken = (): any => {
  return getLocalStorage('token');
}

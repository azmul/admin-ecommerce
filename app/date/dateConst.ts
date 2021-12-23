/**
 * Different formats for dates and times
 * @readonly
 * @enum {number}
 */
export const DateFormats = Object.freeze({
  API_DATE: "YYYY-MM-DD",
  API_DATE_TIME: "YYYY-MM-DD hh:mm:ss",
  API_TIME: "HH:mm:ss",
  API_YEAR_MONTH: "YYYY-MM",
  API_YEAR: "YYYY",
  DATE_TIME: "LL, h:mm:ss A",
  DAILY_FORMAT: "DD-MM-YYYY",
  DATE: "LL",
  MONTH_NAME: "MMMM",
  TIMESHEET_DATE: "Do MMMM YYYY",
  WEEK_DAY: "dddd",
  DAY: "DD",
  MONTH: "MM",
});

/**
 * These match the weekday we get back from the api
 * sunday: index 0
 * saturday: index 6
 * matches moment().day() // not locale aware, which is exactly what we want
 */
export const WorkdayOptions = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const WorkdayOptionsStartWithMonday = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

/**
 * The options for first work day of the week
 */
export const FirstWorkdayOptions = ["sunday", "monday"];

/** The required inclusive minimun and maximum hours for a work day */
export enum WorkHours {
  MIN = 0,
  MAX = 24,
}

/**
 * Periods
 * @readonly
 * @enum {string}
 */
export enum Periods {
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
  DATE = "date",
  ALL = "alltime",
  CUSTOM = "custom",
  DAY = "day",
}

/**
 * Months
 * @readonly
 * @enum {string}
 */
export enum Months {
  JANUARY = "january",
  FEBRUARY = "february",
  MARCH = "march",
  APRIL = "april",
  MAY = "may",
  JUNE = "june",
  JULY = "july",
  AUGUST = "august",
  SEPTEMBER = "september",
  OCTOBER = "october",
  NOVEMBER = "november",
  DECEMBER = "december",
}

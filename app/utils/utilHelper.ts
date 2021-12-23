import { isArray, isEqual } from "lodash";
import qs from "query-string";

export class UtilHelper {
  /**
   * Remove all undefined and empty values from object
   */
  static removeUndefined(values: any | undefined) {
    if (!values) {
      return values;
    }
    if (values.q !== undefined) {
      if (isArray(values.q)) {
        values.q = values.q.join("");
      }
      if (values.q.replace(/\s/g, "") === "") {
        values.q = null;
      }
    }
    Object.keys(values).forEach(
      key =>
        (values[key] == null || values[key].length === 0) && delete values[key]
    );
    return values;
  }

  /**
   * Check if string has number
   * @returns {boolean}
   */
  static hasNumber(string: string) {
    return /\d/.test(string);
  }

  /**
   * Check if a value is a number
   * @returns {boolean}
   */
  static isNumber(value: any) {
    return !Number.isNaN(Number(value));
  }

  /** Check is the value an empty array */
  static isEmptyArray = (value: any[]) =>
    Array.isArray(value) && value.length === 0;

  static sortByName = (a: { name: string }, b: { name: string }) => {
    return (a.name && a.name.toLowerCase()) < (b.name && b.name.toLowerCase())
      ? -1
      : 1;
  };
}

/**
 * Parse value to a fixed number of decimals
 * * Default decimals 0
 */
export const toDecimal = (value: number, decimals: number = 0) => {
  return parseFloat(value.toFixed(decimals));
};

/**
 * Check file Url is valid
 *
 * @param fileUrl {String}
 * @returns {boolean}
 */

export const checkFileUrlValid = (fileUrl: string) => {
  const pattern = new RegExp(
    /(http:\/\/|https:\/\/)[a-z0-9]+([\]{1}[a-z0-9]+)*[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/g
  );
  return pattern.test(fileUrl);
};

/**
 * Updates query string with new values. This function doesn't emit
 * event to the global react router history.
 *
 * @param {{}} values object with new parameters
 */
export const updateQueryString = (values: {}) => {
  /** get current search */
  const currentSearch = qs.parse(window.location.search, {
    arrayFormat: "comma",
  });
  /** merge current search with new values */
  values = {
    ...currentSearch,
    ...values,
  };
  /** Update query string only if search params changed */
  if (!isEqual(UtilHelper.removeUndefined(values), currentSearch)) {
    /** forming new path with parameters */
    const searchParams = qs.stringify(values, { arrayFormat: "comma" });
    const newPath = searchParams.length ? `?${searchParams}` : "";
    /** push new query to history */
    window.history.pushState(null, "", newPath);
  }
};

export const updateGlobalQueryString = (
  values: {},
  location: any,
  history: any
) => {
  /** get current search */
  const currentSearch = qs.parse(location.search, {
    arrayFormat: "comma",
  });
  /** merge current search with new values */
  values = {
    ...currentSearch,
    ...values,
  };
  /** Update query string only if search params changed */
  if (!isEqual(UtilHelper.removeUndefined(values), currentSearch)) {
    history.push({
      pathname: location.pathname,
      search: qs.stringify(values, { arrayFormat: "comma" }),
    });
  }
};

export const getCSSValue = (value: string) => Number(value.replace(/\D/g, ""));

/**
 * Remove commas from a string
 */
export const removeCommas = (value: string) => {
  return value.split(",").join("");
};

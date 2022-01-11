/** Version parameter for endpoint URL */
const VERSION_URL = "v1";
const API = VERSION_URL + "/api"

/** Private endpoint URLs */
const ADMIN = API + "/admin";
const CATEGORY = API + "/category";
const TAG = API + "/tag";
const SLIDER = API + "/slider";
const TESTIMONIAL = API + "/testimonial";
const IMAGE = API + "/image";
const PRODUCTS = API + "/products";
const PATIENT = API + "/patient";
const MESSAGES = API + "/messages";
const ORDERS = API + "/orders";

/**
 * Enum with all api endpoints
 * @readonly
 * @enum {string}
 */
export const Endpoints = Object.freeze({
  ADMIN: ADMIN,
  CATEGORY: CATEGORY,
  TAG: TAG,
  SLIDER: SLIDER,
  TESTIMONIAL: TESTIMONIAL,
  IMAGE: IMAGE,
  PRODUCTS: PRODUCTS,
  PATIENT: PATIENT,
  MESSAGES: MESSAGES,
  ORDERS: ORDERS,
  PATIENT_ADMIN: PATIENT + "/admin",
  ADMIN_PHONE_VERIFY: ADMIN + "/verify",
  ADMIN_REGISTER: ADMIN + "/register",
  ADMIN_LOGIN: ADMIN + "/login",
  ADMIN_RECOVER_VERIFY: ADMIN + "/recover/verify",
  ADMIN_RECOVER_PASSWORD: ADMIN + "/recover/password",
  ADMIN_PASSWORD_CHANGED: ADMIN + "/password/change",
});

/**
 * API response status codes enum
 * @readonly
 * @enum {number}
 */
export const ResponseStatus = Object.freeze({
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  UNAUTHORIZED: 401,
  ERROR_RESPONSE: 412,
  NOT_FOUND: 404,
});

/**
 * API can in some cases format the data:
 * * Objects: List of objects (recommended)
 * * Table: Table format with headers and rows (not recommended)
 */
export const APIDataFormat = Object.freeze({
  OBJECTS: "objects",
  TABLE: "table",
  XLSX: "xlsx",
});

/**
 * Some path segment text for API
 * * Objects: List of objects (recommended)
 */
export const APIPathSegment = Object.freeze({
  USERS: "users",
});

/**
 * Default amount of record per page from API
 *
 */
export const DEFAULT_RESULTS_PER_PAGE = 20;
export const DEFAULT_ALL_RESULTS_PER_PAGE = 50;
export const PER_PAGE_SIZE = 20;
export const INIITIAL_LOAD_SIZE = 5;

export const DEFAULT_API_PARAMS = {
  limit: DEFAULT_RESULTS_PER_PAGE,
  page: 1,
};

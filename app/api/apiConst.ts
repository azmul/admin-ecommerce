/** Version parameter for endpoint URL */
const VERSION_URL = "v1";
const API = VERSION_URL + "/api"

/** Private endpoint URLs */
const ADMIN = API + "/admin";
const LINK = API + "/link";
const PATIENT = API + "/patient";
const HOMEOPATHY = API + "/homeopathy"
const HOMEOPATHY_DOCTOR = API + "/homeopathy/doctor";
const HOMEOPATHY_MEDICINE = API + "/homeopathy/medicine";
const HOMEOPATHY_DOCTOR_SCHEDULE = HOMEOPATHY_DOCTOR + "/schedule";
const HOMEOPATHY_APPOINTMENT = HOMEOPATHY + "/appointment";

const AYURVEDIC_DOCTOR = API + "/ayurvedic/doctor";

/**
 * Enum with all api endpoints
 * @readonly
 * @enum {string}
 */
export const Endpoints = Object.freeze({
  ADMIN: ADMIN,
  LINK: LINK,
  LINK_COUNT: LINK + "/count",
  PATIENT: PATIENT,
  PATIENT_ADMIN: PATIENT + "/admin",
  HOMEOPATHY_DOCTOR: HOMEOPATHY_DOCTOR,
  HOMEOPATHY_DOCTOR_ADMIN: HOMEOPATHY_DOCTOR + "/admin",
  HOMEOPATHY_DOCTOR_SCHEDULE: HOMEOPATHY_DOCTOR_SCHEDULE,
  HOMEOPATHY_DOCTOR_SCHEDULE_BOOKED: HOMEOPATHY_DOCTOR_SCHEDULE + "/booked",
  HOMEOPATHY_APPOINTMENT: HOMEOPATHY_APPOINTMENT,
  HOMEOPATHY_MEDICINE: HOMEOPATHY_MEDICINE,
  HOMEOPATHY_MEDICINE_ADMIN: HOMEOPATHY_MEDICINE + "/admin",
  HOMEOPATHY_MEDICINE_ORDER: HOMEOPATHY_MEDICINE + "/order",
  HOMEOPATHY_ADMIN_APPOINTMENT: HOMEOPATHY_APPOINTMENT + "/admin",
  AYURVEDIC_DOCTOR_ADMIN: AYURVEDIC_DOCTOR + "/admin",
  ADMIN_PHONE_VERIFY: ADMIN + "/verify",
  ADMIN_REGISTER: ADMIN + "/register",
  ADMIN_LOGIN: ADMIN + "/login",
  ADMIN_RECOVER_VERIFY: ADMIN + "/recover/verify",
  ADMIN_RECOVER_PASSWORD: ADMIN + "/recover/password",
  ADMIN_PASSWORD_CHANGED: ADMIN + "/password/change",
  PATIENT_HOMEOPATHY_APPOINTMENTS: HOMEOPATHY_APPOINTMENT + "/patient",
  HOMEOPATHY_DOCTOR_EMERGENCY: HOMEOPATHY_DOCTOR + "/emergency",
  HOMEOPATHY_DOCTOR_APPOINTMENT_TIME_SLOT : HOMEOPATHY_DOCTOR_SCHEDULE + "/slot",
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

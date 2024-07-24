export const saveToLocalStorage = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

export const getFromLocalStorage = (key: string): string | null => {
  return localStorage.getItem(key);
};

export const deleteFromLocalStorage = (key: string): void => {
  localStorage.removeItem(key);
};

/**
 * Normal user profile
 */
export type Profile = {
  name: string;
  role: "Admin" | "User";
  room: string;
  key: string;
};

export const saveProfile = (profile: Profile): void => {
  saveToLocalStorage("profile", JSON.stringify(profile));
};

export const getProfile = (): Profile => {
  const profile = getFromLocalStorage("profile");
  if (profile) {
    return JSON.parse(profile);
  }

  return {
    name: "Default",
    role: "User",
    room: "",
    key: "",
  };
};

/**
 * Hiring specific data
 */
export type HiringProfile = {
  recruiter: boolean;
  criteria: [boolean, boolean, boolean];
  salary: number;
  encryption: string;
};

export const saveHiringProfile = (profile: HiringProfile): void => {
  saveToLocalStorage("hiring_profile", JSON.stringify(profile));
};

export const getHiringProfile = (): HiringProfile | undefined => {
  const profile = getFromLocalStorage("hiring_profile");
  if (profile) {
    return JSON.parse(profile);
  }

  return undefined;
};

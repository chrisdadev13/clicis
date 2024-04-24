import axios, { type AxiosResponse } from "axios";

export interface UserResponse {
  user: {
    id: number;
    username: string;
    name: string;
    email: string;
    emailVerified: string; // ISO 8601 date-time string
    bio: string;
    avatar: string; // URL to the user's avatar image
    timeZone: string;
    weekStart: string; // 'Sunday' or 'Monday'
    endTime: number; // total minutes from start of the day (e.g., 1440 for end of day)
    bufferTime: number; // total minutes for buffer time
    appTheme: string | null; // could be a theme name or null
    theme: string | null; // could be a theme name or null
    defaultScheduleId: number;
    locale: string | null; // could be a locale string or null
    timeFormat: 12 | 24; // 12-hour or 24-hour format
    hideBranding: boolean;
    brandColor: string | null; // hex color string or null
    darkBrandColor: string | null; // hex color string or null
    allowDynamicBooking: boolean;
    away: boolean;
    createdDate: string; // ISO 8601 date-time string
    verified: boolean;
    invitedTo: string | null; // could be an invite identifier or null
    role: string; // fixed role value
  };
}

export interface UnauthorizedResponse {
  error: string;
}

export default async function meCal(
  apiKey: string,
): Promise<UserResponse | UnauthorizedResponse | undefined> {
  const apiUrl = `https://api.cal.com/v1/me?apiKey=${apiKey}`;
  try {
    const response: AxiosResponse<UserResponse> = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return undefined;
  }
}

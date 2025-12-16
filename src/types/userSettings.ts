import { Language } from "../constants/language";
import { Theme } from "../constants/theme";

export interface UserSettingsResponse {
    theme: Theme,
    language: Language,
    notificationEnabled: boolean,
    lessonReminderMinutes: number,
    emailNotificationEnabled: boolean,
    pushNotificationEnabled: boolean
}

export interface UpdateUserSettingsRequest {
    theme: Theme,
    language: Language,
    notificationEnabled: boolean,
    lessonReminderMinutes: number,
    emailNotificationEnabled: boolean,
    pushNotificationEnabled: boolean
}
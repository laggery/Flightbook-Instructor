export class GoogleCalendarConfig {
  accessToken?: string;
  refreshToken?: string;
  calendarId?: string;
  tokenExpiry?: Date;
}

export class TandemModule {
  active?: boolean;
  termsAndConditionsLink?: string;
}

export class SchoolModule {
  active?: boolean;
  validateFlights?: boolean;
  userCanEditControlSheet?: boolean;
}

export class SchoolConfig {
    schoolModule?: SchoolModule;
    tandemModule?: TandemModule;
    googleCalendar?: GoogleCalendarConfig;
}

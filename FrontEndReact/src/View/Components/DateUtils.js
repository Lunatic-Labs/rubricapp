import { zonedTimeToUtc, format } from "date-fns-tz";

export const formatDueDate = (dueDate, timeZone) => {
    const timeZoneMap = {
        "EST": "America/New_York",
        "CST": "America/Chicago",
        "MST": "America/Denver",
        "PST": "America/Los_Angeles"
    };


    const timeZoneId = timeZoneMap[timeZone];
    const zonedDueDate = zonedTimeToUtc(dueDate, timeZoneId);
    const formattedDueDate = format(zonedDueDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", { timeZone: timeZoneId });

    return formattedDueDate;
};

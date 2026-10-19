/**
 * Formats a user's `last_login_at` for display.
 *
 * The backend stores login times in UTC but serializes them without an offset
 * (e.g. "2026-09-08T14:05:00"), so a timestamp with no zone is read as UTC.
 *
 * @param lastLoginAt - ISO timestamp from the API, or null if the user has never logged in.
 * @param showUtc - true to show the time in UTC, false for the viewer's local time zone.
 * @param locale - Optional locale override; defaults to the viewer's locale.
 * @returns The formatted date and time with its zone name, or "Never".
 */
export function formatLastLogin(lastLoginAt: string | null | undefined, showUtc: boolean, locale?: string): string {
    if (!lastLoginAt) {
        return "Never";
    }

    const hasTimezone = lastLoginAt.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(lastLoginAt);
    const timestamp = new Date(hasTimezone ? lastLoginAt : `${lastLoginAt}Z`);

    if (Number.isNaN(timestamp.getTime())) {
        return "Unknown";
    }

    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
    };

    if (showUtc) {
        options.timeZone = "UTC";
    }

    return new Intl.DateTimeFormat(locale, options).format(timestamp);
}

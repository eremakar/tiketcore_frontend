import dayjs from "dayjs";

const DEFAULT_UTC_OFFSET_MINUTES = 5 * 60; // Country UTC+5

export const formatDateTime = (s, format = "DD.MM.YYYY HH:mm", offsetMinutes = DEFAULT_UTC_OFFSET_MINUTES) => {
    if (!s)
        return "";
    const date = new Date(s);
    if (isNaN(date.getTime()))
        return "";
    const localOffsetMinutes = -date.getTimezoneOffset(); // e.g. UTC+6 => 360
    const deltaMinutes = offsetMinutes - localOffsetMinutes; // shift from local to target
    const shifted = new Date(date.getTime() + deltaMinutes * 60000);
    return dayjs(shifted).format(format);
}

export const formatDate = (s, format = "DD.MM.YYYY", offsetMinutes = DEFAULT_UTC_OFFSET_MINUTES) => {
    return formatDateTime(s, format, offsetMinutes);
}

export const formatDateOnlyTime = (s, format = "HH:mm", offsetMinutes = DEFAULT_UTC_OFFSET_MINUTES) => {
    return formatDateTime(s, format, offsetMinutes);
}

export const formatDate2 = (inputDateTimeStr) => {
    const inputDateTime = new Date(inputDateTimeStr);
    const day = inputDateTime.getDate();
    const month = inputDateTime.getMonth() + 1; // Months are zero-indexed, so we add 1
    const year = inputDateTime.getFullYear();
    return `${day < 10 ? "0" + day: day}.${month < 10 ? "0" + month : month}.${year}`;
};

// Formats values that represent an offset from the Unix epoch (1970-01-01) into
// a compact human-readable time span like "19:00" or "1день 13:00".
// Accepts ISO strings, numbers (ms), or Date-like inputs.
export const formatDurationFromEpoch = (value) => {
    if (!value)
        return "";

    const epoch = dayjs(0);
    const dt = dayjs(value);
    if (!dt.isValid())
        return "";

    const ms = dt.diff(epoch);
    if (isNaN(ms))
        return "";

    const oneDayMs = 24 * 60 * 60 * 1000;
    const days = Math.floor(ms / oneDayMs);
    const remainderMs = ms % oneDayMs;
    const totalMinutes = Math.floor(remainderMs / (60 * 1000));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const hh = `${hours < 10 ? '0' : ''}${hours}`;
    const mm = `${minutes < 10 ? '0' : ''}${minutes}`;

    return days > 0 ? `${days}день ${hh}:${mm}` : `${hh}:${mm}`;
}

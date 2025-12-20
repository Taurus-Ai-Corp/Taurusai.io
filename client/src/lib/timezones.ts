/**
 * Common timezones for international clients
 */
export const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)", offset: "UTC-5/-4" },
  { value: "America/Chicago", label: "Central Time (CT)", offset: "UTC-6/-5" },
  { value: "America/Denver", label: "Mountain Time (MT)", offset: "UTC-7/-6" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)", offset: "UTC-8/-7" },
  { value: "Europe/London", label: "London (GMT/BST)", offset: "UTC+0/+1" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)", offset: "UTC+1/+2" },
  { value: "Europe/Berlin", label: "Berlin (CET/CEST)", offset: "UTC+1/+2" },
  { value: "Asia/Dubai", label: "Dubai (GST)", offset: "UTC+4" },
  { value: "Asia/Kolkata", label: "India (IST)", offset: "UTC+5:30" },
  { value: "Asia/Singapore", label: "Singapore (SGT)", offset: "UTC+8" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)", offset: "UTC+9" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)", offset: "UTC+8" },
  { value: "Asia/Hong_Kong", label: "Hong Kong (HKT)", offset: "UTC+8" },
  { value: "Australia/Sydney", label: "Sydney (AEDT/AEST)", offset: "UTC+10/+11" },
  { value: "Pacific/Auckland", label: "Auckland (NZDT/NZST)", offset: "UTC+12/+13" },
];

/**
 * Get user's detected timezone
 */
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "America/New_York";
  }
}

/**
 * Format time in a specific timezone
 */
export function formatTimeInTimezone(
  date: string,
  time: string,
  timezone: string
): string {
  try {
    // Parse the date and time
    const dateTimeString = `${date}T${convertTo24Hour(time)}`;
    const dateObj = new Date(dateTimeString);
    
    // Format in the target timezone
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(dateObj);
  } catch {
    return time;
  }
}

/**
 * Convert 12-hour time to 24-hour format for Date parsing
 */
function convertTo24Hour(time12h: string): string {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (hours === '12') {
    hours = '00';
  }
  
  if (modifier === 'PM') {
    hours = String(parseInt(hours, 10) + 12);
  }
  
  return `${hours.padStart(2, '0')}:${minutes}:00`;
}

/**
 * Get timezone label from value
 */
export function getTimezoneLabel(timezoneValue: string): string {
  const tz = TIMEZONES.find(t => t.value === timezoneValue);
  return tz ? tz.label : timezoneValue;
}

/**
 * Format full date and time with timezone
 */
export function formatDateTimeWithTimezone(
  date: string,
  time: string,
  timezone: string
): string {
  try {
    const dateTimeString = `${date}T${convertTo24Hour(time)}`;
    const dateObj = new Date(dateTimeString);
    
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateObj);
    
    const formattedTime = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(dateObj);
    
    const tzLabel = getTimezoneLabel(timezone);
    
    return `${formattedDate} at ${formattedTime} (${tzLabel})`;
  } catch {
    return `${date} at ${time}`;
  }
}

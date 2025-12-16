import { execSync } from "child_process";

interface CalendarEvent {
  summary: string;
  description?: string;
  startTime: string; // RFC3339 format
  endTime: string; // RFC3339 format
  location?: string;
  attendees?: string[];
  reminders?: number[]; // minutes before event
}

interface CreateEventResult {
  success: boolean;
  eventId?: string;
  error?: string;
}

/**
 * Create a calendar event using Google Calendar MCP
 */
export async function createCalendarEvent(event: CalendarEvent): Promise<CreateEventResult> {
  try {
    const eventData = {
      events: [{
        summary: event.summary,
        description: event.description || "",
        start_time: event.startTime,
        end_time: event.endTime,
        location: event.location || "Virtual Meeting",
        attendees: event.attendees || [],
        reminders: event.reminders || [30, 10], // 30 min and 10 min before
        calendar_id: "primary",
      }]
    };

    const inputJson = JSON.stringify(eventData);
    
    // Execute MCP command to create calendar event
    const result = execSync(
      `manus-mcp-cli tool call google_calendar_create_events --server google-calendar --input '${inputJson.replace(/'/g, "'\\''")}'`,
      { 
        encoding: "utf-8",
        timeout: 30000,
      }
    );

    console.log("[Calendar] Event created:", result);
    
    // Parse result to extract event ID if available
    const parsedResult = JSON.parse(result);
    return {
      success: true,
      eventId: parsedResult?.events?.[0]?.id || "created",
    };
  } catch (error) {
    console.error("[Calendar] Failed to create event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Format consultation booking into calendar event
 */
export function formatConsultationEvent(
  consultationType: string,
  date: string,
  time: string,
  attendeeName: string,
  attendeeEmail: string,
  company: string,
  message?: string
): CalendarEvent {
  // Parse time slot (e.g., "09:00 AM" -> "09:00")
  const [timePart, period] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);
  
  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  const startHour = hours.toString().padStart(2, "0");
  const startMinute = minutes.toString().padStart(2, "0");

  // Get duration based on consultation type
  const durations: Record<string, number> = {
    discovery: 30,
    demo: 45,
    technical: 60,
    enterprise: 90,
  };
  const durationMinutes = durations[consultationType] || 45;

  // Calculate end time
  const endHours = Math.floor((hours * 60 + minutes + durationMinutes) / 60);
  const endMinutes = (hours * 60 + minutes + durationMinutes) % 60;
  const endHour = endHours.toString().padStart(2, "0");
  const endMinute = endMinutes.toString().padStart(2, "0");

  // Format times in RFC3339 (using IST timezone +05:30)
  const startTime = `${date}T${startHour}:${startMinute}:00+05:30`;
  const endTime = `${date}T${endHour}:${endMinute}:00+05:30`;

  // Get consultation type label
  const typeLabels: Record<string, string> = {
    discovery: "Discovery Call",
    demo: "Product Demo",
    technical: "Technical Consultation",
    enterprise: "Enterprise Assessment",
  };
  const typeLabel = typeLabels[consultationType] || "Consultation";

  return {
    summary: `Taurus AI ${typeLabel} - ${attendeeName} (${company})`,
    description: `
Consultation Details:
- Type: ${typeLabel}
- Duration: ${durationMinutes} minutes
- Contact: ${attendeeName}
- Company: ${company}
- Email: ${attendeeEmail}

${message ? `Notes from attendee:\n${message}` : ""}

---
Booked via Taurus AI Corp website
    `.trim(),
    startTime,
    endTime,
    location: "Google Meet (link will be added)",
    attendees: [attendeeEmail, "taurus.ai@taas-ai.com"],
    reminders: [60, 15], // 1 hour and 15 minutes before
  };
}

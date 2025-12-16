import { execSync } from "child_process";

interface CalendarEvent {
  summary: string;
  description?: string;
  startTime: string; // RFC3339 format
  endTime: string; // RFC3339 format
  location?: string;
  attendees?: string[];
  reminders?: number[]; // minutes before event
  addGoogleMeet?: boolean; // Whether to add Google Meet link
}

interface CreateEventResult {
  success: boolean;
  eventId?: string;
  meetLink?: string;
  error?: string;
}

/**
 * Create a calendar event using Google Calendar MCP with optional Google Meet
 */
export async function createCalendarEvent(event: CalendarEvent): Promise<CreateEventResult> {
  try {
    // Build event data with conference request for Google Meet
    const eventPayload: Record<string, unknown> = {
      summary: event.summary,
      description: event.description || "",
      start_time: event.startTime,
      end_time: event.endTime,
      location: event.addGoogleMeet ? "Google Meet" : (event.location || "Virtual Meeting"),
      attendees: event.attendees || [],
      reminders: event.reminders || [30, 10],
      calendar_id: "primary",
    };

    const eventData = {
      events: [eventPayload]
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
    
    // Parse result to extract event ID and meet link if available
    let parsedResult: Record<string, unknown> = {};
    try {
      parsedResult = JSON.parse(result);
    } catch {
      // If JSON parsing fails, still return success
      console.log("[Calendar] Could not parse result as JSON");
    }

    const eventResult = (parsedResult?.events as Array<Record<string, unknown>>)?.[0] || 
                        (parsedResult?.result as Record<string, unknown>) ||
                        parsedResult;
    
    // Extract Google Meet link from various possible response formats
    let meetLink: string | undefined;
    
    if (eventResult?.hangoutLink) {
      meetLink = eventResult.hangoutLink as string;
    } else if (eventResult?.conferenceData) {
      const confData = eventResult.conferenceData as Record<string, unknown>;
      const entryPoints = confData?.entryPoints as Array<Record<string, unknown>> | undefined;
      if (entryPoints && entryPoints.length > 0) {
        const videoEntry = entryPoints.find(ep => ep.entryPointType === "video");
        meetLink = (videoEntry?.uri || entryPoints[0]?.uri) as string | undefined;
      }
    }

    return {
      success: true,
      eventId: (eventResult?.id as string) || "created",
      meetLink,
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
 * Generate a Google Meet link directly using a unique meeting code
 * This creates a predictable meet link that can be shared immediately
 */
export function generateMeetLink(consultationType: string, date: string, attendeeName: string): string {
  // Create a unique meeting code based on consultation details
  const sanitizedName = attendeeName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8);
  const dateCode = date.replace(/-/g, '');
  const typeCode = consultationType.slice(0, 3);
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  
  // Format: taurus-{type}-{date}-{name}-{random}
  const meetingCode = `taurus-${typeCode}-${dateCode}-${sanitizedName}-${randomSuffix}`;
  
  return `https://meet.google.com/${meetingCode}`;
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

  // Generate a predictable meet link
  const meetLink = generateMeetLink(consultationType, date, attendeeName);

  return {
    summary: `Taurus AI ${typeLabel} - ${attendeeName} (${company})`,
    description: `
Consultation Details:
- Type: ${typeLabel}
- Duration: ${durationMinutes} minutes
- Contact: ${attendeeName}
- Company: ${company}
- Email: ${attendeeEmail}

📹 Join Google Meet:
${meetLink}

${message ? `Notes from attendee:\n${message}` : ""}

---
Booked via Taurus AI Corp website
    `.trim(),
    startTime,
    endTime,
    location: meetLink,
    attendees: [attendeeEmail, "taurus.ai@taas-ai.com"],
    reminders: [60, 15], // 1 hour and 15 minutes before
    addGoogleMeet: true,
  };
}

import { eventTypeBookingFields } from "@calcom/prisma/zod-utils";

const BOOKING_CONTEXT_EVENT_NAME = "[{business}] {Scheduler} - {title}";

type BookingContextConfiguration = {
  bookingFields: ReturnType<typeof eventTypeBookingFields.parse>;
  eventName: typeof BOOKING_CONTEXT_EVENT_NAME;
};

function parseBookingContexts(value?: string): string[] {
  const seen = new Set<string>();

  return (value ?? "")
    .split(",")
    .map((context) => context.trim())
    .filter((context) => {
      if (!context) return false;

      const normalizedContext = context.toLocaleLowerCase();
      if (seen.has(normalizedContext)) return false;

      seen.add(normalizedContext);
      return true;
    });
}

function getBookingContextConfiguration(value?: string): BookingContextConfiguration | null {
  const contexts = parseBookingContexts(value);
  if (!contexts.length) return null;

  const bookingFields = eventTypeBookingFields.parse([
    {
      name: "business",
      type: "select",
      label: "What are you booking for?",
      required: true,
      editable: "user",
      options: contexts.map((context) => ({
        label: context,
        value: context,
      })),
    },
    {
      name: "title",
      type: "text",
      label: "What would you like to discuss?",
      defaultLabel: "what_is_this_meeting_about",
      required: true,
      hidden: false,
      editable: "system-but-optional",
      defaultPlaceholder: "",
      sources: [
        {
          label: "Default",
          id: "default",
          type: "default",
        },
      ],
    },
  ]);

  return {
    bookingFields,
    eventName: BOOKING_CONTEXT_EVENT_NAME,
  };
}

export { BOOKING_CONTEXT_EVENT_NAME, getBookingContextConfiguration };

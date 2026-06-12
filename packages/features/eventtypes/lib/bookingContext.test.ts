import { describe, expect, it } from "vitest";
import { BOOKING_CONTEXT_EVENT_NAME, getBookingContextConfiguration } from "./bookingContext";

describe("getBookingContextConfiguration", () => {
  it("creates required business and reason fields", () => {
    const configuration = getBookingContextConfiguration("PatientCare, Consulting, Personal");

    expect(configuration?.eventName).toBe(BOOKING_CONTEXT_EVENT_NAME);
    expect(configuration?.bookingFields).toEqual([
      expect.objectContaining({
        name: "business",
        type: "select",
        required: true,
        options: [
          { label: "PatientCare", value: "PatientCare" },
          { label: "Consulting", value: "Consulting" },
          { label: "Personal", value: "Personal" },
        ],
      }),
      expect.objectContaining({
        name: "title",
        type: "text",
        required: true,
        hidden: false,
      }),
    ]);
  });

  it("trims options and removes case-insensitive duplicates", () => {
    const configuration = getBookingContextConfiguration(" PatientCare, patientcare, Personal, ");
    const businessField = configuration?.bookingFields.find((field) => field.name === "business");

    expect(businessField?.options).toEqual([
      { label: "PatientCare", value: "PatientCare" },
      { label: "Personal", value: "Personal" },
    ]);
  });

  it("does not alter event types without booking options", () => {
    expect(getBookingContextConfiguration()).toBeNull();
    expect(getBookingContextConfiguration(" , ")).toBeNull();
  });
});

import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import type { TRPCContext } from "../../trpc";
import type { TCheckAvailabilitySchema } from "./checkAvailability.schema";
import axios from "axios";
import { env } from "@/env";
import { type UserSchedule } from "@/lib/findMeetingTime";

import findMeetingTime from "@/lib/findMeetingTime";

type CheckAvailabilityOptions = {
  ctx: {
    session: NonNullable<TRPCContext["session"]>;
  };
  input: TCheckAvailabilitySchema;
};

const getContactAvailability = async (
  eventTypeId: number,
  startTime: string,
  endTime: string,
) => {
  const calApiUrl = `https://api.cal.com/v1/slots?eventTypeId=${eventTypeId}&apiKey=${env.CAL_API_KEY}&startTime=${startTime}&endTime=${endTime}`;

  try {
    const response = await axios.get<{
      slots: Record<string, { time: string }[]>;
    }>(calApiUrl);

    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const getUserAvailability = async (
  calUserId: number,
  startTime: string,
  endTime: string,
) => {
  const calApiUrl = `https://api.cal.com/v1/availability?userId=${calUserId}&apiKey=${env.CAL_API_KEY}&dateFrom=${startTime}&dateTo=${endTime}`;

  try {
    const response = await axios.get<UserSchedule>(calApiUrl);

    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

interface CreateBookingOptions {
  calApiKey: string;
  eventTypeId: number;
  start: string; // This can be converted to Date if needed
  end: string; // This can be converted to Date if needed
  responses: {
    name: string;
    email: string;
    location: string;
  };

  metadata: object; // or specific metadata type if known
  timeZone: string;
  language: string;
  title: string;
  description: string | null;
  status: string;
  smsReminderNumber: string | null;
}

// interface CreateBookingOptions {
//   calApiKey: string;
//   eventTypeId: number;
//   start: string;
//   end: string;
//   responses: {
//     name: string;
//     email: string;
//     location: string;
//     metadata: object;
//   };
//   language: string;
//   timeZone: string;
//   title: string;
//   recurringEventId: number;
//   description: string;
//   status: "ACCEPTED" | "PENDING" | "CANCELLED" | "REJECTED";
//   seatsPerTimeSlot: number;
//   seatsShowAttendees: boolean;
//   seatsShowAvailabilityCount?: boolean;
//   smsReminderNumber: number | null;
// }

interface Booking {
  id: number;
  userId: number;
  description: string;
  eventTypeId: number;
  uid: string;
  title: string;
  startTime: string; // This can be converted to Date if needed
  endTime: string; // This can be converted to Date if needed
  attendees: Attendee[];
  user: User;
  payment: Payment[];
  metadata: Record<string, unknown>; // or specific metadata type if known
  status: string;
  responses: {
    email: string;
    name: string;
    location: {
      optionValue: string;
      value: string;
    };
  };
}

interface Attendee {
  email: string;
  name: string;
  timeZone: string;
  locale: string;
}

interface User {
  email: string;
  name: string;
  timeZone: string;
  locale: string;
}

interface Payment {
  id: number;
  success: boolean;
  paymentOption: string;
}

const createBooking = async (opts: CreateBookingOptions) => {
  const calApiUrl = `https://api.cal.com/v1/bookings?apiKey=${opts.calApiKey}`;

  try {
    const response = await axios.post<Booking>(calApiUrl, opts);

    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

function addMinutes(date: Date, minutes: number) {
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

export const checkAvailabilityHandler = async ({
  ctx,
  input,
}: CheckAvailabilityOptions) => {
  const { user } = ctx.session;

  const [contactAvailability, userAvailability] = await Promise.allSettled([
    getContactAvailability(input.eventId, input.startTime, input.endTime),
    getUserAvailability(user.calId, input.startTime, input.endTime),
  ]);

  if (contactAvailability.status === "rejected") {
    throw new TRPCError({
      code: "TIMEOUT",
      message: "Failed to get contact availability",
    });
  }
  if (userAvailability.status === "rejected") {
    throw new TRPCError({
      code: "TIMEOUT",
      message: "Failed to get user availability",
    });
  }

  const meetingTime = findMeetingTime(
    contactAvailability.value!.slots,
    userAvailability.value!,
  );

  if (!meetingTime) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No available meeting times 🫤",
    });
  }

  const event = await db.eventTypes.findFirst({
    where: {
      calId: input.eventId,
    },
  });

  if (!event) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Event not found",
    });
  }

  const booking = await createBooking({
    calApiKey: user.apiKey,
    eventTypeId: input.eventId,
    start: meetingTime.contactDateTime,
    end: addMinutes(new Date(meetingTime.contactDateTime), event.length!),
    responses: {
      name: user.name!,
      email: user.email!,
      location: "Online",
    },
    metadata: {
      clicIs: "true",
    },
    language: "en",
    timeZone: user.timeZone,
    title: event.title,
    description: "Meet up with your contact",
    status: "PENDING",
    smsReminderNumber: null,
  });

  if (!booking) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create booking",
    });
  }

  const checkIn = await db.checkIns.create({
    data: {
      status: "PENDING",
      title: event.title,
      userId: user.id,
      slug: event.slug,
      contactId: event.contactId,
      timeZone: user.timeZone,
      startDate: meetingTime.contactDateTime,
      endDate: addMinutes(new Date(meetingTime.contactDateTime), event.length!),
    },
  });

  if (!checkIn) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create check-in",
    });
  }

  return meetingTime;
};

export default checkAvailabilityHandler;

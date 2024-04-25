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

  await db.checkIns.create({
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

  return meetingTime;
};

export default checkAvailabilityHandler;

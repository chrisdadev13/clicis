interface TimeSlot {
  time: string;
}

interface BusyTime {
  start: string;
  end: string;
}

interface UserSchedule {
  busy: BusyTime[];
  workingHours: { days: number[]; startTime: number; endTime: number }[];
  timeZone: string;
}

type Schedule = Record<string, TimeSlot[]>;

export default function findMeetingTime(
  contactSchedule: Schedule,
  userSchedule: UserSchedule,
): string | null {
  const workingDays = userSchedule.workingHours.map((wh) => wh.days).flat();
  const userTimeZone = userSchedule.timeZone || "UTC";

  const busySlots = userSchedule.busy.map((busy) => {
    const start = new Date(busy.start).toLocaleString("en-US", {
      timeZone: userTimeZone,
    });
    const end = new Date(busy.end).toLocaleString("en-US", {
      timeZone: userTimeZone,
    });
    return { start, end };
  });

  for (const date in contactSchedule) {
    const contactSlots = contactSchedule[date];

    if (!contactSlots) continue;

    const availableTimes = contactSlots.map((slot) => slot.time);

    for (const time of availableTimes) {
      const contactDateTime = new Date(time);
      const contactDate = contactDateTime.toISOString().split("T")[0];

      const isWorkingDay = workingDays.includes(contactDateTime.getDay());
      const userIsFree = !busySlots.some((busy) => {
        const busyStart = new Date(busy.start);
        const busyEnd = new Date(busy.end);

        return (
          contactDateTime >= busyStart &&
          contactDateTime < busyEnd &&
          contactDate === date
        );
      });

      if (isWorkingDay && userIsFree) {
        const meetingDateTime = contactDateTime.toLocaleString("en-US", {
          timeZone: userTimeZone,
          year: "numeric",
          month: "long",
          day: "2-digit",
          hour: "numeric",
          minute: "numeric",
        });

        return meetingDateTime;
      }
    }
  }

  return null;
}

import { prisma } from "@repo/db";
import type { Event } from "@repo/db/generated/prisma/client";

export async function getEvent(
  eventId: string,
  adminId?: string
): Promise<Event | null> {
  if (adminId) {
    return prisma.event.findUnique({
      where: {
        id: eventId,
        adminId: adminId,
      },
    });
  }

  return prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });
}

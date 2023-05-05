import { OkPacket } from "mysql";
import { ACTIVITIES } from "./constants.js";
import { query } from "./database.js";
import { Nullable } from "./types/common.js";

export interface ActivityGroup {
  title: string;
  email: string;
}

export interface ActivityGroupPatch {
  title?: string;
}

export async function insertActivity(
  title: string,
  email: string
): Promise<ActivityGroup> {
  const insertResult = await query<OkPacket>(
    `INSERT INTO ${ACTIVITIES} (title, email) VALUES (?, ?)`,
    [title, email]
  );

  const createdActivityGroupId = insertResult.insertId;

  return await query<ActivityGroup[]>(
    `SELECT * FROM ${ACTIVITIES} WHERE activity_id = ?`,
    [createdActivityGroupId]
  ).then((activities) => activities[0]);
}

export async function getActivityById(
  id: number
): Promise<Nullable<ActivityGroup>> {
  return await query<ActivityGroup[]>(
    `SELECT * FROM ${ACTIVITIES} WHERE activity_id = ?`,
    [id]
  ).then((activities) => (activities.length == 0 ? null : activities[0]));
}

export async function deleteActivityById(id: number): Promise<void> {
  return await query<OkPacket>(
    `DELETE FROM ${ACTIVITIES} WHERE activity_id = ?`,
    [id]
  ).then((_) => void 0);
}

export async function updateTitleById(
  id: number,
  title: string
): Promise<void> {
  return await query<OkPacket>(
    `UPDATE ${ACTIVITIES} SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE activity_id = ?`,
    [title, id]
  ).then((_) => void 0);
}

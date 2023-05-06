import { OkPacket } from "mysql";
import { ACTIVITIES } from "./constants.js";
import { pool, query } from "./database.js";
import { GenericJson, Nullable } from "./types/common.js";

export interface ActivityGroup {
  title: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RawActivityGroup {
  activity_id: number;
  title: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityGroupPatch {
  title?: string;
}

export async function insertActivity(
  title: string,
  email: string
): Promise<ActivityGroup> {
  return new Promise<ActivityGroup>((resolve, _) => {
    pool.getConnection((_, connection) => {
      connection.query(
        `INSERT INTO ${ACTIVITIES} (title, email) VALUES (?, ?)`,
        [title, email],
        (_, insertResult: OkPacket, __) => {
          const createdActivityGroupId = insertResult.insertId;

          connection.query(
            `SELECT * FROM ${ACTIVITIES} WHERE activity_id = ?`,
            [createdActivityGroupId],
            (_, activities: RawActivityGroup[]) => {
              connection.release();
              const createdActivity = adjustKeys(activities[0]);
              resolve(createdActivity);
            }
          );
        }
      );
    });
  });
}

export async function getActivities(): Promise<ActivityGroup[]> {
  return await query<RawActivityGroup[]>(`SELECT * FROM ${ACTIVITIES}`).then(
    (activities) => activities.map((activity) => adjustKeys(activity))
  );
}

export async function getActivityById(
  id: number
): Promise<Nullable<ActivityGroup>> {
  return await query<RawActivityGroup[]>(
    `SELECT * FROM ${ACTIVITIES} WHERE activity_id = ?`,
    [id]
  ).then((activities) =>
    activities.length == 0 ? null : adjustKeys(activities[0])
  );
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

function adjustKeys(rawActivityGroup: RawActivityGroup): ActivityGroup {
  const activityGroup: GenericJson = rawActivityGroup;
  activityGroup["id"] = activityGroup["activity_id"];
  activityGroup["createdAt"] = activityGroup["created_at"];
  activityGroup["updatedAt"] = activityGroup["updated_at"];
  delete activityGroup["created_at"];
  delete activityGroup["updated_at"];
  delete activityGroup["activity_id"];
  return activityGroup as ActivityGroup;
}

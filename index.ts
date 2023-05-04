import express from "express";
import cors from "cors";
import { ensureAllTables, query } from "./src/database.js";
import { ActivityGroup } from "./src/types/activity.js";
import { ACTIVITIES } from "./src/constants.js";
import { OkPacket } from "mysql";

const app = express();
ensureAllTables();

app.use(cors());
app.use(express.json());

/**
 * Get all
 */
app.get("/activity-groups", async (request, response) => {
  const activityGroups = await query<ActivityGroup[]>(
    `SELECT * FROM ${ACTIVITIES}`
  );

  response.status(200).json({
    status: "Success",
    message: "Success",
    data: activityGroups,
  });
});

/**
 * Get one by id
 */
app.get("/activity-groups/:id", (request, response) => {
  // TODO: impl
});

/**
 * Add new activity group
 */
app.post("/activity-groups", async (request, response) => {
  const { title, email } = request.body as ActivityGroup;

  const insertResult = await query<OkPacket>(
    `INSERT INTO ${ACTIVITIES} (title, email) VALUES (?, ?)`,
    [title, email]
  );
  const createdActivityGroupId = insertResult.insertId;
  const createdActivityGroup = await query<ActivityGroup[]>(
    `SELECT * FROM ${ACTIVITIES} WHERE activity_id = ?`,
    [createdActivityGroupId]
  ).then((activities) => activities[0]);

  response.status(200).json({
    status: "Success",
    message: "Success",
    data: createdActivityGroup,
  });
});

/**
 * Patch existing activity group
 */
app.patch("/activity-groups", (request, response) => {
  // TODO: impl
});

/**
 * Delete by id
 */
app.delete("/activity-groups/:id", (request, response) => {
  // TODO: impl
});

/**
 * Get all by group id
 */
app.get("/todo-items", (request, response) => {
  // TODO: impl
});

/**
 * Get one by todo id
 */
app.get("/todo-items/:id", (request, response) => {
  // TODO: impl
});

/**
 * Get one by todo id
 */
app.post("/todo-items", (request, response) => {
  // TODO: impl
});

/**
 * Get one by todo id
 */
app.patch("/todo-items/:id", (request, response) => {
  // TODO: impl
});

/**
 * Delete by todo id
 */
app.delete("/todo-items/:id", (request, response) => {
  // TODO: impl
});

app.listen(3030);
console.log("Listing to port 3030");

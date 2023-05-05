import express, { Request } from "express";
import cors from "cors";
import { ensureAllTables, query } from "./src/database.js";
import {
  ACTIVITIES,
  BAD_REQUEST,
  CREATED,
  NOT_FOUND,
  OK,
} from "./src/constants.js";
import { ActivityGroupResponseFactory } from "./src/activity_responses.js";
import {
  ActivityGroup,
  ActivityGroupPatch,
  deleteActivityById,
  getActivityById,
  insertActivity,
  updateTitleById,
} from "./src/activities.js";

const app = express();
ensureAllTables();

app.use(cors());
app.use(express.json());

/**
 * Get all
 */
app.get("/activity-groups", async (_, response) => {
  const activityGroups = await query<ActivityGroup[]>(
    `SELECT * FROM ${ACTIVITIES}`
  );

  response
    .status(200)
    .json(ActivityGroupResponseFactory.successMany(activityGroups));
});

/**
 * Get one by id
 */
app.get(
  "/activity-groups/:id",
  async (request: Request<{ id: number }>, response) => {
    const activityGroupId = request.params.id;
    const activityGroup = await getActivityById(activityGroupId);

    const httpStatus = activityGroup ? OK : NOT_FOUND;
    const responseBody = activityGroup
      ? ActivityGroupResponseFactory.successOne(activityGroup)
      : ActivityGroupResponseFactory.notFound(activityGroupId);

    response.status(httpStatus).json(responseBody);
  }
);

/**
 * Add new activity group
 */
app.post(
  "/activity-groups",
  async (request: Request<{}, any, ActivityGroup>, response) => {
    const { title, email } = request.body;

    if (!title) {
      return response
        .status(BAD_REQUEST)
        .json(ActivityGroupResponseFactory.emptyTitle());
    }

    const createdActivityGroup = await insertActivity(title, email!);

    response
      .status(CREATED)
      .json(ActivityGroupResponseFactory.successOne(createdActivityGroup));
  }
);

/**
 * Patch existing activity group
 */
app.patch(
  "/activity-groups/:id",
  async (
    request: Request<{ id: number }, any, ActivityGroupPatch>,
    response
  ) => {
    const activityGroupId = request.params.id;
    const activityGroup = await getActivityById(activityGroupId);

    if (!activityGroup) {
      return response
        .status(NOT_FOUND)
        .json(ActivityGroupResponseFactory.notFound(activityGroupId));
    }

    if (!request.body.title) {
      return response
        .status(BAD_REQUEST)
        .json(ActivityGroupResponseFactory.emptyTitle());
    }

    const { title } = request.body;

    await updateTitleById(activityGroupId, title!);
    const updatedActivityGroup = await getActivityById(activityGroupId);

    response
      .status(OK)
      .json(ActivityGroupResponseFactory.successOne(updatedActivityGroup!));
  }
);

/**
 * Delete by id
 */
app.delete(
  "/activity-groups/:id",
  async (request: Request<{ id: number }>, response) => {
    const activityGroupId = request.params.id;
    const activityGroup = await getActivityById(activityGroupId);

    if (activityGroup) {
      await deleteActivityById(activityGroupId);
    }

    const httpStatus = activityGroup ? OK : NOT_FOUND;
    const responseBody = activityGroup
      ? ActivityGroupResponseFactory.successEmpty()
      : ActivityGroupResponseFactory.notFound(activityGroupId);

    response.status(httpStatus).json(responseBody);
  }
);

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

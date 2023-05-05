import express, { Request } from "express";
import cors from "cors";
import { ensureAllTables } from "./src/database.js";
import { BAD_REQUEST, CREATED, NOT_FOUND, OK } from "./src/constants.js";
import { ActivityGroupResponseFactory } from "./src/activity_responses.js";
import {
  ActivityGroup,
  ActivityGroupPatch,
  deleteActivityById,
  getActivities,
  getActivityById,
  insertActivity,
  updateTitleById,
} from "./src/activities.js";
import {
  GetAllTodoQuery,
  TodoItem,
  deleteTodoById,
  getTodoById,
  getTodos,
  getTodosByActivityId,
  insertTodo,
  updateTodoById,
} from "./src/todos.js";
import { TodoResponseFactory } from "./src/todo_responses.js";

const app = express();
ensureAllTables();

app.use(cors());
app.use(express.json());

/**
 * Get all
 */
app.get("/activity-groups", async (_, response) => {
  const activityGroups = await getActivities();

  response
    .status(OK)
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
app.get(
  "/todo-items",
  async (request: Request<{}, any, any, GetAllTodoQuery>, response) => {
    let getTodosFn = getTodos;

    if (request.query.activity_group_id) {
      const activityGroupId = request.query.activity_group_id;
      getTodosFn = getTodosByActivityId.bind(null, activityGroupId);
    }

    const todos = await getTodosFn();
    response.status(OK).json(TodoResponseFactory.successMany(todos));
  }
);

/**
 * Get one by todo id
 */
app.get(
  "/todo-items/:id",
  async (request: Request<{ id: number }>, response) => {
    const todoId = request.params.id;
    const todoItem = await getTodoById(todoId);

    const httpStatus = todoItem ? OK : NOT_FOUND;
    const responseBody = todoItem
      ? TodoResponseFactory.successOne(todoItem)
      : TodoResponseFactory.notFound(todoId);

    response.status(httpStatus).json(responseBody);
  }
);

/**
 * Create new todo item
 */
app.post(
  "/todo-items",
  async (request: Request<{}, any, TodoItem>, response) => {
    const { title, activity_group_id, is_active } = request.body;

    if (!title) {
      return response
        .status(BAD_REQUEST)
        .json(ActivityGroupResponseFactory.emptyTitle());
    }

    const createdTodoItem = await insertTodo(
      title,
      activity_group_id!,
      is_active!
    );

    response
      .status(CREATED)
      .json(TodoResponseFactory.successOne(createdTodoItem));
  }
);

/**
 * Update existing todo item
 */
app.patch(
  "/todo-items/:id",
  async (request: Request<{ id: number }, any, any, TodoItem>, response) => {
    const todoId = request.params.id;
    const todoItem = await getTodoById(todoId);

    if (!todoItem) {
      return response
        .status(NOT_FOUND)
        .json(TodoResponseFactory.notFound(todoId));
    }

    if (!request.body.title) {
      return response
        .status(BAD_REQUEST)
        .json(TodoResponseFactory.emptyTitle());
    }

    await updateTodoById(todoId, request.body);
    const updatedTodoItem = await getTodoById(todoId);

    response.status(OK).json(TodoResponseFactory.successOne(updatedTodoItem!));
  }
);

/**
 * Delete by todo id
 */
app.delete(
  "/todo-items/:id",
  async (request: Request<{ id: number }>, response) => {
    const todoId = request.params.id;
    const todoItem = await getTodoById(todoId);

    if (todoItem) {
      await deleteTodoById(todoId);
    }

    const httpStatus = todoItem ? OK : NOT_FOUND;
    const responseBody = todoItem
      ? TodoResponseFactory.successEmpty()
      : TodoResponseFactory.notFound(todoId);

    response.status(httpStatus).json(responseBody);
  }
);

app.listen(3030);
console.log("Listing to port 3030");

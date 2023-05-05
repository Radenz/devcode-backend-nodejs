import { OkPacket } from "mysql";
import { TODOS } from "./constants.js";
import { query } from "./database.js";
import { GenericJson, Nullable } from "./types/common.js";

export interface TodoItem {
  todo_id?: number;
  activity_group_id?: number;
  title?: string;
  priority?: string;
  is_active?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RawTodoItem {
  todo_id?: number;
  activity_group_id: number;
  title: string;
  priority: string;
  status: string;
  is_active?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GetAllTodoQuery {
  activity_group_id?: number;
}

export async function getTodos(): Promise<TodoItem[]> {
  return await query<RawTodoItem[]>(`SELECT * FROM ${TODOS}`).then((todos) =>
    adjustKeysMany(todos)
  );
}

export async function getTodosByActivityId(
  activityId: number
): Promise<TodoItem[]> {
  return await query<RawTodoItem[]>(
    `SELECT * FROM ${TODOS} WHERE activity_group_id = ?`,
    [activityId]
  ).then((todos) => adjustKeysMany(todos));
}

export async function getTodoById(id: number): Promise<Nullable<TodoItem>> {
  return await query<RawTodoItem[]>(
    `SELECT * FROM ${TODOS} WHERE todo_id = ?`,
    [id]
  ).then((todos) => (todos.length == 0 ? null : adjustKeysAndBool(todos[0])));
}

// !! Misleading example
// export async function insertTodo(
//   title: string,
//   activityGroupId: number,
//   isActive: boolean
// ): Promise<TodoItem> {
//   const insertResult = await query<OkPacket>(
//     `INSERT INTO ${TODOS} (activity_group_id, title, is_active) VALUES (?, ?, ?)`,
//     [activityGroupId, title, isActive]
//   );

//   const createdTodoId = insertResult.insertId;

//   return await query<RawTodoItem[]>(
//     `SELECT * FROM ${TODOS} WHERE todo_id = ?`,
//     [createdTodoId]
//   ).then((todos) => adjustKeys(todos[0]));
// }

export async function insertTodo(
  title: string,
  activityGroupId: number
): Promise<TodoItem> {
  const insertResult = await query<OkPacket>(
    `INSERT INTO ${TODOS} (activity_group_id, title) VALUES (?, ?)`,
    [activityGroupId, title]
  );

  const createdTodoId = insertResult.insertId;

  return await query<RawTodoItem[]>(
    `SELECT * FROM ${TODOS} WHERE todo_id = ?`,
    [createdTodoId]
  ).then((todos) => adjustKeysAndBool(todos[0]));
}

export async function updateTodoById(
  id: number,
  todoItem: TodoItem
): Promise<void> {
  const [setters, values] = getQuerySetters(todoItem);

  return await query<OkPacket>(
    `UPDATE ${TODOS} SET ${setters}, updated_at = CURRENT_TIMESTAMP WHERE todo_id = ?`,
    [...values, id]
  ).then((_) => void 0);
}

export async function deleteTodoById(id: number): Promise<void> {
  return await query<OkPacket>(`DELETE FROM ${TODOS} WHERE todo_id = ?`, [
    id,
  ]).then((_) => void 0);
}

function getQuerySetters(todoItem: TodoItem): [string, any[]] {
  const setters = [];
  const values = [];

  if (todoItem.title !== undefined) {
    setters.push("title = ?");
    values.push(todoItem.title);
  }

  if (todoItem.priority !== undefined) {
    setters.push("priority = ?");
    values.push(todoItem.priority);
  }

  if (todoItem.is_active !== undefined) {
    setters.push("is_active = ?");
    values.push(todoItem.is_active);
  }

  if (todoItem.status !== undefined) {
    setters.push("status = ?");
    values.push(todoItem.status);
  }

  return [setters.join(", "), values];
}

function adjustKeysMany(rawTodoItems: RawTodoItem[]): TodoItem[] {
  return rawTodoItems.map((todoItem) => adjustKeysAndBool(todoItem));
}

function adjustKeysAndBool(rawTodoItem: RawTodoItem): TodoItem {
  const todoItem: GenericJson = rawTodoItem;
  todoItem["id"] = todoItem["todo_id"];
  todoItem["createdAt"] = todoItem["created_at"];
  todoItem["updatedAt"] = todoItem["updated_at"];
  todoItem["is_active"] = !!todoItem["is_active"];
  delete todoItem["created_at"];
  delete todoItem["updated_at"];
  delete todoItem["todo_id"];
  return todoItem as TodoItem;
}

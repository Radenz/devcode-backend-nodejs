import { TodoItem } from "./todos.js";
import {
  EmptyData,
  GenericResponse,
  ManyData,
  SingleData,
} from "./types/response.js";

export abstract class TodoResponseFactory {
  static successEmpty(): GenericResponse & EmptyData {
    return {
      status: "Success",
      message: "Success",
      data: {},
    };
  }

  static successOne(data: TodoItem): GenericResponse & SingleData<TodoItem> {
    return {
      status: "Success",
      message: "Success",
      data,
    };
  }

  static successMany(data: TodoItem[]): GenericResponse & ManyData<TodoItem> {
    return {
      status: "Success",
      message: "Success",
      data,
    };
  }

  static notFound(id: number): GenericResponse {
    return {
      status: "Not Found",
      message: `Todo with ID ${id} Not Found`,
    };
  }

  static emptyTitle(): GenericResponse {
    return {
      status: "Bad Request",
      message: "title cannot be null",
    };
  }
}

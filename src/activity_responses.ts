import { ActivityGroup } from "./activities.js";
import {
  EmptyData,
  GenericResponse,
  ManyData,
  SingleData,
} from "./types/response.js";

export abstract class ActivityGroupResponseFactory {
  static successEmpty(): GenericResponse & EmptyData {
    return {
      status: "Success",
      message: "Success",
      data: {},
    };
  }

  static successOne(
    data: ActivityGroup
  ): GenericResponse & SingleData<ActivityGroup> {
    return {
      status: "Success",
      message: "Success",
      data,
    };
  }

  static successMany(
    data: ActivityGroup[]
  ): GenericResponse & ManyData<ActivityGroup> {
    return {
      status: "Success",
      message: "Success",
      data,
    };
  }

  static notFound(id: number): GenericResponse {
    return {
      status: "Not Found",
      message: `Activity with ID ${id} Not Found`,
    };
  }

  static emptyTitle(): GenericResponse {
    return {
      status: "Bad Request",
      message: "title cannot be null",
    };
  }
}

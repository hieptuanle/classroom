import type { Request } from "express";

import { getPaginationOptions } from "@backend/helpers/pagination";
import { getSortingOptions } from "@backend/helpers/sorting";

export const getRequestOptions = function (req: Request<any, any, any, { page: string; pageSize: string; search: string; sort: string; order: string }>) {
  const paginationOptions = getPaginationOptions(req);
  const sortOptions = getSortingOptions(req);

  return Object.assign({}, paginationOptions, sortOptions);
};

export const getFilteringOptions = function (req: any, parameters: string[]) {
  const options: Record<string, string> = {};

  parameters.forEach((param: string) => {
    if (req.query[param] !== undefined) {
      options[param] = req.query[param];
    }
  });

  return options;
};

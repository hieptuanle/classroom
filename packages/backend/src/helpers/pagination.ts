import config from 'config';
import { Request, Response } from 'express';

export const getPaginationOptions = function (req: Request<any, any, any, { page: string, pageSize: string, search: string, sort: string, order: string }>) {
  const page = (req.query.page !== undefined) ? parseInt(req.query.page) : config.get("pagination.defaultPage");
  const limit = (req.query.pageSize !== undefined) ? parseInt(req.query.pageSize) : config.get("pagination.defaultLimit");

  return {
    page: page,
    limit: limit
  };
};


export const setPaginationHeaders = function (res: Response, result: any) {
  res.set('Pagination-Count', result.total);
  res.set('Pagination-Page', result.page);
  res.set('Pagination-Limit', result.limit);
};

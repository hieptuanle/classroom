import { Request } from 'express';

export const getSortingOptions = function (req: Request) {
  return (req.query.sort !== undefined) ? {
    sort: (req.query.sort as string).replace(',', ' ')
  } : {};
};

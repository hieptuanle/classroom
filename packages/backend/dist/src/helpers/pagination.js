import config from "config";
export const getPaginationOptions = function (req) {
    const page = (req.query.page !== undefined) ? Number.parseInt(req.query.page) : config.get("pagination.defaultPage");
    const limit = (req.query.pageSize !== undefined) ? Number.parseInt(req.query.pageSize) : config.get("pagination.defaultLimit");
    return {
        page,
        limit,
    };
};
export const setPaginationHeaders = function (res, result) {
    res.set("Pagination-Count", result.total);
    res.set("Pagination-Page", result.page);
    res.set("Pagination-Limit", result.limit);
};

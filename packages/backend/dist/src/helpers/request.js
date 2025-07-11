import { getPaginationOptions } from "@backend/helpers/pagination";
import { getSortingOptions } from "@backend/helpers/sorting";
export const getRequestOptions = function (req) {
    const paginationOptions = getPaginationOptions(req);
    const sortOptions = getSortingOptions(req);
    return Object.assign({}, paginationOptions, sortOptions);
};
export const getFilteringOptions = function (req, parameters) {
    const options = {};
    parameters.forEach((param) => {
        if (req.query[param] !== undefined) {
            options[param] = req.query[param];
        }
    });
    return options;
};

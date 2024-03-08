import { ErrorHandler } from "../utils/errorHandler";
function errorFn(err, req, res, next) {
    err.statusCode = err.statusCode || 500
    err.msg = err.msg || "Internal Server Error"

    res.status(err.statusCode).json({
        status: false,
        msg: err
    })

}
export { errorFn }
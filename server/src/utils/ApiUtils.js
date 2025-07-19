// Here we are fabricating blueprint classes for consistant error and response from controllers


// classed
class ApiResponse {
    constructor(
        statusCode,
        data,
        message = "Success"
    ) {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400         // boolean
    }
}


class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",       // not ideal message
        errors = [],
        stack = ""
    ) {
        super(message)
        this.statusCode = statusCode
        this.message = message                  // custom message if given
        this.errors = errors
        this.data = null
        this.success = false
        this.stack = stack || Error.captureStackTrace(this, this.constructor)
    }
}


// exports
export {
    ApiResponse,
    ApiError
}

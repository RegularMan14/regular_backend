class ApiError extends Error {
    constructor (
        statusCode,
        message = "Something went wrong",
        errors = [],
        statchk = ""
    ) {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if (statchk) {
            this.statchk = statchk
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}
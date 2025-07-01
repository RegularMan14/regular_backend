import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asynchandler.js"

const healthcheck = asyncHandler ( async (_, res) => {
    try {
        if (!res) {
            throw new ApiError (
                400,
                "bad request"
            )
        }
    
        return res
        . status (200)
        . json (
            new ApiResponse (
                200,
                {},
                "Success! Backend is operational"
            )
        )
    } catch (error) {
        throw new ApiError(
            error.statusCode,
            error.message
        )
    }
})

export {
    healthcheck
}
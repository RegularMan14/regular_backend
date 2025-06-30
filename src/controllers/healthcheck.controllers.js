import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asynchandler.js"

const healthcheck = asyncHandler ( async (_, res) => {
    
    return res
    . status (200)
    . json (
        new ApiResponse (
            200,
            {},
            "Success! Backend is operational"
        )
    )

})

export {
    healthcheck
}
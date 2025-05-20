const asyncHandler = (fn) => async (req, res, next) => {

    try {
        await fn(req, res, next);
    } catch (error) {
        console.error("Error in asyncHandler:", error.message); // Log the error message
        res.status(500).json({ message: "Internal Server Error" }); // Send a generic error response
    }

}


export { asyncHandler };
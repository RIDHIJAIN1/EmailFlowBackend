const sendSuccess = (res, message, data = null) => {
    return res.status(200).json({
        success: true,
        message,
        data,
    });
};

const sendError = (res, message, error = null, statusCode = 400) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error,
    });
};

module.exports = { sendSuccess, sendError };

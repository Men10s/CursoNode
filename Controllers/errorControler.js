module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    res.status (error.statusCode).json({
        status: error.status || 'error',
        message: error.message
    });
}
const generateErrorUtil = (msg, code) => {
    const err = new Error(msg);
    err.httpStatus = code;
    throw err;
};

export default generateErrorUtil;

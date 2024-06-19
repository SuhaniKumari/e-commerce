const error = (message, code)=>{
    let err = new   Error(message);
    err.code = code;
    return err;
}

const failed = (response, error)=>{
    console.log(error);
    response.status(error.code ? error.code : 500).json({
        success: false,
        message: error.message,
    });
}

exports.customError = error;
exports.failed = failed;
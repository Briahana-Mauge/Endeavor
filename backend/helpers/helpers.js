const storage = require('./s3Service');

const sendResponse = (response, param) => {
    response.status(403).send({
        error: true,
        message: `${param} is not of a valid input, please double check your input`,
        payload: null,
    });
}

const checkValidId = (id, request, response) => {
    if (isNaN(parseInt(id)) || id+'' !== parseInt(id)+'') {
        if (request.file) {
            storage.deleteFile(request.file.location)
        }
        sendResponse(response, id);
        return false;
    }
    return true;
}

const checkValidParams = (param, request, response) => {
    if (!param || !param.trim()) {
        if (request.file) {
            storage.deleteFile(request.file.location)
        }
        sendResponse(response, param);
        return false;
    }
    return true;
}

const checkValidEmail = (param, request, response) => {
    if (param && !param.trim() && param.trim().includes('@') && param.trim().includes('.')) {
        return true;
    }

    if (request.file) {
        storage.deleteFile(request.file.location)
    }
    sendResponse(response, param);
    return false;
}

const checkBool = (bool, request, response) => {
    if (bool && bool.trim() && (bool.trim().toLowerCase() === 'true' || bool.trim().toLowerCase() === 'false')) {
        return true;
    }

    if (request.file) {
        storage.deleteFile(request.file.location)
    }
    sendResponse(response, bool);
    return false;

}

const handleErrors = (err, request, response) => {
    console.log('ERROR: - ', err)
    if (err.code === "23505" && err.detail.includes("already exists")) {
        console.log('Attempt to register a new user/brand with a taken email')
        response.status(403).json({
          error: true,
          message: 'email already registered',
          payload: null,
        }) 
    } else if (err.message === 'No data returned from the query.') {
        console.log('No match for the selection')
        response.status(404).json({
          error: true,
          message: 'No match for the selection',
          payload: null,
        }) 
    } else if (err.code === '23503') {
        response.status(403).json({
          error: true,
          message: 'Reference error!',
          payload: null,
        }) 
    } else {
        response.status(500).json({
          error: true,
          message: 'Sorry, something went wrong (D-B)',
          payload: null
        })
    }
}

const formatStr = str => {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '')
}

module.exports = {
    checkValidId,
    checkValidParams,
    checkValidEmail,
    checkBool,
    handleErrors,
    formatStr
}
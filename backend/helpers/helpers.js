const checkValidId = (id, response) => {
    if (isNaN(parseInt(id)) || id+'' !== parseInt(id)+'') {
        response.status(403).send({
            error: true,
            message: 'Missing information',
            payload: null,
        })
        return false;
    }
    return true;
}

const checkValidParams = (param, response) => {
    if (!param || !param.trim()) {
        response.status(403).send({
            error: true,
            message: 'Missing information',
            payload: null,
        })
        return false;
    }
    return true;
}

const checkValidEmail = (param, response) => {
    if (param && !param.trim() && param.trim().includes('@') && param.trim().includes('.')) {
        return true;
    }
    response.status(403).send({
        error: true,
        message: 'Missing information',
        payload: null,
    })
    return false;
}

const checkBool = (bool, response) => {
    if (bool && bool.trim() && (bool.trim().toLowerCase() === 'true' || bool.trim().toLowerCase() === 'false')) {
        return true;
    }
    return false;
}

const handleErrors = (err, response) => {
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

module.exports = {
    checkValidId,
    checkValidParams,
    checkValidEmail,
    checkBool,
    handleErrors,
}
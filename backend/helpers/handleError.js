/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Server Error Handling Helper | Capstone App (Pursuit Volunteer Mgr)
*/


const errorResponse = require('./errorResponse');

/*
USAGE
to instantiate custom error, format: throw new Error(`<error code>__error: <msg>`);
example: throw new Error(`404__error: volunteer ${volunteerId} not found`);
*/


const handleError = (err, req, res, next) => {
  // per documentation, checking for present headers and if so, passing
  if (res.headersSent) {
    console.log("err: res headers already exist. passing error to express");
    return next(err);
  }

  // catch and parse error.messages for relevant http code
  let [ code, msg = code ] = err.message.split('__');

  // if "__" wasn't found, error was not thrown from a customized instance
  if (msg === code) {
    errorResponse(res, 500, `(back) error: ${msg}`);
  } else {

    // specific-case errors
    if (err.message === "No data returned from the query.") {
      errorResponse(res, 404, `(front) error: specific record does not exist`);
    }
    if (err.message.includes("violates unique constraint")) {
      errorResponse(res, 403, `(front) error: at least one unique datapoint of record already exists`);
    }

    // custom error handling
    res.status(parseInt(code));
    const codeClass = parseInt(code).toString()[0];
    if (codeClass === '4') {
      errorLocation = "(front)";
    } else {
      errorLocation = "(back)";
    }
    errorResponse(res, code, `${errorLocation} error: ${msg}`);
  }
};


module.exports = handleError;

/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Server Error Handling Helper | Capstone App (Pursuit Volunteer Mgr)
*/


/*
USAGE
to instantiate custom error, format: throw new Error(`<error code>__error: <msg>`);
example: throw new Error(`404__error: volunteer ${volunteerId} not found`);
*/


const errorResponse = (res, code, errorMsg) => {
  console.log(errorMsg);   // log for developer
  res.status(code);
  res.json({
      status: "fail",
      message: errorMsg,
      payload: null
  });
}


const handleError = (err, req, res, next) => {
  // per documentation, checking for present headers and if so, passing
  if (res.headersSent) {
    console.log("err: res headers already exist. passing error to express");  // msg to developer
    return next(err);
  } else {

    // specific-case (database response) errors
    if (err.code === "23503") {
      err.message = `403__error: reference error in database lookup`;
    } else if (err.code === "23505" && err.message.includes("violates unique constraint")) {
      err.message = `403__error: at least one unique datapoint of record already exists`;
    } else if (err.message === "No data returned from the query.") {
      err.message = `404__error: specific record does not exist`;
    }

    // catch and parse error.messages for relevant http code
    let [ code, msg = code ] = err.message.split('__');

    // if "__" wasn't found, error was not thrown from a customized instance
    if (msg === code) {
      errorResponse(res, 500, `(back) error: ${msg}`);
    } else {

      // create and send response
      res.status(parseInt(code));
      const codeClass = parseInt(code).toString()[0];
      if (codeClass === '4') {
        errorLocation = "(front)";
      } else {
        errorLocation = "(back)";
      }
      errorResponse(res, code, `${errorLocation} ${msg}`);
    }
  }
};


module.exports = handleError;

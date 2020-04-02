/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Server Error Handling Helper | Capstone App (Pursuit Volunteer Mgr)


USAGE
to instantiate custom error, use format:
  throw new Error(`<error code>__error: <msg>`);
example:
  throw new Error(`404__error: volunteer ${volunteerId} not found`);
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
  /* STAGE 1/5:
  Per documentation, checking for present headers and if so, pass to default Express error handler
  https://expressjs.com/en/guide/error-handling.html#the-default-error-handler
  */
  if (res.headersSent) {
    console.log("err: res headers already exist. passing error to express");  // msg to developer
    return next(err);
  } else {

    /* STAGE 2/5: intercept database response errors and customize error msgs */
    if (err.code === "23503") {
      err.message = `403__error: reference error in database lookup`;
    } else if (err.code === "23505" && err.message.includes("violates unique constraint")) {
      err.message = `403__error: at least one unique datapoint of record already exists`;
    } else if (err.message === "No data returned from the query.") {
      err.message = `404__error: specific record does not exist`;
    }

    /* STAGE 3/5: split custom error.messages for relevant http code */
    let [ code, msg = code ] = err.message.split('__');

    /* STAGE 4/5: if "__" wasn't found, error was not thrown from a customized instance and will send response here */
    if (msg === code) {
      errorResponse(res, 500, `(back) error: ${msg}`);
    } else {

      /* STAGE 5/5: custom error received. format and send response */
      res.status(parseInt(code));
      const codeClass = parseInt(code).toString()[0];
      const errorLocation = codeClass === '4'
        ? "(front)"
        : "(back)";
      errorResponse(res, code, `${errorLocation} ${msg}`);
    }
  }
};


module.exports = handleError;

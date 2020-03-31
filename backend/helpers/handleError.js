/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Server Error Handling Helper | Capstone App (Pursuit Volunteer Mgr)
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
    res.status(500);
    msg = `(back) error: ${msg}`;
    console.log(msg);
    res.json({
        status: "fail",
        message: msg,
        payload: null
    });
  } else {
    // customized error handler
    res.status(parseInt(code));
    const codeClass = parseInt(code).toString()[0];
    if (codeClass === '4') {
      errorLocation = "(front)";
    } else {
      errorLocation = "(back)";
    }
    console.log(errorLocation, msg);
    res.json({
        status: "fail",
        message: msg,
        payload: null
    });
  }
};


module.exports = handleError;

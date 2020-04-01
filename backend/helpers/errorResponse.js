/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Error Response Helper | Capstone App (Pursuit Volunteer Mgr)
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


module.exports = errorResponse;

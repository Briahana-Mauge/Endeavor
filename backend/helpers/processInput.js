/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Server Input Processing Helper | Capstone App (Pursuit Volunteer Mgr)
*/


const errorResponse = require('./errorResponse');


const varcharCheck = (softHardOrPatch, res, inputName, maxLengthNum = Infinity) => {

  // NAMING CONVENTION
  // hard- === must receive an non-empty input
  // soft- === defaults to empty string
  // patch- === translates empty input to undefined, in prep for patch routes

  /* STAGE 1/3: handle empty inputs */
  if (!input || !input.trim()) {
    switch (softHardOrPatch) {
      case "soft":  // empty input becomes EMPTY STRING
        return "";
      case "hard":  // empty input is REJECTED
        errorResponse(res, 400, `(front) error: invalid empty ${inputName} input`);
      case "patch":  // empty input returns UNDEFINED
        return;
      default:
        errorResponse(res, 500, `(back) error: invalid empty ${inputName} input`);
    }
  }

  /* STAGE 2/3: check input length against varchar limit specified */
  if (input.trim().length > maxLengthNum) {
    errorResponse(res, 400, `(front) error: ${inputName} is too long`);
  }

  /* STAGE 3/3: all checks passed, return trimmed input */
  return input.trim();
}


const processInput = (input, res, category, inputName) => {
  switch (category) {

    // for numbers that are ids
    case "idNum":
        const numCheck1 = isNaN(parseInt(input));
        const numCheck2 = input.length !== parseInt(input).toString().length;
        if (numCheck1 || numCheck2) {
          errorResponse(res, 400, `(front) error: invalid numerical ${inputName} input`);
        }
        return parseInt(input);

    // 30 length max, no empty inputs allowed
    case "hardVarchar30":
        varcharCheck("hard", res, inputName, 30);

    // 50 length max, no empty inputs allowed
    case "hardVarchar50":
        varcharCheck("hard", res, inputName, 50);

    // 150 length max but empty strings are allowed
    case "softVarchar150":
        varcharCheck("soft", res, inputName, 150);

    // no length max, empty strings are allowed
    case "softVarcharNoLimit":
        varcharCheck("soft", res, inputName);

    // for booleans
    case "bool":
        if (input !== "true" && input !== "false") {
          errorResponse(res, 404, `(front) error: invalid boolean input`);
        }
        return input;

    default:
        errorResponse(res, 500, `(back) error: you're not supposed to be here. input category unknown`);
  }
}


module.exports = processInput;

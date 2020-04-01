/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Server Input Processing Helper | Capstone App (Pursuit Volunteer Mgr)
*/


const varcharCheck = (input, softHardOrPatch, inputName, maxLengthNum = Infinity) => {

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
        throw new Error(`400__error: invalid empty ${inputName} input`);
      case "patch":  // empty input returns UNDEFINED
        return;
      default:
        throw new Error(`500__error: unknown varchar type sent to check function`);
    }
  }

  /* STAGE 2/3: check input length against varchar limit specified */
  if (input.trim().length > maxLengthNum) {
    throw new Error(`400__error: ${inputName} is longer than ${maxLengthNum} allowed`);
  }

  /* STAGE 3/3: all checks passed, return trimmed input */
  return input.trim();
}


const processInput = (input, category, inputName) => {
  switch (category) {

    // for numbers that are ids
    case "idNum":
        const numCheck1 = isNaN(parseInt(input));
        const numCheck2 = input.length !== parseInt(input).toString().length;
        if (numCheck1 || numCheck2) {
          throw new Error(`400__error: invalid numerical ${inputName} input`);
        }
        return parseInt(input);

    // 30 length max, no empty inputs allowed
    case "hardVarchar30":
        return varcharCheck(input, "hard", inputName, 30);

    // 50 length max, no empty inputs allowed
    case "hardVarchar50":
        return varcharCheck(input, "hard", inputName, 50);

    // 150 length max but empty strings are allowed
    case "softVarchar150":
        return varcharCheck(input, "soft", inputName, 150);

    // no length max, empty strings are allowed
    case "softVarcharNoLimit":
        return varcharCheck(input, "soft", inputName);

    // for booleans
    case "bool":
        if (input !== "true" && input !== "false") {
          throw new Error(`404__error: invalid boolean input`);
        }
        return input;

    default:
        throw new Error(`500__error: you're not supposed to be here. input category unknown`);
  }
}


module.exports = processInput;

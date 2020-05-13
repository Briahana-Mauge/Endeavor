/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Server Input Processing Helper | Capstone App (Pursuit Volunteer Mgr)


NAMING CONVENTION
hard- === must receive an non-empty input
soft- === defaults to empty string
patch- === translates empty input to undefined, in prep for patch routes
*/


const varcharCheck = (input, softHardOrPatch, inputName, maxLengthNum = 65536) => {
  /* STAGE 1/4: check for and handle empty inputs */
  if (!input || !input.trim()) {
    switch (softHardOrPatch) {
      case "hard":  // empty input is REJECTED
        throw new Error(`400__invalid empty ${inputName} input`);
      case "soft":  // empty input becomes EMPTY STRING
        return "";
      case "patch":  // empty input returns UNDEFINED
        return;
      default:
        throw new Error(`500__unknown varchar type sent to check function`);
    }
  }
  /* STAGE 2/4: check input length against specified varchar limit */
  if (input.trim().length > maxLengthNum) {
    throw new Error(`400__${inputName} is longer than ${maxLengthNum} allowed`);
  }
  /* STAGE 3/4: prevent submission of marker string */
  if (input.trim().includes('&$%&')) {
    throw new Error(`422__${inputName} contains forbidden character patterns. Nice try but nothing for you here`);
  }

  /* STAGE 4/4: all checks have passed, return trimmed input */
  return input.trim();
}


const processInput = (input, category, inputName, limit) => {
  switch (category) {

    // for numbers that are ids
    case "idNum":
        if (isNaN(parseInt(input)) || input.toString().length !== parseInt(input).toString().length) {
          throw new Error(`400__invalid numerical ${inputName} input`);
        }
        return parseInt(input);

    // for varchars, no empty inputs allowed
    case "hardVC":
        return varcharCheck(input, "hard", inputName, limit);

    // for varchars, empty strings return ""
    case "softVC":
        return varcharCheck(input, "soft", inputName, limit);

    // for varchars, empty strings return undefined
    case "patchVC":
        return varcharCheck(input, "patch", inputName, limit);

    // for booleans
    case "hardBool":
        // currently undefined will respond as FAIL
        if (typeof input === "boolean") return input; // lets actual booleans through
        if (input && input.trim()) { // for checking string type booleans like req.search bool params
          if (input.trim().toLowerCase() === "true") return true;
          if (input.trim().toLowerCase() === "false") return false;
        }
        throw new Error(`404__invalid boolean input`);
    
    // for booleans
    case "softBool":
        if (typeof input === "boolean") return input; // lets actual booleans through
        if (input && input.trim() && input.trim().toLowerCase() === "true") return true;
        return false;

    // for arrays
    case "array":
      if (Array.isArray(input) && input.length <= limit) return input;
      if (!input) return [];
      throw new Error(`404__error: invalid input type for ${inputName}`);

    default:
        throw new Error(`500__you're not supposed to be here. input category unknown`);
  }
}


module.exports = processInput;

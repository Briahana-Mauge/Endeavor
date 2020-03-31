/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Server Error Handling Helper | Capstone App (Pursuit Volunteer Mgr)
*/


// hard- === must receive an non-empty input
// soft- === defaults to empty string

const processInput = (input, category, inputName) => {
  switch (category) {

    // for numbers that are ids
    case "idNum":
        const numCheck1 = isNaN(parseInt(input));
        const numCheck2 = input.length !== parseInt(input).toString().length;
        if (numCheck1 || numCheck2) {
          throw new Error(`400__error: invalid ${inputName} input. please re-enter and try again`);
        }
        return parseInt(input);

    // for varchar strings with 22 length max, no empty inputs allowed
    case "hardVarchar22":
        if (!input || !input.trim()) {
          throw new Error(`400__error: empty ${inputName} input. please re-enter and try again`);
        }
        if (input.trim().length > 22) {
          throw new Error(`400__error: ${inputName} is too long. please shorten`);
        }
        return input.trim();

    // for varchar strings with 22 length max but empty strings are allowed
    case "softVarchar22":
        if (!input || !input.trim()) {
          return "";
        }
        if (input.trim().length > 22) {
          throw new Error(`400__error: ${inputName} is too long. please shorten`);
        }
        return input.trim();

    // for unlimited text inputs, no empty inputs allowed
    case "hardText":
        if (!input || !input.trim()) {
          throw new Error(`400__error: empty ${inputName}. Please enter a valid input`);
        }
        return input.trim();

    // for booleans
    case "bool":
        if (input !== "true" && input !== "false") {
          throw new Error(`404__error: invalid ${inputName} data. Please check your input`);
        }
        return input;

    default:
        throw new Error("500__error: you're not supposed to be here. input category unknown");
  }
}


module.exports = processInput;

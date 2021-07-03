/**
 * Password validator
 */
const { GlobalUtilities } = window;
/**
 * Checks inputted password with settings come from server.
 * @param {String} pass - Inputted password.
 * @param {Object} settings - Password Policy comes from server.
 * @param {String} oldPass - has value if user wants to change password.
 */
const PasswordValidator = (pass, settings, oldPass) => {
  return {
    MinLength:
      pass && (!settings.MinLength || pass.length >= settings.MinLength),
    NewCharacters:
      !oldPass ||
      (pass &&
        settings.NewCharacters &&
        GlobalUtilities.diff(pass, oldPass).length >= settings.NewCharacters),
    UpperLower:
      pass &&
      (!settings.UpperLower || (/[a-z]/g.test(pass) && /[A-Z]/g.test(pass))),
    NonAlphabetic:
      pass && (!settings.NonAlphabetic || !/^[a-zA-Z]+$/g.test(pass)),
    Number: pass && (!settings.Number || /[0-9]/g.test(pass)),
    NonAlphaNumeric:
      pass && (!settings.NonAlphaNumeric || !/^[a-zA-Z0-9]+$/g.test(pass)),
  };
};

export default PasswordValidator;

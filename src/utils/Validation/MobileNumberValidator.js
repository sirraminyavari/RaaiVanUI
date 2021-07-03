/**
 * Checks inputted number with regex.
 * @param {Number} number - mobile number
 */
const MobileNumberValidator = (number) => {
  return /(^(09)[1][1-9]\d{7}$)|(^(09)[3][12456]\d{7}$)/.test(number);
};
export default MobileNumberValidator;

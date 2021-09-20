/**
 * Checks inputted number with regex.
 * @param {Number} number - mobile number
 * @param {RegExp} regx - an expression for validating the input
 */
const { GlobalUtilities } = window;
const CustomValidator = (input, regx) => {
  return GlobalUtilities.is_valid_regexp(regx) && regx.test(input);
};
export default CustomValidator;

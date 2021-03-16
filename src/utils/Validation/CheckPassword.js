/**
 * Checks inputted password with passwordPolicy.
 */

const { default: PasswordValidator } = require('./PasswordValidator');

/**
 *
 * @param {String} pass - User inputted password
 * @param {Object} passwordPolicy  - Received from server
 * @returns Is inputted password follows all passwordPolicies or not
 * Below is 5 password policies:
 * server may choose each of them in different conditions,
 * here we check if each item has value,
 * inputted password should follow it,
 * but if the item is null, means inputted pass follows it
 */
const CheckPassword = (pass, passwordPolicy) => {
  const {
    MinLength,
    UpperLower,
    NonAlphabetic,
    Number,
    NonAlphaNumeric,
  } = PasswordValidator(pass, passwordPolicy);

  const length = passwordPolicy.MinLength ? MinLength : true;
  const upper = passwordPolicy.UpperLower ? UpperLower : true;
  const nonAlph = passwordPolicy.NonAlphabetic ? NonAlphabetic : true;
  const number = passwordPolicy.Number ? Number : true;
  const nonAlphNum = passwordPolicy.NonAlphaNumeric ? NonAlphaNumeric : true;
  console.log(length, upper, nonAlph, number, nonAlphNum, 'result pass');
  return length && upper && nonAlph && number && nonAlphNum;
};
export default CheckPassword;

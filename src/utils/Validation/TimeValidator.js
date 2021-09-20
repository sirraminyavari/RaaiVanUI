/**
 * Checks inputted time with regex.
 * @param {String} time - time
 * @param {Boolean} includeSecond - defines whether time has second or not
 */
const TimeValidator = (time, includeSecond) => {
  return includeSecond
    ? /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/.test(time)
    : /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
};
export default TimeValidator;

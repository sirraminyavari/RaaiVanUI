const { jQuery } = window;

/**
 * @description A function to capitalize strings.
 * @param {string} str -The string to transform to capital form.
 * @returns {string} The result as capitalized string.
 */
export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * @description A function to get route url.
 * @param {string} routeName -The route name to call api.
 * @param {string} [params] -An object of route parameters.
 * @returns {string} The route url path.
 */
export const getURL = (routeName, params = {}) =>
  window.RVAPI[`${capitalize(routeName)}PageURL`](params).slice(5);

/**
 * @description Check if an object is empty or not.
 * @param {Object} obj -The object to check its content.
 * @returns {boolean} The result as boolean (empty or not).
 */
export const isEmpty = (obj) => {
  return !(Object.keys(obj).length !== 0 && obj.constructor === Object);
};

/**
 * @description Help with reordering an list.
 * @param {Array} list -An Array to reorder.
 * @param {number} startIndex -The start index.
 * @param {number} endIndex -The end index.
 * @returns {boolean} The result as reordered list.
 */
export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * @typedef ParamType
 *  @property {HTMLElement} contentDom Content element.
 * @property {HTMLElement} arrowDom Arrow element.
 * @property {*} positionInfo The position info.
 * @property {string} align The align parameter.
 */

/**
 * @description Calculates an element position .
 * @param {ParamType}
 * @returns {Object} An object of arrow styles and content styles.
 */
export const calculatePosition = ({
  contentDom,
  arrowDom,
  align,
  positionInfo,
}) => {
  if (!contentDom || !arrowDom || !positionInfo) return {};

  const contentWidth = jQuery(contentDom)[0].offsetWidth;

  let ret = {
    arrowStyle: {},
    contentStyle: {},
  };

  let _moveOffset = 6,
    _movement = 0;

  if (positionInfo.leftMovement != 0 && (align == 't' || align == 'b')) {
    let movedRight = positionInfo.leftMovement > 0;
    _movement = positionInfo.leftMovement + (movedRight ? 1 : -1) * _moveOffset;
    let sideMargin = contentWidth / 2 - _movement;
    if (!movedRight) sideMargin = positionInfo.width - sideMargin - 1;

    ret.contentStyle.direction = movedRight ? 'ltr' : 'rtl';

    if (align == 'b') {
      ret.arrowStyle.margin =
        '0px ' +
        (movedRight ? 0 : sideMargin) +
        'px 0px ' +
        (movedRight ? sideMargin : 0) +
        'px';
    } else {
      let curLeft = String(jQuery(arrowDom).css('left'));
      curLeft = curLeft.length
        ? Number(curLeft.substr(0, curLeft.length - 2))
        : 0;
      ret.arrowStyle.left = curLeft - positionInfo.leftMovement + 'px';
    }
  }

  if (positionInfo.topMovement != 0 && (align == 'l' || align == 'r')) {
    var curTopMargin = String(jQuery(arrowDom).css('marginTop'));
    curTopMargin = curTopMargin.length
      ? Number(curTopMargin.substr(0, curTopMargin.length - 2))
      : 0;

    ret.arrowStyle.marginTop = curTopMargin - positionInfo.topMovement + 'px';
  }

  return ret;
};

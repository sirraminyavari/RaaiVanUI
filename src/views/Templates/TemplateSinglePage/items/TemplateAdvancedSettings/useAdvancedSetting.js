import { useEffect, useState, useContext } from 'react';
import { AdvandcedContenxt } from './TemplateAdvancedSettings';

const useAdvancedSetting = () => {
  const { RVDic, GlobalUtilities } = window;
  const [Pattern, setPattern] = useState();

  const { nodeType: item } = useContext(AdvandcedContenxt);
  useEffect(() => {
    console.log(item);
    if (item) {
      const { AdditionalIDPattern, AdditionalID } = item?.NodeTypes[0] || {};

      const p = parsePattern(AdditionalIDPattern);
      console.log(p);
      setPattern(p);
    }
  }, [item]);

  const VALID_SYMBOLS = ['-', '_', '/'];

  const VALID_ITEMS = ['AlphaNumeric']
    .concat(VALID_SYMBOLS)
    .concat([
      'FormField',
      'AreaID',
      'FVersionID',
      'PVersionID',
      'VersionCounter',
      'PYear',
      'PYearS',
      'PMonth',
      'PDay',
      'GYear',
      'GYearS',
      'GMonth',
      'GDay',
      'RND',
      'NCount',
      'NCountPY',
      'NCountGY',
      'NCountS',
      'NCountSPY',
      'NCountSGY',
    ]);

  const getFirstPart = (pattern) => {
    if (!pattern || GlobalUtilities.get_type(pattern) !== 'string') return '';

    for (var i = 0; i < VALID_ITEMS.length; ++i)
      if (pattern.indexOf(VALID_ITEMS[i]) === 0) return VALID_ITEMS[i];

    var ind = pattern.indexOf('~');
    var closeInd = pattern.indexOf(']]');

    if (ind !== 0) {
      for (var x = 0; x < VALID_SYMBOLS.length; ++x) {
        var sInd = pattern.indexOf(VALID_SYMBOLS[x]);
        if (sInd > 0) {
          return getFirstPart(pattern.substr(0, sInd));
        }
      }

      return ind < 0 ? pattern.substr(0) : pattern.substr(0, ind);
    } else if (ind === 0 && closeInd > 0)
      return pattern.substr(0, closeInd + 2);
    else return '';
  };

  const parsePattern = (pattern) => {
    let parts = [];

    while (true) {
      var firstPart = getFirstPart(pattern);

      if (!firstPart) break;

      parts.push(firstPart);
      pattern = pattern.substr(firstPart.length);
    }

    return parts.map(function (p) {
      var isTemplate = p.indexOf('~[[') >= 0 && p.indexOf(']]') >= 0;
      var isSymbol =
        !isTemplate &&
        VALID_SYMBOLS.some(function (s) {
          return s === p;
        });

      if (!isTemplate) {
        return {
          Name: isSymbol ? p : 'AlphaNumeric',
          Title: isSymbol ? p : RVDic.CN.AddIDPattern.AlphaNumeric,
          Value: isSymbol ? null : p,
        };
      } else {
        p = p.substr(3, p.length - 5);

        var elementId = !/\:[0-9A-Za-z\-]{36}$/gi.test(p || '_')
          ? ''
          : p.substr(p.length - 36);
        if (elementId) p = p.substr(0, p.length - 37);

        var firstDigit = p.match(/\d/);
        var numInd = p.indexOf(firstDigit);
        var length = numInd <= 0 ? 0 : Number(p.substr(numInd));

        if (numInd >= 0) p = p.substr(0, numInd);

        return {
          Name: p,
          Title: RVDic.CN.AddIDPattern[p] || p,
          ElementID: elementId,
          Length: isNaN(length) ? 0 : length,
        };
      }
    });
  };

  return {
    Pattern,
  };
};
export default useAdvancedSetting;

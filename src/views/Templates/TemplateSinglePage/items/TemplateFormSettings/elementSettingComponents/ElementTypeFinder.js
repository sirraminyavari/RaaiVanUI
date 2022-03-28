import formElementList from '../items/FormElements';

export const getElementType = (data) => {
  const { Type } = data;
  switch (Type) {
    case 'Text':
      return TextTypeFinder(data);
    case 'Numeric':
      return NumericTypeFinder;
    default:
      return null;
  }
};

const TextTypeFinder = (data) => {
  const { Info } = data || {};
  const _getObject = (type) => {
    const _list = formElementList() || [];
    const el = _list
      .find((x) => x?.type === 'Text')
      ?.items?.find((x) => x?.type === type);
    const _temp = el.data.Info;
    el.data = data;
    if (!el.data.Info) el.data.Info = _temp;
    return el;
  };

  if (Info.hasOwnProperty('min') || Info.hasOwnProperty('max')) {
    return _getObject('paragraph');
  } else if (
    Info.hasOwnProperty('UseSimpleEditor') &&
    !Info.hasOwnProperty('PatternName')
  ) {
    return _getObject('short text');
  } else if (
    Info.hasOwnProperty('UseSimpleEditor') &&
    Info.PatternName === 'email'
  ) {
    return _getObject('email');
  } else if (
    Info.hasOwnProperty('UseSimpleEditor') &&
    Info.PatternName === 'url'
  ) {
    return _getObject('url');
  }
};

const NumericTypeFinder = (data) => {
  const _getObject = (type) => {
    const _list = formElementList() || [];
    const el = _list
      .find((x) => x?.type === 'Numeric')
      ?.items?.find((x) => x?.type === type);
    const _temp = el.data.Info;
    el.data = data;
    if (!el.data.Info) el.data.Info = _temp;
    return el;
  };
  return _getObject(data?.Type);
};

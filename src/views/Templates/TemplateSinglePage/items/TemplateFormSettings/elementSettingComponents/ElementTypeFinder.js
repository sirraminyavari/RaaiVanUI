import formElementList from '../items/FormElements';

export const getElementType = (data) => {
  const { Type } = data;
  switch (Type) {
    case 'Text':
      return TextTypeFinder(data);
    case 'Numeric':
      return NumericTypeFinder(data);
    default:
      return getObject(data);
  }
};

const TextTypeFinder = (data) => {
  const { Info } = data || {};
  console.log(Info);
  const _getObject = (type) => {
    const _list = formElementList() || [];
    let el =
      type !== 'phone'
        ? _list
            .find((x) => x?.type === 'Text')
            ?.items?.find((x) => x?.type === type) || {}
        : _list
            .find((x) => x?.type === 'Numeric')
            ?.items?.find((x) => x?.type === type) || {};
    console.log(el);
    return { ...el, data };
  };

  if (
    (Info?.hasOwnProperty('min') || Info?.hasOwnProperty('max')) &&
    !Info?.hasOwnProperty('PatternName')
  ) {
    return _getObject('paragraph');
  } else if (
    Info?.hasOwnProperty('UseSimpleEditor') &&
    !Info?.hasOwnProperty('PatternName')
  ) {
    return _getObject('short text');
  } else if (
    Info?.hasOwnProperty('UseSimpleEditor') &&
    Info?.PatternName === 'email'
  ) {
    return _getObject('email');
  } else if (
    Info?.hasOwnProperty('UseSimpleEditor') &&
    (Info?.PatternName === 'mobile' ||
      Info?.PatternName === 'phone' ||
      Info?.PatternName === 'phoneByNationalCode')
  ) {
    return _getObject('phone');
  } else if (
    Info?.hasOwnProperty('UseSimpleEditor') &&
    Info?.PatternName === 'url'
  ) {
    return _getObject('url');
  }
};

const NumericTypeFinder = (data) => {
  const { Info } = data || {};
  const _getObject = (type) => {
    const _list = formElementList() || [];
    const el = _list
      .find((x) => x?.type === 'Numeric')
      ?.items?.find((x) => x?.type === type);
    return { ...el, data: data };
  };
  if (Info?.hasOwnProperty('currency')) {
    return _getObject('Numeric');
  } else {
    return _getObject('Rating');
  }
};

const getObject = (data) => {
  const { Type } = data;
  const _list =
    formElementList()
      .map((x) => x?.items)
      .flat() || [];
  const el = _list.find((x) => x?.data?.Type === Type);
  return { ...el, data: data };
};

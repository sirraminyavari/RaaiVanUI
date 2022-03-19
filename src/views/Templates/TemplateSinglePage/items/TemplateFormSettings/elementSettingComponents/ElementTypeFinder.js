const getElementType = (data) => {
  const { Info } = data;
  if (Info === {} || Info === null) {
    return 'paragraph';
  } else if (
    Info.hasOwnProperty('UseSimpleEditor') &&
    !Info.hasOwnProperty('PatternName')
  ) {
    return 'short text';
  } else if (
    Info.hasOwnProperty('UseSimpleEditor') &&
    Info.PatternName === 'email'
  ) {
    return 'email';
  } else if (
    Info.hasOwnProperty('UseSimpleEditor') &&
    Info.PatternName === 'url'
  ) {
    return 'url';
  }
};

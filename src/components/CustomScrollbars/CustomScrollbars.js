import { Scrollbars } from 'react-custom-scrollbars';

const CustomScrollbars = (props) => {
  const {
    children,
    trackHorizontalClass,
    trackVerticalClass,
    thumbHorizontalClass,
    thumbVerticalClass,
    viewClass,
    scrollbarStyles,
    ...restProps
  } = props;

  const renderTrackHorizontal = (props) => (
    <div {...props} className={trackHorizontalClass} />
  );

  const renderTrackVertical = (props) => (
    <div {...props} className={trackVerticalClass} />
  );

  const renderThumbHorizontal = (props) => (
    <div {...props} className={thumbHorizontalClass} />
  );

  const renderThumbVertical = (props) => (
    <div {...props} className={thumbVerticalClass} />
  );

  const renderView = (props) => <div {...props} className={viewClass} />;

  return (
    <Scrollbars
      style={{ ...scrollbarStyles }}
      renderTrackHorizontal={renderTrackHorizontal}
      renderTrackVertical={renderTrackVertical}
      renderThumbHorizontal={renderThumbHorizontal}
      renderThumbVertical={renderThumbVertical}
      renderView={renderView}
      {...restProps}>
      {children}
    </Scrollbars>
  );
};

export default CustomScrollbars;

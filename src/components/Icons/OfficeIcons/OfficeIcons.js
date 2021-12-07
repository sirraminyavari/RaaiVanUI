import {
  SiMicrosoftexcel,
  SiMicrosoftword,
  SiMicrosoftpowerpoint,
} from 'react-icons/si';

/**
 * @typedef PropType
 * @type {Object}
 * @property {('excel' | 'powerpoint')} type - The type of the office icon.
 */

/**
 *  @description Renders an office icon.
 * @component
 * @param {PropType} props -Props that pass to component.
 */
const OfficeIcons = (props) => {
  const { type, ...rest } = props;
  switch (type) {
    case 'excel':
      return <SiMicrosoftexcel {...rest} />;

    case 'powerpoint':
      return <SiMicrosoftpowerpoint {...rest} />;

    default:
      return <SiMicrosoftword {...rest} />;
  }
};

export default OfficeIcons;

// import { CRow, CCol } from '@coreui/react';
// import { useSelector } from 'react-redux';
// import { isRtl } from '../../../utils/helpers';
import useWindowContext from 'hooks/useWindowContext';

const Space = ({ children, space = '.5rem', style }) => {
  const { RV_RTL, RVDic, RV_Direction } = useWindowContext();
  //   const language = useSelector((state) => state.theme.language);
  const margin = RV_RTL ? 'marginLeft' : 'marginRight';

  const count = children.length;
  return (
    <div style={style}>
      {children.map((element, i) => {
        return (
          <span
            style={{
              display: 'inline',
              [margin]: count - 1 !== i ? space : '0',
            }}
          >
            {element}
          </span>
        );
      })}
    </div>
  );
};

export default Space;

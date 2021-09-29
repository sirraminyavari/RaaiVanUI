/**
 * Renders a list of history log in form of time line for node page side.
 */
import * as Styled from 'views/Node/nodeDetails/NodeDetails.style';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import TimeLineItem from './TimeLineItem';

const LogTimeLine = () => {
  return (
    <PerfectScrollbar>
      <Styled.TimeLineContainer>
        {[...Array(10).keys()].map((item, index, self) => {
          const isLast = self.length === index + 1;
          return <TimeLineItem isLast={isLast} key={item} />;
        })}
      </Styled.TimeLineContainer>
    </PerfectScrollbar>
  );
};

export default LogTimeLine;

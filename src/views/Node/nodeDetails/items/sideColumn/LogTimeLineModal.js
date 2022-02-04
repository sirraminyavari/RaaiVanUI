/**
 * Renders a list of history log in form of time line for node page side.
 */
import * as Styled from 'views/Node/nodeDetails/NodeDetails.style';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';
import TimeLineItem from './TimeLineItem';

const LogTimeLine = () => {
  return (
    <ScrollBarProvider>
      <Styled.TimeLineContainer>
        {[...Array(10).keys()].map((item, index, self) => {
          const isLast = self.length === index + 1;
          return <TimeLineItem isLast={isLast} key={item} />;
        })}
      </Styled.TimeLineContainer>
    </ScrollBarProvider>
  );
};

export default LogTimeLine;

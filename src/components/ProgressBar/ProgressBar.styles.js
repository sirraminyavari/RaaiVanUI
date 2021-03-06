import styled from 'styled-components';

export const ProgressBarContainer = styled.div`
  border-radius: 0.2rem;
  margin: 1rem;
  padding: 0.3rem;
  box-shadow: 0px 0px 2px #777;
  text-align: center;
`;

export const ProgressBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ProgressBar = styled.div`
  border-radius: 1rem;
  margin: 0.5rem 0.5rem 0.2rem 0.5rem;
  box-shadow: 0px 0px 2px #000;
  flex-grow: 1;
  overflow: hidden;
  height: 0.9rem;
  color: #fff;
`;

export const Percentage = styled.div`
  position: absolute;
  top: -1.1rem;
  right: ${({ progress }) => `${progress}%`};
`;

export const Bar = styled.div`
  background-color: ${({ color }) => color};
  width: ${({ progress }) => `${progress}%`};
  height: 100%;
  font-weight: bold;
  transition: all 0.5s ease;
`;

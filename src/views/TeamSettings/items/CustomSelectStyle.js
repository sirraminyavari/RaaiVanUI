import styled from 'styled-components';

export const IndicatorIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.5rem;
  width: 1.5rem;
  background-color: var(--rv-gray-color-light);
  color: var(--rv-color);
  line-height: 1.5rem;
  border-radius: 100%;
`;

export const ThumbnailOptionContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export const Thumbnail = styled.img`
  border-radius: 100%;
  height: 1.5rem;
  width: 1.5rem;
`;

export const ThumbnailControllerContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: fit-content;
`;

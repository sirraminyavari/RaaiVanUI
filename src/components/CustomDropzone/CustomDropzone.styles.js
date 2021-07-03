import styled from 'styled-components';

export const DropzoneContainer = styled.div`
  border: 0.15rem dashed #2b388f;
  margin: 0 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.3rem;
  display: flex;
  justify-content: end;
  align-items: center;
`;

export const UploadIconWrapper = styled.div`
  border: 2px solid transparent;
  display: inline-block;
  border-radius: 50%;
  line-height: 0.8rem;
  padding: 0.2rem 0.3rem;
  background-color: #2b388f;
`;

export const InputWrapper = styled.div`
  font-size: 1rem;
  margin: 0 1rem;
`;

export const ThumbsContainer = styled.aside`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

export const Thumb = styled.div`
  display: inline-flex;
  border-radius: 0.3rem;
  border: 0.2rem solid #999;
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
  width: 8rem;
  height: 8rem;
  padding: 0.4rem;
  box-sizing: border-box;
`;

export const ThumbInner = styled.div`
  display: flex;
  min-width: 0;
  overflow: hidden;
`;

export const ThumbImage = styled.img`
  display: block;
  width: auto;
  height: 100%;
  border-radius: 0.3rem;
`;

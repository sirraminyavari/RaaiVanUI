import styled from 'styled-components';
import { useMediaQuery } from 'react-responsive';

export const Container = styled.div`
  border-radius: 0.35rem;
  position: relative;
  box-shadow: 1px 5px 15px #0000001f;
  margin: 1.5rem;
  padding: 1.5rem;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  padding: 0.3rem;
`;

export const GridButton = styled.div`
  display: grid
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 2px
`;

export const ExcelContainer = styled.div`
  display: flex;
  margin: 0rem 1rem;
  align-items: center;
  padding: 0.5rem;

  &:hover {
    cursor: pointer;
    border-radius: 50px;
    border: 0.01rem solid gray;
    // padding: 0.6rem;
  }
`;
export const DateContainer = styled.div`
  display: flex;
  margin: 0rem 0.8rem;
  align-items: center;
  // padding: 0.01rem;
  &:hover {
    cursor: pointer;
    // border-radius: 50px;
    // border: 0.01rem solid gray;
    // padding: 0.4rem;
  }
`;
export const Grid = styled.div`
  @media (max-width: 320px) {
    display: grid;
    // style={{ display: 'flex', justifyContent: 'space-between' }}
    // justify-content: space-between;
    //  padding: .2rem;
    // flex-wrap: wrap;
    // margin: 0 -8px 0 -8px
  }
  @media (min-width: 620px) {
    display: flex;
    justify-content: space-between;
  }
`;

// export const BtnGrid = styled.div`
// display: flex;
// justify-content: space-between;
//  flex-wrap: no-wrap;
// // grid-template-columns: repeat(5, 1fr);
// // grid-gap: 2px

//   @media (max-width:680px) {
//     // display: flex;
//     display: grid;
//     grid-template-columns: repeat(2, 4fr)!important;
//     grid-gap: 2px
//   }
// `;

export const BtnGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  // flex-direction: column;
  // gap: 0.25rem;
  // padding: 0.25rem;
  align-items: center;
  grid-area: content;
  // justify-content: center;
  @media (max-width: 870px) {
    // flex-direction: column;
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 550px) {
    // flex-direction: column;
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 450px) {
    // flex-direction: column;
    align-items: center;
    text-align: center;
    grid-template-columns: repeat(1, 1fr);
  }
`;
export const btn = styled.div`
  // background: #a6b8b9;
  // padding: 0.25rem;
  width: 100%;
  height: 100%;
`;
export const Inpt = styled.div`
  // @media (max-width:320px) {display: grid !important;margin-bottom: .2rem !important;}
  @media (min-width: 920px) {
    min-width: 480px !important;
  }
`;

export const Mcontain = styled.div`
  // display: flex;
  // align-item: center;
  // @media (max-width:320px) { margin-top: 10px!important}

  // style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}
`;

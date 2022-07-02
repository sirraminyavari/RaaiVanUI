import style from 'styled-components';

export const Wellcoming = style.div`
    paddding: 25px;
`;
export const WellcomingTitle = style.div`
    text-align: center;
    font-weight: bold;
    margin-bottom: 15px
`;
export const WellcomingContent = style.p`
    text-align: justify;
    font-weight: 300;
    font-size: 12px;
    margin-bottom: 8px;
    line-height: 20px;
`;
export const WellcomingActionWrapper = style.div`
    text-align: center;
    margin-top: 35px;
`;
export const NextButton = style.button`
    outline: none;
    border: none;
    background-color: #1565c0;
    color: white;
    border-radius: 8px;
    height: 32px;
    font-size: 13px;
    font-weight: 300;
    padding: 0 20px;
    cursor: pointer;
`;
export const PrevButton = style(NextButton)`
    background-color: #ef6c00
`;
export const TourDescription = style.div`
    text-align: justify;
    padding: 15px 0;
    font-size: 12px;
    line-height: 20px;
`;
export const TourWapper = style.div`
    padding: 15px
`;
export const TourActionBar = style.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 20px;
`;
export const TourBarBlock = style.div`
    span {
        margin-inline-end: 6px;
        font-size: 14px;
    }
`;

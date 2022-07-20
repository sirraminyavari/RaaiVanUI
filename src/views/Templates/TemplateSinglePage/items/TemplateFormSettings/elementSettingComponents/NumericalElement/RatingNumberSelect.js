import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';
import { FLEX_CCC, FLEX_RCS } from 'constant/StyledCommonCss';
import { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import produce from 'immer';
import { AiFillStar, AiOutlineStar, BsStar, BsStarFill } from 'react-icons/all';

const RatingNumberSelect = ({ current, setFormObjects }) => {
  const { ViewType, rateNumber } = current?.data?.Info || {};

  const numberoption = useCallback(() => {
    return Array(10)
      .fill(1)
      .map((l, i) => l + i)
      .map((i) => ({
        value: i,
        label: `${i} عددی`,
      }));
  }, []);

  const handleRateNumberChange = ({ value }) => {
    setFormObjects(
      produce((d) => {
        let _current = d?.find((x) => x?.id === current?.id);
        _current.data.Info.rateNumber = value;
      })
    );
  };

  return (
    <Container>
      <SelectWrapper>
        <CustomSelect
          options={numberoption()}
          defaultValue={{
            value: rateNumber,
            label: numberoption()?.find(({ value }) => value === rateNumber)
              ?.label,
          }}
          onChange={handleRateNumberChange}
        />
      </SelectWrapper>

      {ViewType === 'stars' && <StarsPreview number={rateNumber} />}

      {ViewType === 'numeric' && <NumericPreview number={rateNumber} />}
    </Container>
  );
};

const NumericPreview = ({ number }) => {
  const row = useMemo(() => {
    const breakPoint = Math.floor(number / 2);
    return Array(number)
      .fill(1)
      .map((l, i) => l + i)
      .map((x) => {
        return x <= breakPoint ? (
          <NumberItem selected={true}>{x}</NumberItem>
        ) : (
          <NumberItem selected={false}>{x}</NumberItem>
        );
      });
  }, [number]);

  return <PreviewContainer>{row}</PreviewContainer>;
};

const StarsPreview = ({ number }) => {
  const row = useMemo(() => {
    const breakPoint = Math.floor(number / 2);
    return Array(number)
      .fill(1)
      .map((l, i) => l + i)
      .map((x) => {
        return x <= breakPoint ? (
          <StarItem selected={true}>
            <BsStarFill size={28} />
          </StarItem>
        ) : (
          <StarItem selected={false}>
            <BsStar size={28} />
          </StarItem>
        );
      });
  }, [number]);
  return <PreviewContainer>{row}</PreviewContainer>;
};

const Container = styled.div`
  ${FLEX_RCS};
  gap: 2.5rem;
  max-width: 40rem;
  width: 100%;
`;

const SelectWrapper = styled.div`
  width: 100%;
  max-width: 16rem;
`;

const PreviewContainer = styled.div`
  ${FLEX_RCS};
  flex-direction: row-reverse;
  gap: 0.5rem;
  max-width: 24.5rem;
  width: 100%;
`;

const NumberItem = styled.div`
  width: 2rem;
  aspect-ratio: 1;
  ${FLEX_CCC};
  border-radius: 100%;
  ${({ selected }) =>
    selected
      ? 'color: var(--rv-color); border: 0.0625rem solid var(--rv-color); box-shadow: 0px 0px 6px #2B7BE433;'
      : 'color: var(--rv-color-distant); border: 0.0625rem solid var(--rv-color-distant);'}
`;

const StarItem = styled.div`
  width: 2rem;
  aspect-ratio: 1;
  ${FLEX_CCC};
  ${({ selected }) =>
    selected ? 'color: var(--rv-color);' : 'color: var(--rv-color-distant);'}
`;

export default RatingNumberSelect;

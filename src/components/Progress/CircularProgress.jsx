import React, { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';

const { GlobalUtilities, RV_RTL } = window;

const CircularProgress = ({
  size = '2rem',
  animate = true,
  duration = 1,
  auto = true,
  countDown = true,
  minValue,
  maxValue = 100,
  color = '#ff9f00',
  hideChannel,
  channelColor = '#eee',
  hideLabel,
  label,
  textColor = '#666',
  textSize = '0.8rem',
  onUpdate,
}) => {
  minValue = !minValue || isNaN(minValue) ? 0 : +minValue;
  maxValue = isNaN(maxValue) ? 100 : +maxValue;

  if (minValue > maxValue) {
    minValue = 0;
    maxValue = 100;
  }

  const [value, setValue] = useState(auto ? maxValue : minValue);

  useEffect(() => {
    if (GlobalUtilities.get_type(onUpdate) == 'function') onUpdate(value);
  }, [value]);

  if (auto) {
    let newValue = countDown ? value - 1 : value + 1;
    if (newValue >= minValue && newValue <= maxValue) {
      setTimeout(() => setValue(newValue), 1000);
    }
  }

  let progressValue =
    isNaN(+value) || value < minValue
      ? minValue
      : value > maxValue
      ? maxValue
      : value;
  progressValue = Math.round(
    ((progressValue - minValue) / (maxValue - minValue)) * 100
  );

  return (
    <div
      style={{
        width: size,
        height: size,
        justifyContent: 'space-around',
      }}>
      <svg
        viewBox="0 0 36 36"
        style={{
          width: '100%',
          height: '100%',
        }}>
        {!hideChannel && (
          <Channel
            channelColor={channelColor}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        )}
        <Line
          color={color}
          animate={animate}
          duration={duration}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          strokeDasharray={`${progressValue}, 100`}
        />
        {!hideLabel && (
          <Text
            x="18"
            y={RV_RTL ? '22' : '20.35'}
            textColor={textColor}
            textSize={textSize}>
            {label || value}
          </Text>
        )}
      </svg>
    </div>
  );
};

export default CircularProgress;

const Channel = styled.path`
  fill: none;
  ${({ channelColor }) => channelColor && `stroke: ${channelColor};`}
  stroke-width: 3.8;
`;

const Progress = keyframes`
    0% { stroke-dasharray: 0 100; }
`;

const Line = styled.path`
  fill: none;
  stroke-width: 2.8;
  stroke-linecap: round;
  ${({ color }) => color && `stroke: ${color};`}
  ${({ animate, duration }) =>
    animate &&
    css`
      animation: ${Progress} ${duration}s ease-out forwards;
    `}
`;

const Text = styled.text`
  ${({ textColor }) => `fill: ${textColor};`}
  ${({ textSize }) => `font-size: ${textSize};`}
    text-anchor: middle
`;

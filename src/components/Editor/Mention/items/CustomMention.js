import React from 'react';

const CustomMention = (props) => {
  const { type, link } = props.mention;
  return (
    <a style={{ textDecoration: 'none' }} href={link}>
      <span
        {...props}
        className={props.className}
        style={{
          backgroundColor:
            type === 'people' ? 'red' : type === 'date' ? 'green' : 'purple',
          borderRadius: 23,
          padding: 10,
          color: 'white',
        }}>
        {props.decoratedText}
        {console.log(props, 'props')}
      </span>
    </a>
  );
};
export default CustomMention;

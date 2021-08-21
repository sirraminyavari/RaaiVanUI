import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CustomCarousel = ({ children }) => {
  const settings = {
    dots: false,
    speed: 500,
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    rtl: true,
  };

  if (!children) return <></>;

  return <Slider {...settings}>{children}</Slider>;
};

export default CustomCarousel;

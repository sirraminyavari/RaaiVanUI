import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
//! Import Swiper styles
import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';

const CustomSwiper = (props) => {
  const { children, spaceBetween, slidesPerView, freeMode, grabCursor } = props;
  return (
    <Swiper
      slidesPerView={slidesPerView}
      grabCursor={!!grabCursor}
      spaceBetween={spaceBetween}
      freeMode={!!freeMode}>
      {children &&
        children.map((child) => {
          return <SwiperSlide>{child}</SwiperSlide>;
        })}
    </Swiper>
  );
};

export default CustomSwiper;

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
//! Import Swiper core and required modules.
import SwiperCore, { Pagination } from 'swiper/core';
//! Import Swiper styles.
import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';

//! Install Swiper modules
SwiperCore.use([Pagination]);

const CustomSwiper = (props) => {
  const {
    children,
    spaceBetween,
    slidesPerView,
    freeMode,
    grabCursor,
    pagination,
  } = props;

  return (
    <Swiper
      pagination={!!pagination}
      slidesPerView={slidesPerView}
      grabCursor={!!grabCursor}
      spaceBetween={spaceBetween}
      freeMode={!!freeMode}>
      {children &&
        children.map((child, index) => {
          return <SwiperSlide key={index}>{child}</SwiperSlide>;
        })}
    </Swiper>
  );
};

export default CustomSwiper;

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
//! Import Swiper core and required modules.
import SwiperCore, { Pagination, Scrollbar } from 'swiper/core';
//! Import Swiper styles.
import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';
import 'swiper/components/scrollbar/scrollbar.min.css';

//! Install Swiper modules
SwiperCore.use([Pagination, Scrollbar]);

const CustomSwiper = (props) => {
  const {
    children,
    spaceBetween,
    slidesPerView,
    freeMode,
    grabCursor,
    pagination,
    scrollbar,
    autoHideScrollbar,
  } = props;

  return (
    <Swiper
      pagination={
        !!pagination
          ? {
              clickable: true,
            }
          : false
      }
      slidesPerView={slidesPerView}
      grabCursor={!!grabCursor}
      scrollbar={!!scrollbar ? { hide: autoHideScrollbar } : false}
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

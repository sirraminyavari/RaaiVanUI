import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
//! Import Swiper core and required modules.
import SwiperCore, { Pagination, Scrollbar, Navigation } from 'swiper/core';
//! Import Swiper styles.
import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';
import 'swiper/components/scrollbar/scrollbar.min.css';
import 'swiper/components/navigation/navigation.min.css';

//! Install Swiper modules
SwiperCore.use([Pagination, Scrollbar, Navigation]);

const CustomSwiper = (props) => {
  const {
    children,
    spaceBetween,
    slidesPerView,
    freeMode,
    grabCursor,
    pagination,
    scrollbar,
    navigation,
    numberBullet,
    autoHideScrollbar,
  } = props;

  const customPagination = {
    clickable: true,
    renderBullet: (index, className) => {
      return `<span class='${className}'>${index + 1}</span>`;
    },
  };

  const getPagination = () => {
    if (!numberBullet) {
      return { clickable: true };
    }

    return customPagination;
  };

  return (
    <Swiper
      pagination={!!pagination ? getPagination() : false}
      slidesPerView={slidesPerView}
      grabCursor={!!grabCursor}
      hashNavigation={{
        watchState: !!pagination,
      }}
      navigation={!!navigation}
      scrollbar={!!scrollbar ? { hide: autoHideScrollbar } : false}
      spaceBetween={spaceBetween}
      freeMode={!!freeMode}>
      {children &&
        children.map((child, index) => {
          return (
            <SwiperSlide data-hash={`slide-${index}`} key={index}>
              {child}
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
};

export default CustomSwiper;

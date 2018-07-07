$(document).ready(function() {
  $(".prices-slider").slick({
    infinite: true,
    arrows: true,
    // autoplay: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true
        }
      }
    ]
  });
});

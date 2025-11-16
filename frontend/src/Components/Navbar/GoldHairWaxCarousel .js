import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getsOffers } from "../../actions/productAction";
import { useNavigate } from "react-router-dom";

function getTimeRemaining(endtime) {
  const total = Date.parse(endtime) - Date.now();
  if (total <= 0) return null;

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { total, days, hours, minutes, seconds };
}

const OfferTypeCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products = [] } = useSelector((state) => state.offerState);
  const [timers, setTimers] = useState({});

  useEffect(() => {
    dispatch(getsOffers);
  }, [dispatch]);

  const uniqueOffersMap = {};
  products.forEach((product) => {
    product.offers?.forEach((offer) => {
      if (
        offer.active &&
        Date.parse(offer.offerEndDate) > Date.now() &&
        !uniqueOffersMap[offer.offerType]
      ) {
        uniqueOffersMap[offer.offerType] = {
          offerType: offer.offerType,
          offerStartDate: offer.offerStartDate,
          offerEndDate: offer.offerEndDate,
        };
      }
    });
  });
  const uniqueOffers = Object.values(uniqueOffersMap);

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimers = {};
      uniqueOffers.forEach((offer) => {
        updatedTimers[offer.offerType] = getTimeRemaining(offer.offerEndDate);
      });
      setTimers(updatedTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [uniqueOffers]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    adaptiveHeight: true,
    cssEase: "ease-in-out",
    swipeToSlide: true,
    pauseOnFocus: true,
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Slider {...settings}>
        {uniqueOffers.map((offer) => {
          const time = timers[offer.offerType];
          const expired = !time;

          return (
            <div
              key={offer.offerType}
              className="relative rounded-2xl shadow-2xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-100 p-12 flex flex-col justify-center items-center text-center"
            >
              <h2 className="text-5xl font-extrabold text-yellow-900 drop-shadow-md mb-6 tracking-wide">
                {offer.offerType}
              </h2>

              <p className="mb-1 text-yellow-800 font-semibold">
                <span className="opacity-70">Start:</span>{" "}
                {new Date(offer.offerStartDate).toLocaleString()}
              </p>
              <p className="mb-8 text-yellow-800 font-semibold">
                <span className="opacity-70">End:</span>{" "}
                {new Date(offer.offerEndDate).toLocaleString()}
              </p>

              <div
                className={`mb-10 text-2xl font-semibold rounded-lg px-8 py-4 w-max select-none shadow-lg ${
                  expired
                    ? "bg-red-700 text-white"
                    : "bg-yellow-600 text-black"
                }`}
              >
                {expired ? (
                  "Offer Expired"
                ) : (
                  <>
                    Expires in:{" "}
                    <span className="font-mono tracking-widest">
                      {time.days}d {time.hours}h {time.minutes}m {time.seconds}s
                    </span>
                  </>
                )}
              </div>

              <button
                className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-black font-semibold text-lg px-12 py-4 rounded-full shadow-xl
                            hover:from-yellow-700 hover:to-orange-700 hover:scale-110 transition-transform duration-300 ease-in-out active:scale-95 focus:outline-none focus:ring-4 focus:ring-yellow-400"
                onClick={() => navigate(`/offers/${encodeURIComponent(offer.offerType)}`)}
                aria-label={`Shop now for ${offer.offerType}`}
              >
                <ShoppingBag className="w-8 h-8" />
                Shop Now
              </button>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default OfferTypeCarousel;

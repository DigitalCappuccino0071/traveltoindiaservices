'use client';
import Image from 'next/image';
import { useRef } from 'react';
// import formBanner from '../../../../public/assets/images/india/home/banner.webp';
import bannerBig from '../../../../public/assets/images/india/home/banner.webp';
const BannerPage = ({ heading, buttonTitle }) => {
  const ref = useRef(null);
  // const isInView = useInView(ref, { once: true });

  return (
    <div className="mt-[80px] relative overflow-hidden">
      <div className="relative w-full h-auto md:h-[400px] overflow-hidden">
        <Image
          loading="lazy"
          src={bannerBig}
          alt="banner"
          className="object-cover w-full"
        />
      </div>
      <div className="absolute top-0 left-0 w-full h-full text-white bg-gradient-to-r from-black/10 via-black/10 to-transparent">
        <div className="container p-0">
          <div className="space-y-10 flex flex-col md:h-[80vh] h-96  justify-center w-[80%]">
            {/* <h2 className="pt-10 text-2xl font-extrabold text-white md:text-5xl">
              {heading}
            </h2> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerPage;

import Image from "next/image";
import React from "react";

const ArtistImage = () => {
  return (
    <div className="flex justify-center gap-[-100px] relative pt-10">
      <Image
        src="/images/hero/hero-one.jpg"
        alt="artist-image"
        layout="responsive"
        height={700}
        width={300}
        className="max-w-[250px] md:max-w-[275px] rounded-3xl border-6 border-white shadow-xl -rotate-10 translate-y-4 md:translate-y-6 relative left-44 -top-24 md:left-4 md:top-6 z-10"
      />
      <Image
        src="/images/hero/hero-two.jpg"
        alt="artist-image"
        layout="responsive"
        height={700}
        width={300}
        className="max-w-[250px] md:max-w-[300px] rounded-3xl border-6 border-white shadow-2xl rotate-0 relative z-20 scale-105"
      />
      <Image
        src="/images/hero/hero-three.jpg"
        alt="artist-image"
        layout="responsive"
        height={700}
        width={300}
        className="max-w-[250px] md:max-w-[275px] rounded-3xl border-6 border-white shadow-xl rotate-10 translate-y-4 md:translate-y-6 relative right-50 top-14 md:top-6 md:right-4 z-10"
      />
    </div>
  );
};

export default ArtistImage;

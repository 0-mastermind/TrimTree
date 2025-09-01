import Image from "next/image";
import React from "react";

const ArtistImage = () => {
  return (
    <div className="flex justify-center gap-[-100px] relative">
      <Image
        src="/images/hero/hero-one.jpg"
        alt="artist-image"
        height={700}
        width={300}
        className="rounded-3xl border-8 border-white shadow-xl -rotate-8 translate-y-6 relative z-10"
      />
      <Image
        src="/images/hero/hero-two.jpg"
        alt="artist-image"
        height={700}
        width={300}
        className="rounded-3xl border-8 border-white shadow-2xl rotate-0 relative z-20 scale-105"
      />
      <Image
        src="/images/hero/hero-three.jpg"
        alt="artist-image"
        height={700}
        width={300}
        className="rounded-3xl border-8 border-white shadow-xl rotate-8 translate-y-6 relative z-10"
      />
    </div>
  );
};

export default ArtistImage;

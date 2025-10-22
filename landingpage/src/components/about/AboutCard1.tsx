import Image from "next/image";

const AboutCard1 = () => {
  return (
    <div className="w-full flex lg:flex-row flex-col gap-6 md:gap-8 lg:gap-10 xl:gap-12">
      {/* Image Section */}
      <div className="w-full relative min-h-[300px] max-h-[400px] lg:min-h-[400px] lg:max-h-[600px]">
        <Image
          src="/images/about/about1.webp"
          alt="About Velvera Salon"
          fill
          priority
          className="rounded-2xl object-cover"
        />
      </div>

      {/* Text Section */}
      <div className="w-full flex flex-col justify-center items-start px-4 sm:px-6 lg:px-8 xl:px-12">
        <h6 className="text-left text-sm sm:text-base md:text-lg text-[var(--text-primary)] font-secondary capitalize">
          - Introduction
        </h6>
        <h1 className="my-4 sm:my-6 md:my-8 lg:my-10 text-3xl lg:text-4xl xl:text-4xl text-left text-[var(--text-primary)] font-light leading-relaxed">
          Welcome to Velvera, your destination for hair care
        </h1>
        <p className="text-left mt-2 sm:mt-3 font-secondary px-1 sm:px-2 text-[var(--text-gray-light)] text-lg md:text-lg leading-relaxed">
          We combine expert techniques with premium products to give your hair the care it deserves. From styling to treatments, we ensure every visit leaves you feeling confident & cared for.
        </p>
      </div>
    </div>
  );
};

export default AboutCard1;

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
      <div className="w-full flex flex-col items-start px-4 sm:px-6 lg:px-8 xl:px-12">
        <h1 className="mb-4 text-3xl lg:text-4xl xl:text-4xl text-left text-[var(--text-primary)] font-light leading-relaxed">
          Welcome to Trim Tree Salon, your destination for self care
        </h1>
        <p className="text-left font-secondary px-1 sm:px-2 text-[var(--text-gray-light)] text-lg md:text-lg leading-relaxed">
          We combine expert techniques with premium products to enhance your
          beauty and well-being. From rejuvenating treatments to flawless
          styling, every visit leaves you feeling confident, refreshed, and
          cared for.
        </p>
      </div>
    </div>
  );
};

export default AboutCard1;

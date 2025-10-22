import Image from "next/image";

const AboutCard2 = () => {
  const features = [
    {
      title: "Expertise",
      description: "Precision styling by skilled professionals",
    },
    {
      title: "Quality",
      description: "Top-tier products for lasting results",
    },
    {
      title: "Personalization",
      description: "Tailored care for your unique hair",
    },
  ];
  return (
    <div className="w-full flex flex-col-reverse lg:flex-row  gap-6 md:gap-8 lg:gap-10 xl:gap-12">
      <div className="w-full flex flex-col justify-center items-start px-4 sm:px-6 lg:px-8 xl:px-12">
        <h6 className="text-left text-sm sm:text-base md:text-lg text-[var(--text-primary)] font-secondary capitalize">
          - Why Choose Us
        </h6>
        <h1 className="my-4 sm:my-6 md:my-8 lg:my-10 text-3xl lg:text-4xl xl:text-4xl text-left text-[var(--text-primary)] font-light leading-relaxed">
          Why TrimTree is the right choice for your hair
        </h1>
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="bg-[var(--bg-primary)] h-4 w-4 rounded-full flex-shrink-0 mt-1.5"></div>
              <div>
                <span className="text-md sm:text-base md:text-lg text-[var(--text-primary)] font-secondary capitalize">
                  {feature.title}
                </span>
                <span className="sm:mt-3 font-secondary px-1 sm:px-2 text-[var(--text-gray-light)] text-md sm:text-base md:text-lg leading-relaxed">
                  {" "}
                  {feature.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full relative min-h-[300px] max-h-[400px] lg:min-h-[400px] lg:max-h-[600px]">
        <Image
          src="/images/about/about2.avif"
          alt="About Velvera Salon"
          fill
          priority
          className="rounded-2xl object-cover"
        />
      </div>
    </div>
  );
};
export default AboutCard2;

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
      description: "Tailored care for your unique needs",
    },
  ];
  return (
    <div className="w-full flex flex-col-reverse lg:flex-row  gap-6 md:gap-8 lg:gap-10 xl:gap-12">
      <div className="w-full flex flex-col justify-center items-start px-4 sm:px-6 lg:px-8 xl:px-12">
        <h1 className="my-4 sm:my-6 md:my-8 lg:my-10 text-3xl lg:text-4xl xl:text-4xl text-left text-[var(--text-primary)] font-light leading-relaxed">
          Why TrimTree is the right choice for you
        </h1>
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="bg-[var(--bg-primary)] h-4 w-4 rounded-full flex-shrink-0 mt-1.5 flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check-icon lucide-check">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
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

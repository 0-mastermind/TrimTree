const  AboutCard1 = () => {
  return (
    <div className="w-full flex lg:flex-row flex-col gap-6 md:gap-8 lg:gap-10 xl:gap-12">
      <div className="w-full">
        <img
          src="/images/about/about1.webp"
          alt=""
          className="rounded-2xl w-full h-full object-cover min-h-[300px] max-h-[400px] lg:min-h-[400px] lg:max-h-[600px]"
        />
      </div>
      <div className="w-full flex flex-col justify-center items-start px-4 sm:px-6 lg:px-8 xl:px-12">
        <h6 className="text-left text-sm sm:text-base md:text-lg text-[var(--text-primary)] font-secondary capitalize">
          - Introduction
        </h6>
        <h1 className="my-4 sm:my-6 md:my-8 lg:my-10 text-3xl lg:text-4xl xl:text-4xl text-left text-[var(--text-primary)] font-light leading-relaxed">
          Welcome to Velvera, your destination for hair care
        </h1>
        <p className="text-left mt-2 sm:mt-3 font-secondary px-1 sm:px-2 text-[var(--text-gray-light)] text-lg  md:text-lg leading-relaxed">
          We combine expert techniques with premium products to give your hair the care it deserves. From styling to treatments, we ensure every visit leaves you feeling confident & careful.
        </p>
        <button className="bg-[var(--bg-primary)] text-sm sm:text-sm md:text-base lg:text-md p-2.5 sm:p-3 md:p-4 text-white rounded-3xl mt-3 sm:mt-4 md:mt-6 hover:opacity-90 transition-opacity">
          Get Expert Care
        </button>
      </div>
    </div>
  );
};
export default AboutCard1;
import AboutCard1 from "./AboutCard1";
import AboutCard2 from "./AboutCard2";

const About = () => {
  return (
    <div id="about" className="w-full p t-10 flex flex-col justify-center items-center my-8 sm:my-12 md:my-16 lg:my-20">
      <div className="w-full max-w-7xl">
        <h6 className="text-center text-lg text-[var(--text-primary)] font-secondary capitalize">
        - About TrimTree
      </h6>
      <h1 className="my-10 text-4xl md:text-5xl max-w-[700px] text-center mx-auto text-[var(--text-primary)]">
        Hair salon where style and care come together
      </h1>
      </div>
      <div className="md:w-full xl:max-w-7xl mt-4 sm:mt-6 md:mt-8 flex flex-col gap-12 sm:gap-16 md:gap-20">
        <AboutCard1 />
        <AboutCard2 />
      </div>
    </div>
  );
};

export default About;
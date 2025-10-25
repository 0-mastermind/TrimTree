import { data } from "./data";

const Reviews = () => {
  return (
    <section className="my-10 py-4">
      <h1 className="my-4 text-4xl md:text-5xl max-w-[700px] text-center mx-auto text-[var(--text-primary)] font-semibold">
        What our clients say about Trim Tree Salon&apos;s services
      </h1>

      {/* Bento Grid */}
      <div className="grid grid-rows-12 grid-cols-3 gap-2">
        {
          data.map((item) => (
            <div className="bg-red-500" key={item.id}>
              ad
            </div>
          ))
        }      
      </div>
    </section>
  );
};

export default Reviews;

import { Link } from "react-router-dom";
import city from "../assets/images/city.jpg";

const NotFoundPage = () => (
  <section className="relative flex min-h-[calc(100vh-7rem)] snap-start items-center overflow-hidden bg-slate-950 px-6 py-20 text-white lg:px-10">
    <img
      src={city}
      alt=""
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-slate-950/80" />
    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />
    <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-primary-200/20 blur-3xl" />
    <div className="absolute right-0 top-1/4 hidden h-96 w-96 rounded-full bg-white/10 blur-3xl md:block" />

    <div className="relative z-10 mx-auto w-full max-w-7xl">
      <div className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-primary-200">
          Page not found
        </p>
        <p className="mt-2 text-[7rem] font-black leading-none tracking-normal text-white/95 sm:text-[10rem] lg:text-[12rem]">
          404
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-6xl">
          This route missed its delivery window.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 md:text-lg">
          The page you are looking for may have moved, or the link may be
          incorrect. Head back home or contact Efficient Global for help with a
          medical courier request.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex justify-center rounded-full bg-primary-200 px-7 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950 transition duration-200 hover:bg-primary-100 hover:text-white"
          >
            Go Home
          </Link>
          <Link
            to="/contact"
            className="inline-flex justify-center rounded-full border border-white/40 bg-white/10 px-7 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition duration-200 hover:border-primary-200 hover:bg-primary-200"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default NotFoundPage;

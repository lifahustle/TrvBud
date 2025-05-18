import Hero from "@/components/Hero";
import SearchSection from "@/components/SearchSection";
import PopularDestinations from "@/components/PopularDestinations";
import SpecialOffers from "@/components/SpecialOffers";
import AccommodationSection from "@/components/AccommodationSection";
import TransportSection from "@/components/TransportSection";
import ItineraryBuilder from "@/components/ItineraryBuilder";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>South Asia Explorer - Your 2025 Travel Adventure</title>
        <meta name="description" content="Plan your perfect South Asian adventure for 2025 with flights, accommodations, and transportation across Thailand, Vietnam, Cambodia, and more." />
        <meta property="og:title" content="South Asia Explorer - Your 2025 Travel Adventure" />
        <meta property="og:description" content="Discover ancient temples, pristine beaches, and vibrant cultures across South Asia's most breathtaking destinations." />
        <meta property="og:type" content="website" />
      </Helmet>
      <Hero />
      <SearchSection />
      <PopularDestinations />
      <SpecialOffers />
      <AccommodationSection />
      <TransportSection />
      <ItineraryBuilder />
      <Testimonials />
      <Newsletter />
    </>
  );
};

export default Home;

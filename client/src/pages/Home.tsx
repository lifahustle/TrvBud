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
        <title>TrvBUD - Southeast Asia Travel Platform | AI-Powered Trip Planning 2025</title>
        <meta name="description" content="Discover Thailand, Vietnam, Philippines & Cambodia with TrvBUD's AI assistant Bruce. Get exclusive deals on flights, hotels & transport with 3-tier membership benefits." />
        <meta property="og:title" content="TrvBUD - Southeast Asia's Premier Travel Platform" />
        <meta property="og:description" content="AI-powered travel planning for Thailand, Vietnam, Philippines & Cambodia. Exclusive member deals, Bruce AI assistant, and comprehensive trip management." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="Southeast Asia travel, Thailand tours, Vietnam trips, Philippines islands, Cambodia temples, AI travel assistant, flight deals, hotel bookings" />
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

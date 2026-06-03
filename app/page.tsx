import Navbar from "@/components/landingPage/Navbar";
import Hero from "@/components/landingPage/Hero";
import Categories from "@/components/landingPage/Categoories";
import HowItWorks from "@/components/landingPage/HowItWorks";
import Statistics from "@/components/landingPage/Statistics";
import CTA from "@/components/landingPage/CTA";
import Footer from "@/components/landingPage/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <HowItWorks />
      <Statistics />
      <CTA />
      <Footer />
    </>
  );
}
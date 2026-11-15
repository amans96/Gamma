import aboutImage from "../assets/about-hero.jpg";
import HeroPage from "../comp/HeroPage.jsx";
import AboutHero from "../comp/AboutHero.jsx";
import CompanyCards from "../comp/CompanyCards.jsx";
import StrategicValues from "../comp/StrategicValues.jsx";
import LeadershipTeam from "../comp/LeadershipTeam.jsx";
import Footertemp from "../comp/Footertemp.jsx";

export default function About() {
  return (
    <div className="w-full bg-background">
      <HeroPage
        pageName="About Gamma Solutions"
        subtitle="Dedicated to advancing electrical infrastructure, reliable power distribution, and certified engineering standards."
        media={aboutImage}
        mediaType="image"
      />
      <AboutHero />
      <CompanyCards />
      <StrategicValues />
      <LeadershipTeam />
      <Footertemp />
    </div>
  );
}

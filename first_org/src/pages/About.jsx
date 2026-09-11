import aboutImage from "../assets/about-hero.jpg";
import HeroPage from "../comp/HeroPage.jsx";
import AboutHero from "../comp/AboutHero.jsx";
import CompanyCards from "../comp/CompanyCards.jsx";
import StrategicValues from "../comp/StrategicValues.jsx";
import LeadershipTeam from "../comp/LeadershipTeam.jsx";
import Footertemp from "../comp/Footertemp.jsx"
function About() {
  return (
    <div>
      <HeroPage
        pageName=""
        media={aboutImage}
        mediaType="image"
      />

      <div className="flex justify-center w-full mt-5">
        <AboutHero />
      </div>
      <CompanyCards/>
      <StrategicValues/>
      <LeadershipTeam/>
      <Footertemp/>
    </div>
  );
}

export default About;
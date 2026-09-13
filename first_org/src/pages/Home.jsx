import Nav from '../comp/Nav.jsx'
import HeroPage from '../comp/HeroPage.jsx'
import Card from '../comp/Card.jsx'
import ProductCarousel from '../comp/ProductCarousel.jsx'
import Testimonial from '../comp/Testimonialtemp.jsx'
import TrustedCompanies from '../comp/TrustedCompanies.jsx'
import Faqs from '../comp/Faq.jsx'
import Footertemp from '../comp/Footertemp.jsx'
import heroVideo from "../assets/GAMA.mp4";
function Home() {

  return (
    <div>
      
      <HeroPage
        pageName=""
        media={heroVideo}
        mediaType="video"
      />

       <ProductCarousel />
      <Card/>
       <TrustedCompanies />
      <Testimonial />
      <Faqs />
      <Footertemp />
    </div>
  )
}



export default Home;

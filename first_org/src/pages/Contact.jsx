import ContactForm from '../comp/ContactForm.jsx';
import ContactHero from "../comp/ContactHero.jsx";
import contact from "../assets/image.jpeg"
import Map from '../comp/Map.jsx';
import ContactInfo from '../comp/ContactInfo.jsx';
import Footertemp from '../comp/Footertemp.jsx'
export default function Contact() {
    return (
        <div>
          
            <ContactHero image={contact} title="Contact Us" />
            <ContactForm />
            <Map/>
            <ContactInfo/>
            <Footertemp/>

            
        </div>
    );
}
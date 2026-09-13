
export default function Map() {
  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-lg">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943.3232093812626!2d38.990568374777226!3d8.755629391295228!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b0dcf208e0d63%3A0x1d88c906ccc9765e!2sBeza%2Fbesebarok%20School!5e0!3m2!1sen!2set!4v1785943538765!5m2!1sen!2set"
        className="w-full h-full border-0"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        title="Company Location"
      />
    </div>
  );
}


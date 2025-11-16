import { useNavigate } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope, FaWhatsapp, FaMapMarkerAlt, FaComments } from "react-icons/fa";

export default function HelpSupport() {
  const navigate = useNavigate();

  const handleLiveChatClick = () => {
    navigate("/livechat");
  };

  const handleBackToHomeClick = () => {
    navigate("/");
  };

  // Admin details
  const phoneNumber = "94750651916";
  const whatsappNumber = "94750651916";
  const email = "mangalashowroom426@gmail.com";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-10 px-4">
      {/* 🔹 Header */}
      <h2 className="text-4xl font-extrabold mb-6 text-gray-800 text-center">
        Help & Support
      </h2>

      {/* 🧾 Contact Info Card */}
      <div className="bg-gradient-to-r from-emerald-500 via-orange-400 to-yellow-400 p-[2px] rounded-2xl shadow-lg mb-10 w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Contact to Mangalashowroom
          </h3>

          <div className="space-y-3 text-gray-700 text-sm text-left">
            {/* 📞 Phone */}
            <p className="flex items-center gap-3">
              <FaPhoneAlt className="text-emerald-600" />
              <strong>Phone:</strong>
              <a
                href={`tel:${phoneNumber}`}
              className="text-orange-600 hover:text-orange-800 transition"              >
                <storng>+94 75 065 1916</storng>
              </a>
            </p>

            {/* 💬 WhatsApp */}
            <p className="flex items-center gap-3">
              <FaWhatsapp className="text-green-500" />
              <strong>Whatsapp:</strong>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800"
              >
                <strong>Chat on WhatsApp</strong>
              </a>
            </p>

            {/* ✉️ Email */}
            <p className="flex items-center gap-3">
              <FaEnvelope className="text-orange-500" />
              <strong>Email Us:</strong>
              <a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=mangalashowroom426@gmail.com&su=Customer%20Support&body=Hi%2C%20I%20need%20help%20with%20my%20order."
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
>
  <strong>{email}</strong>
</a>

            </p>

            {/* 📍 Address */}
            <p className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-600" />
            <strong>Address:</strong><span><strong>536 Jaffna-Kankesanturai Rd, Jaffna 40000</strong></span>
          </p>
          </div>
        </div>
      </div>

      {/* 🗺️ Map */}
      <div className="w-full max-w-4xl mb-10 border-[3px] border-gradient-to-r from-emerald-500 via-orange-400 to-yellow-400 rounded-2xl overflow-hidden shadow-md">
        <iframe
          title="Mangala Showroom Jaffna"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3933.0746433418904!2d80.00898800790313!3d9.674663546002666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afe5407013138eb%3A0x7429690c8f455f08!2sMangala%20Showroom!5e0!3m2!1sen!2slk!4v1751307141819!5m2!1sen!2slk"
          width="100%"
          height="350"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* 💬 Info Text */}
      <p className="text-center text-gray-700 text-lg mb-6 max-w-xl leading-relaxed">
        If you have any questions or need assistance, our team is here to help.
        Reach out anytime or start a live chat for quick support.
      </p>

      {/* 🔘 Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Live Chat Button */}
        <button
          onClick={handleLiveChatClick}
          className="w-48 flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-400 text-white rounded-full font-semibold shadow-md hover:scale-105 hover:shadow-lg transition transform"
        >
          <FaComments />
          Live Chat
        </button>

        {/* Back Button */}
        <button
          onClick={handleBackToHomeClick}
          className="w-48 p-3 bg-gray-900 text-white rounded-full font-semibold shadow-md hover:bg-gray-800 hover:scale-105 transition transform"
        >
          Back to Homepage
        </button>
      </div>
    </div>
  );
}

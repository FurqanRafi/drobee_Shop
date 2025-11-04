import React from "react";
import { Montserrat, Playfair_Display } from "next/font/google";
import { Facebook, Instagram, Twitter } from "lucide-react";

const montserat = Montserrat({ subsets: ["latin"] });
const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const Form = () => {
  return (
    <div className="w-full ">
      <div className="flex flex-col items-center py-20 gap-5">
        <div className="w-full md:w-[70%] lg:w-[45%] flex flex-col items-center justify-center gap-3">
          <h3 className={`${montserat.className} text-xs uppercase `}>
            Get in Touch
          </h3>
          <h1 className={`${playfair.className} text-center italic text-4xl `}>
            We value the connection with our community and are here to assist in
            any way we can. Feel free to reach out through the following
            channels:
          </h1>
        </div>
      </div>
      <div className="MyContainer flex flex-col lg:flex-row items-start gap-5">
        <div className=" w-full flex flex-col gap-5 ">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Your Message"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <div>
            <button className="hover:bg-black hover:text-white px-6 py-2 border border-black rounded-md transition">
              Send
            </button>
          </div>
        </div>
        <div className="w-full flex flex-col gap-10 ">
          <div className="flex items-start justify-between border-b border-gray-200">
            <div className="">
              <h1
                className={`${montserat.className} text-medium uppercase font-medium text-black/40`}
              >
                Phone
              </h1>
              <p className={`${playfair.className} italic tracking-widest`}>
                (303) 555-0105
              </p>
            </div>
            <div className="mb-5">
              <h1
                className={`${montserat.className} text-medium uppercase font-medium text-black/40   `}
              >
                Email
              </h1>
              <p className={` ${playfair.className} italic tracking-widest`}>
                contact@drobee.com
              </p>
            </div>
          </div>
          <div className="w-full flex items-start justify-between border-b border-gray-200">
            <div>
              <h1
                className={`${montserat.className} text-medium uppercase font-medium text-black/40`}
              >
                Address
              </h1>
              <p
                className={`${playfair.className} italic tracking-widest mb-10`}
              >
                2972 Westheimer Rd. Santa Ana, Illinois 85486
              </p>
            </div>
          </div>
          <div className="w-full flex items-start justify-between border-b border-gray-200">
            <div className="flex gap-10">
              <h1
                className={`${montserat.className} text-medium uppercase font-medium text-black/40 mb-10`}
              >
                Follow us:
              </h1>
              <div className="flex gap-4">
                <Facebook />
                <Twitter />
                <Instagram />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[70vh] bg-red-50 mt-15">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5709726.1282193465!2d-4.9306983109204925!3d53.20071823253973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x25a3b1142c791a9%3A0xc4f8a0433288257a!2sUnited%20Kingdom!5e0!3m2!1sen!2s!4v1761817951547!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};

export default Form;

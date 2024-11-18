import React from "react";

const Footer = () => {
  return (
    <div className="bg-gradient-to-r from-[#d7e6ff] to-[#ccfffb] text-black rounded-t-3xl mt-8 md:mt-0">
      <div className="flex flex-col md:flex-row justify-between p-8 md:px-32 px-5">
        <div className="w-full md:w-1/4">
          <h1 className="font-semibold text-xl pb-4">Lockify</h1>
          <p className="text-sm">
            Lockify is your trusted tool for secure and efficient password analysis. We provide real-time feedback and help ensure robust security with intelligent strength assessments.
          </p>
        </div>

        <div>
          <h1 className="font-medium text-xl pb-4 pt-5 md:pt-0">Quick Links</h1>
          <nav className="flex flex-col gap-2">
            <a className="hover:text-primary transition-all cursor-pointer" href="/">
              Home
            </a>
            <a className="hover:text-primary transition-all cursor-pointer" href="/about">
              About Us
            </a>
            <a className="hover:text-primary transition-all cursor-pointer" href="/analyzer">
              Password Analyzer
            </a>
            <a className="hover:text-primary transition-all cursor-pointer" href="/contact">
              Contact
            </a>
          </nav>
        </div>

        <div>
          <h1 className="font-medium text-xl pb-4 pt-5 md:pt-0">Resources</h1>
          <nav className="flex flex-col gap-2">
            <a className="hover:text-primary transition-all cursor-pointer" href="/policies">
              Security Policies
            </a>
            <a className="hover:text-primary transition-all cursor-pointer" href="/faq">
              FAQs
            </a>
            <a className="hover:text-primary transition-all cursor-pointer" href="/blog">
              Blog
            </a>
          </nav>
        </div>

        <div>
          <h1 className="font-medium text-xl pb-4 pt-5 md:pt-0">Get In Touch</h1>
          <nav className="flex flex-col gap-2">
            <a className="hover:text-primary transition-all cursor-pointer" href="mailto:support@Lockify.com">
              support@Lockify.com
            </a>
            <a className="hover:text-primary transition-all cursor-pointer" href="tel:+123456789">
              +1 234 567 890
            </a>
            <a className="hover:text-primary transition-all cursor-pointer" href="/">
              Follow us on Social Media
            </a>
          </nav>
        </div>
      </div>

      <div>
        <p className="text-center py-4">
          © 2024 <span className="text-primary">Lockify</span> | All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;

import React from "react";
import img from "../assets/img/about.png";
import Button from "../layouts/Button";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center lg:px-32 px-5 bg-gradient-to-r from-[#0e397e] to-[#75a6a3]">
      <h1 className="font-semibold text-center text-4xl lg:mt-14 mt-24 mb-8 text-white">
        About Us
      </h1>

      <div className="flex flex-col lg:flex-row items-center gap-5">
        <div className="w-full lg:w-2/4">
          <img className="rounded-lg" src={img} alt="About Us Image" />
        </div>
        <div className="w-full lg:w-2/4 p-4 space-y-3 text-white">
          <h2 className="font-semibold text-3xl">
            Strengthening Your Online Security
          </h2>
          <p>
            At our core, we believe that securing your online accounts should be simple and effective. Our Password Strength Analyzer helps users assess the strength of their passwords in real time, providing instant feedback and suggestions for improvement.
          </p>
          <p>
            By following best practices and offering guidelines for password complexity, we empower users to create more secure passwords, safeguarding them against common threats such as brute-force attacks and password breaches.
          </p>
          <p>
            We also provide admins with tools to manage password policies, monitor trends in password strength, and offer a comprehensive analysis to ensure a higher standard of security for all users.
          </p>

          <Button title="Learn More" />
        </div>
      </div>
    </div>
  );
};

export default About;

// src/pages/About.tsx
import React from "react";
import "./About.css";

const About: React.FC = () => {
  return (
    <div className="about-container">
      <h1>O Nas</h1>
      <p>
        Witaj w naszym sklepie internetowym! Jesteśmy pasjonatami dostarczania
        najwyższej jakości produktów dla naszych klientów. Nasza misja to
        zapewnienie doskonałej obsługi i satysfakcji z zakupów.
      </p>
      <p>
        Dzięki naszemu zespołowi ekspertów oraz szerokiemu asortymentowi, możesz
        być pewien, że znajdziesz wszystko, czego potrzebujesz. Dziękujemy za
        zaufanie!
      </p>
    </div>
  );
};

export default About;

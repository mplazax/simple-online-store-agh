// src/pages/Contact.tsx
import React, { useState } from "react";
import "./Contact.css";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logika wysyłania formularza (np. do API)
    console.log("Form Data:", formData);
    setSubmitted(true);
  };

  return (
    <div className="contact-container">
      <h1>Kontakt</h1>
      {submitted ? (
        <p>Dziękujemy za wiadomość! Skontaktujemy się z Tobą wkrótce.</p>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          <label htmlFor="name">Imię:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="message">Wiadomość:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>

          <button type="submit">Wyślij</button>
        </form>
      )}
    </div>
  );
};

export default Contact;

"use client";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaPhone, FaEnvelope, FaMapMarkedAlt, FaPhoneAlt } from "react-icons/fa";
import { Icon } from "lucide-react";
import { Description } from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import Swal from "sweetalert2"; // Mengimpor SweetAlert2 untuk pop-up

const info = [
  {
    Icon: <FaPhoneAlt />,
    title: "Phone",
    description: "+62 895 3392 00924",
  },
  {
    Icon: <FaEnvelope />,
    title: "Email",
    description: "budysantoso1120@gmail.com",
  },
];

const Contact = () => {
  // Handler untuk mengirim form
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Menampilkan pop-up SweetAlert
    Swal.fire({
      title: "Form Submitted Successfully!",
      text: "Your message has been sent. We will get back to you shortly.",
      icon: "success",
      confirmButtonText: "OK",
    });
    

    // Kirim data form ke server atau layanan email (misalnya EmailJS atau Nodemailer)
    // Di sini Anda bisa menambahkan logika untuk mengirim email
  };

  return (
    <section id="contact" className="container mx-auto pt-16 pb-8">
      <h2 className="text-3xl font-bold text-left mb-4">Contact</h2>
      <p className="text-left text-white/80 mb-8">
        Let's shape the future together. Hire me as your Frontend Mobile Developer and UI/UX Designer to create impactful, user-centered digital experiences today!
      </p>
      <div className="mx-auto">
        <div className="flex flex-col xl:flex-row gap-[30px]">
          {/* Form Section */}
          <div className="xl:w-[54%] order-2 xl:order-none">
            <form className="flex flex-col gap-6 p-10 bg-[#27272c] rounded-xl" onSubmit={handleSubmit}>
              <h3 className="text-4xl text-accent">Let's work together</h3>
              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input type="name" placeholder="Name" />
                <Input type="email" placeholder="Email" />
              </div>
              <Input type="text" placeholder="Subject" className="w-full" /> {/* Full-width input for subject */}
              <Textarea className="h-[200px]" placeholder="Type your message here" />
              {/* Button */}
              <Button size="md" className="max-w-40" type="submit">Send Message</Button>
            </form>
          </div>
          {/* Info Section */}
          <div className="flex-1 flex items-center xl:justify-end order-1 xl:order-none mb-8 xl:mb-0">
            <ul className="flex flex-col gap-10">
              {info.map((item, index) => (
                <li key={index} className="flex items-center gap-6">
                  <div className="w-[52px] h-[52px] xl:w-[72px] xl:h-[72px] bg-[#27272c] text-accent rounded-md flex items-center justify-center">
                    <div className="text-[28px]">{item.Icon}</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-white/60">{item.title}</p>
                    <h3 className="text-xl">{item.description}</h3>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

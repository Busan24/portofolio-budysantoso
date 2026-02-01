"use client";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaPhone, FaEnvelope, FaMapMarkedAlt, FaPhoneAlt } from "react-icons/fa";
import { Icon } from "lucide-react";
import { Description } from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [contactInfo, setContactInfo] = useState([
    { Icon: <FaPhoneAlt />, title: "Phone", description: "+62 895 3392 00924" },
    { Icon: <FaEnvelope />, title: "Email", description: "budysantoso1120@gmail.com" }
  ]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  // Form errors
  const [errors, setErrors] = useState({});

  // Initialize EmailJS
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      emailjs.init(publicKey);
      console.log('EmailJS initialized');
    }
  }, []);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const contactDoc = await getDoc(doc(db, "settings", "contact"));
        
        if (contactDoc.exists()) {
          const data = contactDoc.data();
          const contacts = [];
          
          // Add phone if exists
          if (data.phone) {
            contacts.push({
              Icon: <FaPhoneAlt />,
              title: "Phone",
              description: data.phone
            });
          }
          
          // Add email if exists
          if (data.email) {
            contacts.push({
              Icon: <FaEnvelope />,
              title: "Email",
              description: data.email
            });
          }
          
          // Add address if exists
          if (data.address) {
            contacts.push({
              Icon: <FaMapMarkedAlt />,
              title: "Address",
              description: data.address
            });
          }
          
          if (contacts.length > 0) {
            setContactInfo(contacts);
          }
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      Swal.fire({
        title: "Validation Error",
        text: "Please fill in all required fields correctly.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#00ff99"
      });
      return;
    }

    // Check if EmailJS is configured
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    console.log('EmailJS Config:', { 
      serviceId, 
      templateId, 
      publicKey: publicKey ? 'exists' : 'missing' 
    });

    if (!serviceId || !templateId || !publicKey) {
      console.error("EmailJS not configured. Please add environment variables.");
      Swal.fire({
        title: "Configuration Error",
        text: "Email service is not configured. Please contact the administrator.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#00ff99"
      });
      return;
    }

    setSending(true);

    try {
      // Prepare template parameters
      const templateParams = {
        name: formData.name,
        email: formData.email,
        title: formData.subject,
        message: formData.message,
        time: new Date().toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      console.log('Sending email with params:', templateParams);

      // Send email using EmailJS with explicit error handling
      const result = await emailjs.send(
        serviceId,
        templateId,
        templateParams
      ).catch(error => {
        console.error('EmailJS Error Details:', {
          status: error.status,
          text: error.text,
          message: error.message
        });
        throw error;
      });

      console.log("Email sent successfully:", result);

      // Success alert
      Swal.fire({
        title: "Message Sent!",
        text: "Thank you for reaching out. I will get back to you shortly.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#03b5fc"
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });

    } catch (error) {
      console.error("Failed to send email:", error);
      Swal.fire({
        title: "Failed to Send",
        text: "Something went wrong. Please try again later or contact me directly via email.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#00ff99"
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="container mx-auto pt-16 pb-8" suppressHydrationWarning>
      <h2 className="text-3xl font-bold text-left mb-4 text-white light:text-gray-900">Contact</h2>
      <p className="text-left text-white/80 light:text-gray-600 mb-8">
        Let's shape the future together. Hire me as your Frontend Mobile Developer and UI/UX Designer to create impactful, user-centered digital experiences today!
      </p>
      <div className="mx-auto" suppressHydrationWarning>
        <div className="flex flex-col xl:flex-row gap-[30px]" suppressHydrationWarning>
          {/* Form Section */}
          <div className="xl:w-[54%] order-2 xl:order-none" suppressHydrationWarning>
            <form className="flex flex-col gap-6 p-10 bg-white dark:bg-[#27272c] rounded-xl border border-gray-200 dark:border-transparent shadow-lg" onSubmit={handleSubmit} suppressHydrationWarning>
              <h3 className="text-4xl text-accent">Let's work together</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" suppressHydrationWarning>
                <div>
                  <Input 
                    type="text" 
                    name="name"
                    placeholder="Name" 
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "border-red-500" : ""}
                    suppressHydrationWarning 
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <Input 
                    type="email" 
                    name="email"
                    placeholder="Email" 
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "border-red-500" : ""}
                    suppressHydrationWarning 
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
              <div>
                <Input 
                  type="text" 
                  name="subject"
                  placeholder="Subject" 
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full ${errors.subject ? "border-red-500" : ""}`}
                  suppressHydrationWarning 
                />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
              </div>
              <div>
                <Textarea 
                  name="message"
                  className={`h-[200px] ${errors.message ? "border-red-500" : ""}`}
                  placeholder="Type your message here" 
                  value={formData.message}
                  onChange={handleChange}
                  suppressHydrationWarning 
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>
              <Button 
                size="md" 
                className="max-w-40" 
                type="submit" 
                disabled={sending}
                suppressHydrationWarning
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </div>
          {/* Info Section */}
          <div className="flex-1 flex items-center xl:justify-end order-1 xl:order-none mb-8 xl:mb-0" suppressHydrationWarning>
            {loading ? (
              <div className="flex flex-col gap-10 w-full">
                <div className="h-16 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                <div className="h-16 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
              </div>
            ) : (
              <ul className="flex flex-col gap-10">
                {contactInfo.map((item, index) => (
                  <li key={index} className="flex items-center gap-6">
                    <div className="w-[52px] h-[52px] xl:w-[72px] xl:h-[72px] bg-gray-100 dark:bg-[#27272c] text-accent rounded-md flex items-center justify-center">
                      <div className="text-[28px]">{item.Icon}</div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-500 dark:text-white/60">{item.title}</p>
                      <h3 className="text-xl text-gray-900 dark:text-white">{item.description}</h3>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

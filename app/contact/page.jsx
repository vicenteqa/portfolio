'use client';

import { useState } from 'react';
import emailjs from 'emailjs-com';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    topic: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      topic: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID,
        formData,
        process.env.NEXT_PUBLIC_EMAIL_SERVICE_UID
      )
      .then(
        (result) => {
          console.log(result.text);
          alert('Mensaje enviado con éxito');
        },
        (error) => {
          console.log(error.text);
          alert('Hubo un error al enviar el mensaje');
        }
      );
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 2.4, duration: 0.4, ease: 'easeIn' },
      }}
      className="py-6"
    >
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-[30px]">
          <form
            className="flex flex-col gap-6 p-10 bg-[#27272c] rounded-xl"
            onSubmit={handleSubmit}
          >
            <h3 className="text-4xl text-accent">Let's work together</h3>
            <p className="text-white/60">
              Let’s connect! I’m passionate about test automation and always
              eager to discuss innovative solutions and new opportunities.
            </p>
            {/* Input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="text"
                name="firstname"
                placeholder="Firstname"
                value={formData.firstname}
                onChange={handleChange}
              />
              <Input
                type="text"
                name="lastname"
                placeholder="Lastname"
                value={formData.lastname}
                onChange={handleChange}
              />
              <Input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                type="text"
                name="phone"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            {/* Select */}
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select a topic</SelectLabel>
                  <SelectItem value="qa">Test Automation</SelectItem>
                  <SelectItem value="em">Engineering Management</SelectItem>
                  <SelectItem value="oth">Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* Textarea */}
            <Textarea
              className="h-[200px]"
              name="message"
              placeholder="Type your message here."
              value={formData.message}
              onChange={handleChange}
            />
            {/* Button */}
            <Button className="max-w-40" type="submit">
              Send message
            </Button>
          </form>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;

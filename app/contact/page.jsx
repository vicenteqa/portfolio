'use client';

import { useState } from 'react';
import emailjs from 'emailjs-com';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Toast } from '@/components/ui/toast';

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
import { FaPaperPlane, FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';

// Move InputWrapper outside the component to prevent recreation on every render
const InputWrapper = ({ children, error, icon: Icon }) => (
  <div className="relative group">
    {Icon && (
      <div className="absolute left-4 top-4 text-white/40 group-focus-within:text-accent transition-colors duration-300 z-10 pointer-events-none">
        <Icon className="text-sm" />
      </div>
    )}
    {children}
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-error text-xs mt-1.5 font-body flex items-center gap-1"
      >
        <span className="inline-block w-1 h-1 rounded-full bg-error"></span>
        {error}
      </motion.p>
    )}
  </div>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    topic: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const validateField = (name, value) => {
    switch (name) {
      case 'firstname':
      case 'lastname':
        return value.trim().length < 2
          ? 'Must be at least 2 characters'
          : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Invalid email address' : '';
      case 'phone':
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return value && !phoneRegex.test(value) ? 'Invalid phone number' : '';
      case 'topic':
        return !value ? 'Please select a topic' : '';
      case 'message':
        return value.trim().length < 10
          ? 'Message must be at least 10 characters'
          : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (touched[name]) {
      setErrors({
        ...errors,
        [name]: validateField(name, value),
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
    setErrors({
      ...errors,
      [name]: validateField(name, value),
    });
  };

  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      topic: value,
    });
    if (touched.topic) {
      setErrors({
        ...errors,
        topic: validateField('topic', value),
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== 'phone') {
        // phone is optional
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    // Validate all fields
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setToast({
        show: true,
        message: 'Please fix the errors before submitting',
        type: 'error',
      });
      setTimeout(() => setToast({ ...toast, show: false }), 4000);
      return;
    }

    setIsSubmitting(true);

    // Check if EmailJS credentials are configured
    const serviceId = process.env.EMAIL_SERVICE_ID;
    const templateId = process.env.EMAIL_TEMPLATE_ID;
    const userId = process.env.EMAIL_SERVICE_UID;

    if (!serviceId || !templateId || !userId) {
      console.error('EmailJS credentials not configured. Please set up .env.local file.');
      setToast({
        show: true,
        message: 'Email service not configured. Please contact the site administrator.',
        type: 'error',
      });
      setIsSubmitting(false);
      setTimeout(() => setToast({ ...toast, show: false }), 4000);
      return;
    }

    emailjs
      .send(
        serviceId,
        templateId,
        formData,
        userId
      )
      .then(
        (result) => {
          console.log('Email sent successfully:', result.text);
          setToast({
            show: true,
            message: 'Message sent successfully! I\'ll get back to you soon.',
            type: 'success',
          });
          setFormData({
            firstname: '',
            lastname: '',
            email: '',
            phone: '',
            topic: '',
            message: '',
          });
          setTouched({});
          setErrors({});
          setTimeout(() => setToast({ ...toast, show: false }), 4000);
        },
        (error) => {
          console.error('EmailJS error:', error);
          setToast({
            show: true,
            message: 'Failed to send message. Please try again later.',
            type: 'error',
          });
          setTimeout(() => setToast({ ...toast, show: false }), 4000);
        }
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 2.4, duration: 0.4, ease: 'easeIn' },
      }}
      className="py-6 relative"
    >
      {/* Toast notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />

      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-40 right-10 w-96 h-96 bg-accent rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center xl:text-left"
          >
            <h1 className="text-4xl xl:text-6xl font-display font-bold mb-4">
              <span className="text-white">Let&apos;s Build</span>{' '}
              <span className="text-accent">Together</span>
            </h1>
            <p className="text-white/60 font-body text-lg max-w-2xl">
              Have a project in mind? Let&apos;s connect and discuss how quality engineering can transform your software delivery.
            </p>
          </motion.div>

          {/* Form */}
          <form
            className="flex flex-col gap-8 p-8 xl:p-12 bg-gradient-to-br from-[#1a1a1f] to-[#232329] rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden"
            onSubmit={handleSubmit}
          >
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-amber to-accent"></div>

            <div className="space-y-6">
              {/* Name fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWrapper error={touched.firstname && errors.firstname} icon={FaUser}>
                  <Input
                    type="text"
                    name="firstname"
                    placeholder="First name *"
                    value={formData.firstname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${touched.firstname && errors.firstname ? 'border-error focus:border-error' : ''} pl-11`}
                  />
                </InputWrapper>

                <InputWrapper error={touched.lastname && errors.lastname}>
                  <Input
                    type="text"
                    name="lastname"
                    placeholder="Last name *"
                    value={formData.lastname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={touched.lastname && errors.lastname ? 'border-error focus:border-error' : ''}
                  />
                </InputWrapper>
              </div>

              {/* Contact fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWrapper error={touched.email && errors.email} icon={FaEnvelope}>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email address *"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${touched.email && errors.email ? 'border-error focus:border-error' : ''} pl-11`}
                  />
                </InputWrapper>

                <InputWrapper error={touched.phone && errors.phone} icon={FaPhone}>
                  <Input
                    type="text"
                    name="phone"
                    placeholder="Phone number (optional)"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${touched.phone && errors.phone ? 'border-error focus:border-error' : ''} pl-11`}
                  />
                </InputWrapper>
              </div>

              {/* Topic select */}
              <InputWrapper error={touched.topic && errors.topic}>
                <Select
                  onValueChange={handleSelectChange}
                  value={formData.topic}
                >
                  <SelectTrigger
                    className={`w-full ${touched.topic && errors.topic ? 'border-error' : ''}`}
                    onBlur={() => {
                      setTouched({ ...touched, topic: true });
                      setErrors({ ...errors, topic: validateField('topic', formData.topic) });
                    }}
                  >
                    <SelectValue placeholder="Select a topic *" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select a topic</SelectLabel>
                      <SelectItem value="qa">Test Automation & QA</SelectItem>
                      <SelectItem value="consulting">Quality Engineering Consulting</SelectItem>
                      <SelectItem value="cicd">CI/CD Integration</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </InputWrapper>

              {/* Message textarea */}
              <InputWrapper error={touched.message && errors.message}>
                <Textarea
                  className={`h-[180px] resize-none ${touched.message && errors.message ? 'border-error focus:border-error' : ''}`}
                  name="message"
                  placeholder="Tell me about your project... *"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </InputWrapper>

              <p className="text-white/40 text-xs font-body">* Required fields</p>
            </div>

            {/* Submit button */}
            <Button
              className={`w-full md:w-auto px-10 py-6 text-lg font-display font-bold bg-gradient-to-r from-accent to-accent/80 hover:from-accent hover:to-amber transition-all duration-500 rounded-full group relative overflow-hidden ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl hover:shadow-accent/50 hover:scale-105'
              }`}
              type="submit"
              disabled={isSubmitting}
            >
              <span className="relative z-10 flex items-center gap-3">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <FaPaperPlane className="text-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </>
                )}
              </span>
            </Button>
          </form>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;

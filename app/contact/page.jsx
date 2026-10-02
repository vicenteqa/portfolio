'use client';

import { useState } from 'react';
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
import {
  FaPaperPlane,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaGithub,
  FaLinkedinIn,
} from 'react-icons/fa';
import PageHeader from '@/components/PageHeader';
import { socials } from '@/lib/routes';

// Defined outside the page so it is not recreated on every render
const Field = ({ id, label, required, hint, error, icon: Icon, children }) => (
  <div className="relative group">
    <label
      htmlFor={id}
      className="mb-2 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-white/50 group-focus-within:text-accent transition-colors"
    >
      <span>
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      {hint && <span className="normal-case tracking-normal text-white/30">{hint}</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent transition-colors z-10 pointer-events-none">
          <Icon className="text-sm" />
        </div>
      )}
      {children}
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        role="alert"
        className="text-error text-xs mt-1.5 font-mono flex items-center gap-1.5"
      >
        <span className="inline-block w-1.5 h-1.5 rounded-sm bg-error"></span>
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
    'bot-field': '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
  });

  const validateField = (name, value) => {
    switch (name) {
      case 'firstname':
      case 'lastname':
        return value.trim().length < 2 ? 'Must be at least 2 characters' : '';
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
      if (key !== 'phone' && key !== 'bot-field') {
        // phone is optional
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
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

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setToast({
          show: true,
          message: "Message sent successfully! I'll get back to you soon.",
          type: 'success',
        });
        window.umami?.track('contact-sent');
        setFormData({
          firstname: '',
          lastname: '',
          email: '',
          phone: '',
          topic: '',
          message: '',
          'bot-field': '',
        });
        setTouched({});
        setErrors({});
      } else {
        const errorData = await response.json();
        const err = new Error(errorData.message || 'Failed to send message');
        // validation / rate-limit answers are safe and useful to show as they are
        err.userFacing = response.status < 500;
        throw err;
      }
    } catch (error) {
      console.error('Submission error:', error);
      setToast({
        show: true,
        message: error.userFacing
          ? error.message
          : 'Failed to send message. Please try again later.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 4000);
    }
  };

  const invalid = (name) => touched[name] && errors[name];
  const bad = 'border-error focus:border-error focus:ring-error/30';

  return (
    <section className="container mx-auto pb-12 relative">
      {/* Toast notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <PageHeader
        label="contact"
        intro="Let’s connect! I’m passionate about test automation and always eager to discuss innovative solutions and new opportunities."
      >
        Open a <span className="text-accent">ticket</span>
      </PageHeader>

      <div className="grid xl:grid-cols-[320px_minmax(0,1fr)] gap-8 xl:gap-12 items-start">
        {/* ticket sidebar */}
        <aside className="order-2 xl:order-none rounded-md border border-white/10 bg-primary/60 p-6 font-mono text-sm space-y-5 xl:sticky xl:top-8">
          <div className="flex items-center justify-between">
            <span className="text-white/40">status</span>
            <span className="inline-flex items-center gap-2 text-success">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" /> open
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/40">assignee</span>
            <span>Vicente Ruiz</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/40">labels</span>
            <span className="text-amber">qa · automation</span>
          </div>
          <div className="border-t border-white/10 pt-5">
            <p className="text-white/40 mb-3">or find me at</p>
            <div className="flex flex-col gap-2">
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/80 hover:text-accent transition-colors"
              >
                <FaLinkedinIn /> LinkedIn
              </a>
              <a
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/80 hover:text-accent transition-colors"
              >
                <FaGithub /> GitHub
              </a>
            </div>
          </div>
        </aside>

        {/* form */}
        <form
          noValidate
          className="relative overflow-hidden rounded-md border border-white/10 bg-primary/70 p-6 xl:p-10 flex flex-col gap-6 shadow-[8px_8px_0_0_rgba(0,0,0,0.45)]"
          onSubmit={handleSubmit}
        >
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-accent via-amber to-accent" />

          {/* honeypot: hidden from people, bots tend to fill it in */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="bot-field">Leave this field empty</label>
            <input
              id="bot-field"
              type="text"
              name="bot-field"
              tabIndex={-1}
              autoComplete="off"
              value={formData['bot-field']}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field id="firstname" label="First name" required error={invalid('firstname')} icon={FaUser}>
              <Input
                id="firstname"
                type="text"
                name="firstname"
                autoComplete="given-name"
                placeholder="Ada"
                value={formData.firstname}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`pl-11 ${invalid('firstname') ? bad : ''}`}
              />
            </Field>
            <Field id="lastname" label="Last name" required error={invalid('lastname')}>
              <Input
                id="lastname"
                type="text"
                name="lastname"
                autoComplete="family-name"
                placeholder="Lovelace"
                value={formData.lastname}
                onChange={handleChange}
                onBlur={handleBlur}
                className={invalid('lastname') ? bad : ''}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field id="email" label="Email" required error={invalid('email')} icon={FaEnvelope}>
              <Input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`pl-11 ${invalid('email') ? bad : ''}`}
              />
            </Field>
            <Field id="phone" label="Phone" hint="optional" error={invalid('phone')} icon={FaPhone}>
              <Input
                id="phone"
                type="text"
                name="phone"
                autoComplete="tel"
                placeholder="+34 …"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`pl-11 ${invalid('phone') ? bad : ''}`}
              />
            </Field>
          </div>

          <Field id="topic" label="Component" required error={invalid('topic')}>
            <Select onValueChange={handleSelectChange} value={formData.topic}>
              <SelectTrigger
                id="topic"
                className={invalid('topic') ? bad : ''}
                onBlur={() => {
                  setTouched({ ...touched, topic: true });
                  setErrors({
                    ...errors,
                    topic: validateField('topic', formData.topic),
                  });
                }}
              >
                <SelectValue placeholder="What is this about?" />
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
          </Field>

          <Field id="message" label="Description" required error={invalid('message')} hint="the more detail the better">
            <Textarea
              id="message"
              className={`h-[180px] resize-none ${invalid('message') ? bad : ''}`}
              name="message"
              placeholder="Tell me about your project…"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Field>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-white/35 text-xs font-mono">* required</p>
            <Button
              size="lg"
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  Submit ticket
                  <FaPaperPlane />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;

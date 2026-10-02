import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { socials } from '@/lib/routes';

const items = [
  { icon: <FaGithub />, path: socials.github, label: 'GitHub' },
  { icon: <FaLinkedinIn />, path: socials.linkedin, label: 'LinkedIn' },
];

const Social = ({ ContainerStyles, iconStyles }) => {
  return (
    <div className={ContainerStyles}>
      {items.map((item) => (
        <a
          key={item.label}
          href={item.path}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          className={iconStyles}
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
};

export default Social;

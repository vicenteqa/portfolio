import Link from 'next/link';

import { FaGithub, FaLinkedinIn } from 'react-icons/fa';

const socials = [
  { icon: <FaGithub />, path: 'https://github.com/vicenteqa' },
  { icon: <FaLinkedinIn />, path: 'https://www.linkedin.com/in/vrcuadrado/' },
];

const Social = ({ ContainerStyles, iconStyles }) => {
  return (
    <div className={ContainerStyles}>
      {socials.map((item, index) => {
        return (
          <Link key={index} href={item.path} className={iconStyles}>
            {item.icon}
          </Link>
        );
      })}
    </div>
  );
};

export default Social;

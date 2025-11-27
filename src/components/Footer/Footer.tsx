import { FaXTwitter, FaEnvelope } from 'react-icons/fa6';

const footerSections = [
  {
    title: 'Company',
    links: [
      { label: 'Affiliate Program', href: '#' },
      { label: 'Sponsor Us', href: '#' },
      { label: 'Promote Tool', href: '#' },
      { label: 'Manage Ads', href: '#' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Privacy', href: '#' },
      { label: 'Contact Us', href: '#' },
    ],
  },
];

const socialIcons = [
  { icon: <FaXTwitter />, label: 'X (Twitter)' },
  { icon: <FaEnvelope />, label: 'Email' },
];

const Footer = () => {
  return (
    <footer className="mt-auto w-full bg-primary-bg p-4 2xl:px-15 text-sm text-secondary-color dark:bg-black-color dark:text-gray-300 
      grid grid-cols-2 md:grid-cols-3 gap-4 place-items-center"
    >
      <div className="h-full">
        <p className="text-base font-semibold text-primary-color">Company Name</p>
        <div className="flex gap-3 py-3">
          {
            socialIcons.map((item) => (
              <a
                type="button"
                key={item.label}
                aria-label={item.label}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white transition hover:opacity-80 dark:bg-white dark:text-black"
              >
                <span className="text-lg">{item.icon}</span>
              </a>
            ))
          }
        </div>
      </div>

      {
        footerSections.map((section) => (
          <div key={section.title}>
            <p className="mb-3 text-base font-semibold text-black-color dark:text-white">{section.title}</p>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.label}>
                  <a className="transition hover:text-main-color" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))
      }
    </footer>
  );
};

export default Footer;


const companyLinks = [
  { label: 'Affiliate Program', href: '#' },
  { label: 'Sponsor Us', href: '#' },
  { label: 'Promote Tool', href: '#' },
  { label: 'Manage Ads', href: '#' },
];

const aboutLinks = [
  { label: 'About Us', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Privacy', href: '#' },
  { label: 'Contact Us', href: '#' },
];

const socialIcons = [
  { icon: 'close', label: 'X (Twitter)' },
  { icon: 'mail', label: 'Email' },
];

const Footer = () => {
  return (
    <footer className="w-full border-t border-group-bg bg-primary-bg px-6 py-10 text-sm text-secondary-color dark:bg-secondary-bg dark:text-gray-300">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="space-y-4">
          <p className="text-base font-semibold text-black-color dark:text-white">Company Name</p>
          <div className="flex gap-3">
            {socialIcons.map((item) => (
              <button
                key={item.icon}
                type="button"
                aria-label={item.label}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-group-bg bg-white shadow-sm transition hover:opacity-80 dark:bg-black/30"
              >
                <span className="material-symbols-outlined text-lg text-black-color dark:text-white">{item.icon}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-8 text-sm font-medium text-secondary-color dark:text-gray-300 md:flex-row md:justify-end">
          <div>
            <p className="mb-3 text-base font-semibold text-black-color dark:text-white">Company</p>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a className="transition hover:text-main-color" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-base font-semibold text-black-color dark:text-white">About</p>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <a className="transition hover:text-main-color" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


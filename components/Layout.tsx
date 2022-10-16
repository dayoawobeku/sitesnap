import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {coffee, search} from '../assets/images/images';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({children}: LayoutProps) {
  const {pathname} = useRouter();

  const companyTab = pathname === '/companies' ? 'text-blue' : 'text-body';
  const industryTab = pathname === '/industry' ? 'text-blue' : 'text-body';
  const webpagesTab = pathname === '/webpages' ? 'text-blue' : 'text-body';

  return (
    <div className="max-w-[1345px] mx-auto px-4 focus-within:outline-none focus-visible:outline-none">
      <nav className="py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <a className="text-blue text-md font-medium">omoui.design</a>
            </Link>
            <ul className="flex items-center gap-4 font-medium">
              <li className={companyTab}>
                <Link href="/companies">Companies (2k)</Link>
              </li>
              <li className={industryTab}>
                <Link href="/industry">Industry (1.2k)</Link>
              </li>
              <li className={webpagesTab}>
                <Link href="/webpages">Webpages (5k)</Link>
              </li>
            </ul>
          </div>
          <button className="flex items-center justify-between text-body font-medium bg-white-200 rounded-lg p-4 w-full max-w-[648px]">
            <div className="flex items-center gap-2">
              <Image alt="" src={search} width={20} height={20} />
              <span>Search companies, industries, webpages</span>
            </div>
            <span className="text-sm">Press Enter</span>
          </button>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="px-5 py-6">
        <button className="flex items-center gap-2 p-4 rounded-lg bg-blue mx-auto">
          <Image alt="" src={coffee} width={20} height={20} />
          <span className="text-white font-medium">buy me coffee</span>
        </button>
        <p className="mt-8 text-body">
          All product and company names are trademarks™ or registered®
          trademarks (including logos, screenshots and icons) remain the
          property of their respective owners.
        </p>
      </footer>
    </div>
  );
}

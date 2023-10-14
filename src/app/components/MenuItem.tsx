import Link from 'next/link';
import { MdModeStandby } from 'react-icons/md';

interface MenuItemProps {
    href: string;
    key: string;
    name: string;
    icon: React.ReactNode;
}

const MenuItem:React.FC<MenuItemProps> = ({ href, key, name, icon }) => {
  return (
    <>
      <Link href={href} key={key} className='flex items-center flex-row-reverse group '>
        {icon}
        <p className={`opacity-0 group-hover:opacity-100 transition duration-700 text-2xl mr-3 font-bold uppercase`}>
          {name}
        </p>
      </Link>
    </>
  );
};

export default MenuItem;

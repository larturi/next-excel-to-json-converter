import Link from 'next/link';
import { MdModeStandby } from 'react-icons/md';

interface MenuItemProps {
    href: string;
    key: string;
    name: string;
}

const MenuItem:React.FC<MenuItemProps> = ({ href, key, name }) => {
  return (
    <>
      <Link href={href} key={key} className='flex items-center flex-row-reverse group '>
        <MdModeStandby className='sm:text-4 xl text-2xl text-primary group-hover:text-accent transition-all ease-in-out duration-700 sm:ml-5 flex-shrink-0' />
        <p className={`opacity-0 group-hover:opacity-100 transition duration-700 text-2xl mr-3 font-bold uppercase`}>
          {name}
        </p>
      </Link>
    </>
  );
};

export default MenuItem;

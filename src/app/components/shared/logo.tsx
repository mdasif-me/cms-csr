import Image from 'next/image';
import logo from 'public/logo.svg';
export default function Logo(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Image
      draggable={false}
      priority={true}
      src={logo}
      width={128}
      height={128}
      alt='Logo'
      className='h-16 w-16 object-contain logo mx-auto'
      {...props}
    />
  );
}

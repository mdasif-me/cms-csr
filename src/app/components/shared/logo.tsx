import Image from 'next/image';
import logo from 'public/logo.webp';
export default function Logo() {
  return (
    <Image
      draggable={false}
      priority={true}
      src={logo}
      width={128}
      height={128}
      alt='Logo'
      className='h-32 w-32 object-contain'
    />
  );
}

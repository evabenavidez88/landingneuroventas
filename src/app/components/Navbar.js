import Image from 'next/image';

export default function Navbar() {
  return (
    <nav>
      <Image
        src="/images/logo.png"
        alt="Eva Benavidez"
        width={180}
        height={56}
        style={{ height: '56px', width: 'auto' }}
        priority
      />
    </nav>
  );
}

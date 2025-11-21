import Link from 'next/link';
import Image from 'next/image';

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      {/* Logo para tema claro */}
      <Image 
        src="/logo-white.svg" 
        alt="AICredy" 
        width={140} 
        height={40}
        className="dark:hidden"
        priority
      />
      {/* Logo para tema escuro */}
      <Image 
        src="/logo-dark.svg" 
        alt="AICredy" 
        width={140} 
        height={40}
        className="hidden dark:block"
        priority
      />
    </Link>
  );
}

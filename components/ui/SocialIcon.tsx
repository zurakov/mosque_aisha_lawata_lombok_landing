import { Facebook, Globe, Instagram, MessageCircle, Send, Youtube } from 'lucide-react';

const ICONS: Record<string, typeof Globe> = {
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  whatsapp: MessageCircle,
  telegram: Send,
  website: Globe,
};

/** Maps a social platform name to a lucide icon (Globe as a neutral fallback). */
export function SocialIcon({ platform, className }: { platform: string; className?: string }) {
  const Icon = ICONS[platform.toLowerCase()] ?? Globe;
  return <Icon className={className} />;
}

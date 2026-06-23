import { listImages, createImage, updateImage, deleteImage } from '@/lib/admin-images';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = () => listImages('hero_images');
export const POST = (req: Request) => createImage('hero_images', req);
export const PUT = (req: Request) => updateImage('hero_images', req);
export const DELETE = (req: Request) => deleteImage('hero_images', req);

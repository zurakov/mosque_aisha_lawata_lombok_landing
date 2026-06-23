import { listImages, createImage, updateImage, deleteImage } from '@/lib/admin-images';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = () => listImages('gallery_images');
export const POST = (req: Request) => createImage('gallery_images', req);
export const PUT = (req: Request) => updateImage('gallery_images', req);
export const DELETE = (req: Request) => deleteImage('gallery_images', req);

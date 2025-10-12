// Image upload utilities using Supabase Storage
import { supabase } from "@/integrations/supabase/client";

export type BucketName = 'invitations' | 'gallery' | 'profiles';

/**
 * Upload an image to Supabase Storage
 * @param file - The file to upload
 * @param bucket - The storage bucket name
 * @param folder - Optional folder path within the bucket
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(
  file: File,
  bucket: BucketName,
  folder?: string
): Promise<string> {
  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/mp3', 'audio/wav'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, WebP, MP3, and WAV are allowed.');
  }

  // Validate file size (10MB for audio, 5MB for invitations/gallery, 2MB for profiles)
  const isAudio = file.type.startsWith('audio/');
  const maxSize = isAudio ? 10 * 1024 * 1024 : bucket === 'profiles' ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    throw new Error(`File size must be less than ${maxSizeMB}MB`);
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  // Upload file
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading image:', error);
    throw error;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Delete an image from Supabase Storage
 * @param url - The public URL of the image
 * @param bucket - The storage bucket name
 */
export async function deleteImage(url: string, bucket: BucketName): Promise<void> {
  // Extract path from URL
  const urlParts = url.split(`/storage/v1/object/public/${bucket}/`);
  if (urlParts.length < 2) {
    throw new Error('Invalid image URL');
  }

  const filePath = urlParts[1];

  // Delete file
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

/**
 * Upload image from URL or base64
 * @param imageData - URL or base64 data
 * @param bucket - The storage bucket name
 * @param folder - Optional folder path
 * @returns The public URL of the uploaded image
 */
export async function uploadImageFromData(
  imageData: string,
  bucket: BucketName,
  folder?: string
): Promise<string> {
  // If it's already a URL from our storage, return it
  if (imageData.includes('supabase')) {
    return imageData;
  }

  // If it's a base64 string, convert to blob
  if (imageData.startsWith('data:image')) {
    const response = await fetch(imageData);
    const blob = await response.blob();
    const file = new File([blob], 'image.png', { type: blob.type });
    return uploadImage(file, bucket, folder);
  }

  // If it's an external URL, return as is
  return imageData;
}

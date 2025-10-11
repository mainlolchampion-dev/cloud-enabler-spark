import { Button } from "@/components/ui/button";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { uploadImage, deleteImage } from "@/lib/imageUpload";
import { toast } from "sonner";

interface ImagePickerProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  bucket?: 'invitations' | 'gallery' | 'profiles';
  folder?: string;
}

export function ImagePicker({ 
  label, 
  value, 
  onChange, 
  onRemove,
  bucket = 'invitations',
  folder 
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadImage(file, bucket, folder);
      onChange(url);
      toast.success("Η φωτογραφία ανέβηκε επιτυχώς!");
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.message || "Σφάλμα κατά το ανέβασμα της φωτογραφίας");
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleRemove = async () => {
    if (!value || !onRemove) return;

    try {
      // Only delete if it's a Supabase Storage URL
      if (value.includes('supabase')) {
        await deleteImage(value, bucket);
      }
      onRemove();
      toast.success("Η φωτογραφία διαγράφηκε");
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast.error("Σφάλμα κατά τη διαγραφή της φωτογραφίας");
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt={label}
            className="w-full max-w-xs h-48 object-cover rounded-lg border"
          />
          {onRemove && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
              disabled={uploading}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={() => inputRef.current?.click()}
          className="w-full max-w-xs"
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Ανέβασμα...
            </>
          ) : (
            <>
              <ImagePlus className="w-4 h-4 mr-2" />
              Προσθέστε Εικόνα
            </>
          )}
        </Button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
    </div>
  );
}

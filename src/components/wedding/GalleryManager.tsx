import { Button } from "@/components/ui/button";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { uploadImage, deleteImage } from "@/lib/imageUpload";
import { toast } from "sonner";

interface GalleryImage {
  id: string;
  url: string;
}

interface GalleryManagerProps {
  images: GalleryImage[];
  onImagesChange: (images: GalleryImage[]) => void;
}

interface DraggableImageProps {
  image: GalleryImage;
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
  onRemove: (id: string, url: string) => void;
}

const DraggableImage = ({ image, index, moveImage, onRemove }: DraggableImageProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "image",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "image",
    hover: (item: { index: number }) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveImage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`relative group ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      <img
        src={image.url}
        alt=""
        className="w-full h-32 object-cover rounded-lg border cursor-move"
      />
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onRemove(image.id, image.url)}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

export function GalleryManager({ images, onImagesChange }: GalleryManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploading(true);
      
      // Upload all files in parallel
      const uploadPromises = files.map(async (file) => {
        const url = await uploadImage(file, 'gallery');
        return {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url,
        };
      });

      const newImages = await Promise.all(uploadPromises);
      onImagesChange([...images, ...newImages]);
      
      toast.success(`${files.length} φωτογραφίες ανέβηκαν επιτυχώς!`);
    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast.error(error.message || "Σφάλμα κατά το ανέβασμα των φωτογραφιών");
    } finally {
      setUploading(false);
      // Reset input value so the same file can be selected again
      e.target.value = '';
    }
  };

  const moveImage = (dragIndex: number, hoverIndex: number) => {
    const newImages = [...images];
    const draggedImage = newImages[dragIndex];
    newImages.splice(dragIndex, 1);
    newImages.splice(hoverIndex, 0, draggedImage);
    onImagesChange(newImages);
  };

  const removeImage = async (id: string, url: string) => {
    try {
      // Only delete if it's a Supabase Storage URL
      if (url.includes('supabase')) {
        await deleteImage(url, 'gallery');
      }
      onImagesChange(images.filter((img) => img.id !== id));
      toast.success("Η φωτογραφία διαγράφηκε");
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast.error("Σφάλμα κατά τη διαγραφή της φωτογραφίας");
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Gallery Φωτογραφιών</h3>
          <Button 
            onClick={() => inputRef.current?.click()}
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
                Προσθήκη στη Συλλογή
              </>
            )}
          </Button>
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <DraggableImage
                key={image.id}
                image={image}
                index={index}
                moveImage={moveImage}
                onRemove={removeImage}
              />
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed rounded-lg p-12 text-center text-muted-foreground">
            Δεν υπάρχουν φωτογραφίες. Προσθέστε φωτογραφίες στη συλλογή.
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>
    </DndProvider>
  );
}

import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import { useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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
  onRemove: (id: string) => void;
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
        onClick={() => onRemove(image.id)}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

export function GalleryManager({ images, onImagesChange }: GalleryManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const readPromises = files.map((file) => {
      return new Promise<GalleryImage>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            url: reader.result as string,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then((newImages) => {
      onImagesChange([...images, ...newImages]);
    });
    
    // Reset input value so the same file can be selected again
    e.target.value = '';
  };

  const moveImage = (dragIndex: number, hoverIndex: number) => {
    const newImages = [...images];
    const draggedImage = newImages[dragIndex];
    newImages.splice(dragIndex, 1);
    newImages.splice(hoverIndex, 0, draggedImage);
    onImagesChange(newImages);
  };

  const removeImage = (id: string) => {
    onImagesChange(images.filter((img) => img.id !== id));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Gallery Φωτογραφιών</h3>
          <Button onClick={() => inputRef.current?.click()}>
            <ImagePlus className="w-4 h-4 mr-2" />
            Προσθήκη στη Συλλογή
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
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </DndProvider>
  );
}

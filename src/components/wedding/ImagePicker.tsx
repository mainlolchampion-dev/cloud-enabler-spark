import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import { useRef } from "react";

interface ImagePickerProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
}

export function ImagePicker({ label, value, onChange, onRemove }: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
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
              onClick={onRemove}
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
        >
          <ImagePlus className="w-4 h-4 mr-2" />
          Προσθέστε Εικόνα
        </Button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

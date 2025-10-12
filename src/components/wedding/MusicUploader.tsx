import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Link as LinkIcon, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MusicUploaderProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
}

export function MusicUploader({
  label = "Μουσική",
  value = "",
  onChange,
  bucket = "invitations",
  folder = "music",
}: MusicUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value || "");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      const validTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"];
      if (!validTypes.includes(file.type)) {
        toast.error("Μόνο αρχεία MP3, WAV ή OGG επιτρέπονται");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Το αρχείο είναι πολύ μεγάλο (max 10MB)");
        return;
      }

      setUploading(true);

      // Generate unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const extension = file.name.split(".").pop();
      const filename = `${timestamp}-${randomStr}.${extension}`;
      const path = folder ? `${folder}/${filename}` : filename;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(data.path);

      onChange(publicUrl);
      setUrlInput(publicUrl);
      toast.success("Η μουσική ανέβηκε επιτυχώς!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Σφάλμα κατά το ανέβασμα: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast.error("Παρακαλώ εισάγετε ένα URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(urlInput);
      onChange(urlInput);
      toast.success("Το URL προστέθηκε επιτυχώς!");
    } catch {
      toast.error("Μη έγκυρο URL");
    }
  };

  const handleClear = () => {
    onChange("");
    setUrlInput("");
    toast.success("Η μουσική αφαιρέθηκε");
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>

      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url">
            <LinkIcon className="w-4 h-4 mr-2" />
            URL
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="w-4 h-4 mr-2" />
            Ανέβασμα
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://youtube.com/... ή άλλο URL μουσικής"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleUrlSubmit} variant="outline">
              Προσθήκη
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Υποστηρίζονται links από YouTube, Spotify, SoundCloud, κλπ.
          </p>
        </TabsContent>

        <TabsContent value="upload" className="space-y-3">
          <div className="flex items-center gap-3">
            <Input
              type="file"
              accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg"
              onChange={handleFileUpload}
              disabled={uploading}
              className="flex-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Μέγιστο μέγεθος: 10MB. Υποστηριζόμενοι τύποι: MP3, WAV, OGG
          </p>
        </TabsContent>
      </Tabs>

      {/* Preview of current music */}
      {value && (
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">Τρέχουσα μουσική:</p>
            {value.includes("youtube.com") || value.includes("youtu.be") ? (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline break-all"
              >
                {value}
              </a>
            ) : (
              <audio controls className="w-full h-10">
                <source src={value} />
                Ο browser σας δεν υποστηρίζει αναπαραγωγή ήχου.
              </audio>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
          Ανέβασμα...
        </div>
      )}
    </div>
  );
}

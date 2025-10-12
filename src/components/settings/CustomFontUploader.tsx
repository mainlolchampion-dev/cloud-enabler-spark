import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Trash2, Eye, Download, Type } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface CustomFont {
  id: string;
  name: string;
  url: string;
  category: "serif" | "sans-serif" | "display" | "handwriting";
  uploadedAt: string;
}

interface CustomFontUploaderProps {
  invitationId: string;
  onFontSelect?: (fontUrl: string, fontName: string) => void;
}

export function CustomFontUploader({ invitationId, onFontSelect }: CustomFontUploaderProps) {
  const [fonts, setFonts] = useState<CustomFont[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CustomFont["category"]>("sans-serif");
  const [fontName, setFontName] = useState("");
  const [previewText, setPreviewText] = useState("Αα Ββ Γγ 123");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [".woff", ".woff2", ".ttf", ".otf"];
    const fileExt = file.name.substring(file.name.lastIndexOf("."));
    if (!validTypes.includes(fileExt.toLowerCase())) {
      toast.error("Μη έγκυρος τύπος αρχείου. Επιτρέπονται: .woff, .woff2, .ttf, .otf");
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Το αρχείο είναι πολύ μεγάλο. Μέγιστο μέγεθος: 2MB");
      return;
    }

    if (!fontName.trim()) {
      toast.error("Παρακαλώ εισάγετε όνομα γραμματοσειράς");
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const fileName = `${user.id}/${invitationId}/${Date.now()}-${file.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("fonts")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("fonts")
        .getPublicUrl(fileName);

      const newFont: CustomFont = {
        id: Date.now().toString(),
        name: fontName,
        url: publicUrl,
        category: selectedCategory,
        uploadedAt: new Date().toISOString(),
      };

      setFonts([...fonts, newFont]);
      
      // Load font dynamically
      const fontFace = new FontFace(fontName, `url(${publicUrl})`);
      await fontFace.load();
      document.fonts.add(fontFace);

      toast.success(`Η γραμματοσειρά "${fontName}" μεταφορτώθηκε επιτυχώς!`);
      setFontName("");
    } catch (error) {
      console.error("Error uploading font:", error);
      toast.error("Σφάλμα κατά τη μεταφόρτωση της γραμματοσειράς");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFont = async (font: CustomFont) => {
    try {
      const fileName = font.url.split("/").pop();
      if (!fileName) throw new Error("Invalid font URL");

      const { error } = await supabase.storage
        .from("fonts")
        .remove([fileName]);

      if (error) throw error;

      setFonts(fonts.filter(f => f.id !== font.id));
      toast.success("Η γραμματοσειρά διαγράφηκε επιτυχώς");
    } catch (error) {
      console.error("Error deleting font:", error);
      toast.error("Σφάλμα κατά τη διαγραφή της γραμματοσειράς");
    }
  };

  const handleSelectFont = (font: CustomFont) => {
    if (onFontSelect) {
      onFontSelect(font.url, font.name);
      toast.success(`Επιλέχθηκε η γραμματοσειρά "${font.name}"`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5" />
              Custom Γραμματοσειρές
            </CardTitle>
            <CardDescription>
              Μεταφορτώστε τις δικές σας γραμματοσειρές για την πρόσκλησή σας
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-purple-600 border-purple-600">
            Premium
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
          <div className="space-y-2">
            <Label htmlFor="font-name">Όνομα Γραμματοσειράς</Label>
            <Input
              id="font-name"
              value={fontName}
              onChange={(e) => setFontName(e.target.value)}
              placeholder="π.χ. My Custom Font"
              disabled={uploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="font-category">Κατηγορία</Label>
            <Select
              value={selectedCategory}
              onValueChange={(value: CustomFont["category"]) => setSelectedCategory(value)}
              disabled={uploading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sans-serif">Sans Serif</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="display">Display</SelectItem>
                <SelectItem value="handwriting">Handwriting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="font-file">Αρχείο Γραμματοσειράς</Label>
            <div className="flex gap-2">
              <Input
                id="font-file"
                type="file"
                accept=".woff,.woff2,.ttf,.otf"
                onChange={handleFileUpload}
                disabled={uploading}
                className="cursor-pointer"
              />
              <Button disabled={uploading} size="icon" variant="outline">
                <Upload className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Υποστηρίζονται: .woff, .woff2, .ttf, .otf (max 2MB)
            </p>
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-2">
          <Label htmlFor="preview-text">Προεπισκόπηση Κειμένου</Label>
          <Input
            id="preview-text"
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            placeholder="Εισάγετε κείμενο για προεπισκόπηση"
          />
        </div>

        {/* Fonts List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Οι Γραμματοσειρές μου ({fonts.length})</Label>
          </div>

          {fonts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border rounded-lg">
              <Type className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Δεν έχετε μεταφορτώσει γραμματοσειρές ακόμα</p>
            </div>
          ) : (
            <div className="space-y-2">
              {fonts.map((font) => (
                <div
                  key={font.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{font.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {font.category}
                      </Badge>
                    </div>
                    <div
                      className="text-2xl"
                      style={{ fontFamily: font.name }}
                    >
                      {previewText}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectFont(font)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Επιλογή
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFont(font)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
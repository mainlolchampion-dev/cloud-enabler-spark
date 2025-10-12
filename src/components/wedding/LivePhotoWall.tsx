import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Camera, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LivePhotoWallProps {
  invitationId: string;
  isPublic?: boolean;
}

export const LivePhotoWall = ({ invitationId, isPublic = false }: LivePhotoWallProps) => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [guestName, setGuestName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadPhotos();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`photo-wall-${invitationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_photo_wall',
          filter: `invitation_id=eq.${invitationId}`,
        },
        () => {
          loadPhotos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [invitationId]);

  const loadPhotos = async () => {
    const { data, error } = await supabase
      .from('live_photo_wall')
      .select('*')
      .eq('invitation_id', invitationId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error loading photos:', error);
      return;
    }

    setPhotos(data || []);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isPublic && !guestName) {
      toast({
        title: "Απαιτείται Όνομα",
        description: "Παρακαλώ εισάγετε το όνομά σας πριν ανεβάσετε φωτογραφία.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${invitationId}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);
      
      const { error } = await supabase
        .from('live_photo_wall')
        .insert({
          invitation_id: invitationId,
          photo_url: publicUrl,
          uploaded_by: isPublic ? (guestName || 'Καλεσμένος') : 'Διαχειριστής',
        });

      if (error) throw error;

      toast({
        title: "Επιτυχία!",
        description: "Η φωτογραφία ανέβηκε στο Live Photo Wall!",
      });
      
      e.target.value = '';
      if (isPublic) setGuestName('');
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία ανεβάσματος φωτογραφίας.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId: string) => {
    if (!confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή τη φωτογραφία;")) return;

    const { error } = await supabase
      .from('live_photo_wall')
      .delete()
      .eq('id', photoId);

    if (error) {
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία διαγραφής φωτογραφίας.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Διαγράφηκε",
      description: "Η φωτογραφία διαγράφηκε επιτυχώς.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Live Photo Wall
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div className="space-y-3">
          {isPublic && (
            <Input
              type="text"
              placeholder="Το όνομά σας"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
          )}
          <div className="flex gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={uploading}
                asChild
              >
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? "Ανέβασμα..." : "Ανέβασμα Φωτογραφίας"}
                </span>
              </Button>
            </label>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group aspect-square">
              <img
                src={photo.photo_url}
                alt={`Από ${photo.uploaded_by}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center text-white p-2">
                <p className="text-sm font-medium">{photo.uploaded_by}</p>
                <p className="text-xs">{new Date(photo.uploaded_at).toLocaleDateString('el')}</p>
                {!isPublic && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="mt-2"
                    onClick={() => handleDelete(photo.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {photos.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Δεν υπάρχουν φωτογραφίες ακόμα</p>
            <p className="text-sm">
              {isPublic 
                ? "Ανεβάστε τις πρώτες φωτογραφίες από την εκδήλωση!"
                : "Οι καλεσμένοι μπορούν να ανεβάσουν φωτογραφίες εδώ!"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

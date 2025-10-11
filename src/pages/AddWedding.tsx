import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { PublishPanel } from "@/components/wedding/PublishPanel";
import { ImagePicker } from "@/components/wedding/ImagePicker";
import { RichTextEditor } from "@/components/wedding/RichTextEditor";
import { MapPicker } from "@/components/wedding/MapPicker";
import { RepeatableTable } from "@/components/wedding/RepeatableTable";
import { GalleryManager } from "@/components/wedding/GalleryManager";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { generateUUID, publishInvitation } from "@/lib/invitationStorage";
import { ShareModal } from "@/components/wedding/ShareModal";
import { PreviewModal } from "@/components/wedding/PreviewModal";
import { supabase } from "@/integrations/supabase/client";

interface WeddingData {
  title: string;
  mainImage: string;
  invitationText: string;
  groomName: string;
  groomPhoto: string;
  brideName: string;
  bridePhoto: string;
  koumbaroi: Array<{ id: string; col1: string; col2: string }>;
  weddingDate: string;
  weddingTime: string;
  churchLocation: string;
  churchPosition: [number, number] | null;
  receptionLocation: string;
  receptionPosition: [number, number] | null;
  bankAccounts: Array<{ id: string; col1: string; col2: string }>;
  contactInfo: string;
  groomFamily: string[];
  brideFamily: string[];
  gallery: Array<{ id: string; url: string }>;
}

const STORAGE_KEY = "wedding_draft";

export default function AddWedding() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(isEditMode);

  const [data, setData] = useState<WeddingData>({
    title: "Ο Γάμος μας",
    mainImage: "",
    invitationText: "",
    groomName: "",
    groomPhoto: "",
    brideName: "",
    bridePhoto: "",
    koumbaroi: [],
    weddingDate: "",
    weddingTime: "",
    churchLocation: "",
    churchPosition: null,
    receptionLocation: "",
    receptionPosition: null,
    bankAccounts: [],
    contactInfo: "",
    groomFamily: [],
    brideFamily: [],
    gallery: [],
  });

  const [newGroomFamily, setNewGroomFamily] = useState("");
  const [newBrideFamily, setNewBrideFamily] = useState("");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      loadInvitation(id);
    } else {
      // Load from localStorage for new invitations
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setData(JSON.parse(saved));
      }
    }
  }, [id, isEditMode]);

  useEffect(() => {
    if (!isEditMode) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isEditMode]);

  const loadInvitation = async (invitationId: string) => {
    try {
      setLoading(true);
      const { data: invitation, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('id', invitationId)
        .single();

      if (error) throw error;
      
      if (invitation && invitation.data) {
        setData(invitation.data as unknown as WeddingData);
      }
      
      toast.success("Η πρόσκληση φορτώθηκε επιτυχώς");
    } catch (error) {
      console.error("Error loading invitation:", error);
      toast.error("Σφάλμα κατά τη φόρτωση της πρόσκλησης");
      navigate("/wedding/all");
    } finally {
      setLoading(false);
    }
  };

  const updateData = (field: keyof WeddingData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const addGroomFamily = () => {
    if (newGroomFamily.trim()) {
      updateData("groomFamily", [...data.groomFamily, newGroomFamily.trim()]);
      setNewGroomFamily("");
    }
  };

  const addBrideFamily = () => {
    if (newBrideFamily.trim()) {
      updateData("brideFamily", [...data.brideFamily, newBrideFamily.trim()]);
      setNewBrideFamily("");
    }
  };

  const removeGroomFamily = (index: number) => {
    updateData(
      "groomFamily",
      data.groomFamily.filter((_, i) => i !== index)
    );
  };

  const removeBrideFamily = (index: number) => {
    updateData(
      "brideFamily",
      data.brideFamily.filter((_, i) => i !== index)
    );
  };

  const validateData = (): boolean => {
    const required = [
      { field: data.title, name: "Τίτλος" },
      { field: data.mainImage, name: "Κύρια Φωτογραφία" },
      { field: data.groomName, name: "Όνομα Γαμπρού" },
      { field: data.brideName, name: "Όνομα Νύφης" },
      { field: data.weddingDate, name: "Ημερομηνία Γάμου" },
      { field: data.weddingTime, name: "Ώρα Γάμου" },
      { field: data.churchLocation, name: "Τοποθεσία Εκκλησίας" },
    ];

    for (const item of required) {
      if (!item.field) {
        toast.error(`Το πεδίο "${item.name}" είναι υποχρεωτικό`);
        return false;
      }
    }

    // Validate IBANs
    for (const account of data.bankAccounts) {
      if (account.col2 && !/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(account.col2)) {
        toast.error(`Μη έγκυρος IBAN: ${account.col2}`);
        return false;
      }
    }

    return true;
  };

  const handleSaveDraft = () => {
    toast.success(isEditMode ? "Οι αλλαγές αποθηκεύτηκαν" : "Το προσχέδιο αποθηκεύτηκε επιτυχώς");
  };

  const handlePreview = () => {
    if (!validateData()) return;
    setPreviewModalOpen(true);
  };

  const handlePublish = async () => {
    if (!validateData()) return;
    
    try {
      const invitationId = isEditMode ? id! : generateUUID();
      console.log('🎯 Starting publish process:', { invitationId, isEditMode, title: data.title });
      
      await publishInvitation(invitationId, data, 'wedding', data.title);
      
      if (!isEditMode) {
        // Clear draft only for new invitations
        localStorage.removeItem(STORAGE_KEY);
      }
      
      setPublishedId(invitationId);
      setShareModalOpen(true);
      
      toast.success(isEditMode ? "Η πρόσκληση ενημερώθηκε επιτυχώς!" : "Η πρόσκληση δημοσιεύτηκε επιτυχώς!");
      
      if (isEditMode) {
        setTimeout(() => navigate("/wedding/all"), 2000);
      }
    } catch (error: any) {
      console.error('❌ Error publishing invitation:', error);
      toast.error(error?.message || "Σφάλμα κατά τη δημοσίευση της πρόσκλησης");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Φόρτωση πρόσκλησης...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-6">
            <Input
              value={data.title}
              onChange={(e) => updateData("title", e.target.value)}
              className="text-3xl font-semibold border-0 border-b rounded-none px-0 focus-visible:ring-0"
              placeholder="Προσθήκη τίτλου"
            />

            <Card>
              <CardHeader>
                <CardTitle>Κύρια Φωτογραφία</CardTitle>
              </CardHeader>
              <CardContent>
                <ImagePicker
                  label=""
                  value={data.mainImage}
                  onChange={(url) => updateData("mainImage", url)}
                  onRemove={() => updateData("mainImage", "")}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Κείμενο Προσκλητηρίου</CardTitle>
              </CardHeader>
              <CardContent>
                <RichTextEditor
                  value={data.invitationText}
                  onChange={(value) => updateData("invitationText", value)}
                  placeholder="Γράψτε το κείμενο του προσκλητηρίου..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Στοιχεία Ζευγαριού</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={data.groomName}
                  onChange={(e) => updateData("groomName", e.target.value)}
                  placeholder="Όνομα Γαμπρού"
                />
                <ImagePicker
                  label="Φωτογραφία Γαμπρού"
                  value={data.groomPhoto}
                  onChange={(url) => updateData("groomPhoto", url)}
                  onRemove={() => updateData("groomPhoto", "")}
                />
                <Input
                  value={data.brideName}
                  onChange={(e) => updateData("brideName", e.target.value)}
                  placeholder="Όνομα Νύφης"
                />
                <ImagePicker
                  label="Φωτογραφία Νύφης"
                  value={data.bridePhoto}
                  onChange={(url) => updateData("bridePhoto", url)}
                  onRemove={() => updateData("bridePhoto", "")}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Κουμπάροι</CardTitle>
              </CardHeader>
              <CardContent>
                <RepeatableTable
                  title=""
                  col1Label="Όνομα Κουμπάρου"
                  col2Label="Φωτογραφία Κουμπάρου"
                  col2Type="image"
                  rows={data.koumbaroi}
                  onRowsChange={(rows) => updateData("koumbaroi", rows)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ημερομηνία & Ώρα</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Ημερομηνία Γάμου</label>
                  <Input
                    type="date"
                    value={data.weddingDate}
                    onChange={(e) => updateData("weddingDate", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Ώρα Γάμου</label>
                  <Input
                    type="time"
                    value={data.weddingTime}
                    onChange={(e) => updateData("weddingTime", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Τοποθεσία Μυστηρίου (Εκκλησία)</CardTitle>
              </CardHeader>
              <CardContent>
                <MapPicker
                  label=""
                  locationName={data.churchLocation}
                  onLocationNameChange={(name) => updateData("churchLocation", name)}
                  position={data.churchPosition}
                  onPositionChange={(pos) => updateData("churchPosition", pos)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Δεξίωση (προαιρετικό)</CardTitle>
              </CardHeader>
              <CardContent>
                <MapPicker
                  label="Τοποθεσία που θα γίνει το Τραπέζι (προαιρετικό)"
                  locationName={data.receptionLocation}
                  onLocationNameChange={(name) => updateData("receptionLocation", name)}
                  position={data.receptionPosition}
                  onPositionChange={(pos) => updateData("receptionPosition", pos)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Αριθμοί Κατάθεσης</CardTitle>
              </CardHeader>
              <CardContent>
                <RepeatableTable
                  title=""
                  col1Label="Τράπεζα"
                  col2Label="IBAN"
                  rows={data.bankAccounts}
                  onRowsChange={(rows) => updateData("bankAccounts", rows)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Στοιχεία Επικοινωνίας</CardTitle>
              </CardHeader>
              <CardContent>
                <RichTextEditor
                  value={data.contactInfo}
                  onChange={(value) => updateData("contactInfo", value)}
                  placeholder="Προσθέστε τηλέφωνα, email και άλλες πληροφορίες επικοινωνίας..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Οικογένειες</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Οικογένεια Γαμπρού</h4>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newGroomFamily}
                      onChange={(e) => setNewGroomFamily(e.target.value)}
                      placeholder="Όνομα μέλους οικογένειας"
                      onKeyDown={(e) => e.key === "Enter" && addGroomFamily()}
                    />
                    <Button onClick={addGroomFamily}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.groomFamily.map((name, index) => (
                      <div
                        key={index}
                        className="bg-secondary px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        <span>{name}</span>
                        <button
                          onClick={() => removeGroomFamily(index)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Οικογένεια Νύφης</h4>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newBrideFamily}
                      onChange={(e) => setNewBrideFamily(e.target.value)}
                      placeholder="Όνομα μέλους οικογένειας"
                      onKeyDown={(e) => e.key === "Enter" && addBrideFamily()}
                    />
                    <Button onClick={addBrideFamily}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.brideFamily.map((name, index) => (
                      <div
                        key={index}
                        className="bg-secondary px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        <span>{name}</span>
                        <button
                          onClick={() => removeBrideFamily(index)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gallery Φωτογραφιών</CardTitle>
              </CardHeader>
              <CardContent>
                <GalleryManager
                  images={data.gallery}
                  onImagesChange={(images) => updateData("gallery", images)}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:sticky lg:top-6 h-fit">
            <PublishPanel
              onSaveDraft={handleSaveDraft}
              onPreview={handlePreview}
              onPublish={handlePublish}
            />
          </div>
        </div>
      </div>
      
      <PreviewModal
        open={previewModalOpen}
        onOpenChange={setPreviewModalOpen}
        invitationType="wedding"
        data={data}
        onPublish={() => {
          setPreviewModalOpen(false);
          handlePublish();
        }}
      />

      {publishedId && (
        <ShareModal
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          invitationUrl={`${window.location.origin}/prosklisi/${publishedId}`}
          title={data.title}
        />
      )}
    </div>
  );
}
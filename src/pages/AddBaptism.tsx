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
import { WebhookIntegration } from "@/components/wedding/WebhookIntegration";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";

interface BaptismData {
  title: string;
  mainImage: string;
  invitationText: string;
  childName: string;
  childPhoto: string;
  godparents: Array<{ id: string; col1: string; col2: string }>;
  baptismDate: string;
  baptismTime: string;
  churchLocation: string;
  churchPosition: [number, number] | null;
  receptionLocation: string;
  receptionPosition: [number, number] | null;
  bankAccounts: Array<{ id: string; col1: string; col2: string }>;
  contactInfo: string;
  parentsFamily: string[];
  gallery: Array<{ id: string; url: string }>;
}

const STORAGE_KEY = "baptism_draft";

export default function AddBaptism() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(isEditMode);

  const [data, setData] = useState<BaptismData>({
    title: "Η Βάπτιση μας",
    mainImage: "",
    invitationText: "",
    childName: "",
    childPhoto: "",
    godparents: [],
    baptismDate: "",
    baptismTime: "",
    churchLocation: "",
    churchPosition: null,
    receptionLocation: "",
    receptionPosition: null,
    bankAccounts: [],
    contactInfo: "",
    parentsFamily: [],
    gallery: [],
  });

  const [newParent, setNewParent] = useState("");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isEditMode && id) {
      loadInvitation(id);
    } else {
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
        setData(invitation.data as unknown as BaptismData);
        setWebhookUrl(invitation.webhook_url || "");
        setPassword(invitation.password || "");
      }
      
      toast.success("Η πρόσκληση φορτώθηκε επιτυχώς");
    } catch (error) {
      console.error("Error loading invitation:", error);
      toast.error("Σφάλμα κατά τη φόρτωση της πρόσκλησης");
      navigate("/baptism/all");
    } finally {
      setLoading(false);
    }
  };

  const updateData = (field: keyof BaptismData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const addParent = () => {
    if (newParent.trim()) {
      updateData("parentsFamily", [...data.parentsFamily, newParent.trim()]);
      setNewParent("");
    }
  };

  const removeParent = (index: number) => {
    updateData(
      "parentsFamily",
      data.parentsFamily.filter((_, i) => i !== index)
    );
  };

  const validateData = (): boolean => {
    const required = [
      { field: data.title, name: "Τίτλος" },
      { field: data.mainImage, name: "Κύρια Φωτογραφία" },
      { field: data.childName, name: "Όνομα Παιδιού" },
      { field: data.baptismDate, name: "Ημερομηνία Βάπτισης" },
      { field: data.baptismTime, name: "Ώρα Βάπτισης" },
      { field: data.churchLocation, name: "Τοποθεσία Εκκλησίας" },
    ];

    for (const item of required) {
      if (!item.field) {
        toast.error(`Το πεδίο "${item.name}" είναι υποχρεωτικό`);
        return false;
      }
    }

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

  const handleWebhookSave = async (url: string) => {
    if (!id) return;
    
    const { error } = await supabase
      .from('invitations')
      .update({ webhook_url: url })
      .eq('id', id);

    if (error) throw error;
    setWebhookUrl(url);
  };

  const handlePasswordSave = async () => {
    if (!id) return;
    
    const { error } = await supabase
      .from('invitations')
      .update({ password: password || null })
      .eq('id', id);

    if (error) {
      toast.error("Σφάλμα αποθήκευσης κωδικού");
      return;
    }
    
    toast.success("Ο κωδικός αποθηκεύτηκε");
  };

  const handlePublish = async () => {
    if (!validateData()) return;
    
    try {
      const invitationId = isEditMode ? id! : generateUUID();
      
      await publishInvitation(invitationId, data, 'baptism', data.title);

      // Update webhook and password
      if (webhookUrl || password) {
        await supabase
          .from('invitations')
          .update({ 
            webhook_url: webhookUrl || null,
            password: password || null
          })
          .eq('id', invitationId);
      }
      
      if (!isEditMode) {
        localStorage.removeItem(STORAGE_KEY);
      }
      
      setPublishedId(invitationId);
      setShareModalOpen(true);
      
      toast.success(isEditMode ? "Η πρόσκληση ενημερώθηκε επιτυχώς!" : "Η πρόσκληση δημοσιεύτηκε επιτυχώς!");
      
      if (isEditMode) {
        setTimeout(() => navigate("/baptism/all"), 2000);
      }
    } catch (error: any) {
      console.error('❌ Error publishing invitation:', error);
      toast.error(error?.message || "Σφάλμα κατά τη δημοσίευση της πρόσκλησης");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Φόρτωση πρόσκλησης...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
            {isEditMode ? 'Επεξεργασία' : 'Δημιουργία'} Πρόσκλησης Βάπτισης
          </h1>
          <p className="text-muted-foreground text-lg">Συμπληρώστε τα στοιχεία για την πρόσκλησή σας</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-8">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Τίτλος Πρόσκλησης</label>
              <Input
                value={data.title}
                onChange={(e) => updateData("title", e.target.value)}
                className="text-2xl font-serif border-2 h-16 px-4"
                placeholder="π.χ. Η Βάπτιση μας"
              />
            </div>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Κύρια Φωτογραφία</CardTitle>
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

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Κείμενο Προσκλητηρίου</CardTitle>
              </CardHeader>
              <CardContent>
                <RichTextEditor
                  value={data.invitationText}
                  onChange={(value) => updateData("invitationText", value)}
                  placeholder="Γράψτε το κείμενο του προσκλητηρίου..."
                />
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Στοιχεία Παιδιού</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Όνομα Παιδιού</label>
                  <Input
                    value={data.childName}
                    onChange={(e) => updateData("childName", e.target.value)}
                    placeholder="π.χ. Μαρία Παπαδοπούλου"
                    className="h-12"
                  />
                </div>
                <ImagePicker
                  label="Φωτογραφία Παιδιού (Προαιρετικό)"
                  value={data.childPhoto}
                  onChange={(url) => updateData("childPhoto", url)}
                  onRemove={() => updateData("childPhoto", "")}
                />
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Ανάδοχοι (Προαιρετικό)</CardTitle>
              </CardHeader>
              <CardContent>
                <RepeatableTable
                  title=""
                  col1Label="Όνομα Αναδόχου"
                  col2Label="Φωτογραφία Αναδόχου"
                  col2Type="image"
                  rows={data.godparents}
                  onRowsChange={(rows) => updateData("godparents", rows)}
                />
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Ημερομηνία & Ώρα</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ημερομηνία Βάπτισης</label>
                  <Input
                    type="date"
                    value={data.baptismDate}
                    onChange={(e) => updateData("baptismDate", e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ώρα Βάπτισης</label>
                  <Input
                    type="time"
                    value={data.baptismTime}
                    onChange={(e) => updateData("baptismTime", e.target.value)}
                    className="h-12"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Τοποθεσία Μυστηρίου (Εκκλησία)</CardTitle>
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

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Δεξίωση (Προαιρετικό)</CardTitle>
              </CardHeader>
              <CardContent>
                <MapPicker
                  label=""
                  locationName={data.receptionLocation}
                  onLocationNameChange={(name) => updateData("receptionLocation", name)}
                  position={data.receptionPosition}
                  onPositionChange={(pos) => updateData("receptionPosition", pos)}
                />
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Αριθμοί Κατάθεσης (Προαιρετικό)</CardTitle>
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

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Στοιχεία Επικοινωνίας (Προαιρετικό)</CardTitle>
              </CardHeader>
              <CardContent>
                <RichTextEditor
                  value={data.contactInfo}
                  onChange={(value) => updateData("contactInfo", value)}
                  placeholder="Προσθέστε τηλέφωνα, email και άλλες πληροφορίες επικοινωνίας..."
                />
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Οικογένεια Γονέων (Προαιρετικό)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newParent}
                    onChange={(e) => setNewParent(e.target.value)}
                    placeholder="Όνομα μέλους οικογένειας"
                    onKeyDown={(e) => e.key === "Enter" && addParent()}
                    className="h-11"
                  />
                  <Button onClick={addParent} size="lg">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.parentsFamily.map((name, index) => (
                    <div
                      key={index}
                      className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-full flex items-center gap-2 text-sm"
                    >
                      <span>{name}</span>
                      <button
                        onClick={() => removeParent(index)}
                        className="text-destructive hover:text-destructive/80 font-bold text-lg leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Gallery Φωτογραφιών (Προαιρετικό)</CardTitle>
              </CardHeader>
              <CardContent>
                <GalleryManager
                  images={data.gallery}
                  onImagesChange={(images) => updateData("gallery", images)}
                />
              </CardContent>
            </Card>

            {/* Webhook Integration - Only in edit mode */}
            {isEditMode && (
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl">Webhook Integration (Προαιρετικό)</CardTitle>
                </CardHeader>
                <CardContent>
                  <WebhookIntegration
                    invitationId={id!}
                    currentWebhookUrl={webhookUrl}
                    onSave={handleWebhookSave}
                  />
                </CardContent>
              </Card>
            )}

            {/* Password Protection - Only in edit mode */}
            {isEditMode && (
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl">Προστασία με Κωδικό (Προαιρετικό)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Κωδικός Πρόσβασης</Label>
                    <Input
                      id="password"
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Εισάγετε κωδικό για την πρόσκληση"
                      className="h-12"
                    />
                    <p className="text-sm text-muted-foreground">
                      Οι επισκέπτες θα πρέπει να εισάγουν αυτόν τον κωδικό για να δουν την πρόσκληση
                    </p>
                  </div>
                  <Button onClick={handlePasswordSave} className="w-full">
                    Αποθήκευση Κωδικού
                  </Button>
                </CardContent>
              </Card>
            )}
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
        invitationType="baptism"
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

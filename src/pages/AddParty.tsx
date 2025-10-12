import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { PublishPanel } from "@/components/wedding/PublishPanel";
import { ImagePicker } from "@/components/wedding/ImagePicker";
import { RichTextEditor } from "@/components/wedding/RichTextEditor";
import { MapPicker } from "@/components/wedding/MapPicker";
import { RepeatableTable } from "@/components/wedding/RepeatableTable";
import { GalleryManager } from "@/components/wedding/GalleryManager";
import { generateUUID, publishInvitation } from "@/lib/invitationStorage";
import { ShareModal } from "@/components/wedding/ShareModal";
import { PreviewModal } from "@/components/wedding/PreviewModal";
import { WebhookIntegration } from "@/components/wedding/WebhookIntegration";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";

interface PartyData {
  title: string;
  mainImage: string;
  invitationText: string;
  partyDate: string;
  partyTime: string;
  venueLocation: string;
  venuePosition: [number, number] | null;
  contactInfo: string;
  hosts: Array<{ id: string; col1: string; col2: string }>;
  gallery: Array<{ id: string; url: string }>;
}

const STORAGE_KEY = "party_draft";

export default function AddParty() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(isEditMode);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [password, setPassword] = useState("");
  
  const [data, setData] = useState<PartyData>({
    title: "Το Party μας",
    mainImage: "",
    invitationText: "",
    partyDate: "",
    partyTime: "",
    venueLocation: "",
    venuePosition: null,
    contactInfo: "",
    hosts: [],
    gallery: [],
  });

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
        setData(invitation.data as unknown as PartyData);
        setWebhookUrl(invitation.webhook_url || "");
        setPassword(invitation.password || "");
      }
      
      toast.success("Η πρόσκληση φορτώθηκε επιτυχώς");
    } catch (error) {
      console.error("Error loading invitation:", error);
      toast.error("Σφάλμα κατά τη φόρτωση της πρόσκλησης");
      navigate("/party/all");
    } finally {
      setLoading(false);
    }
  };

  const updateData = (field: keyof PartyData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const validateData = (): boolean => {
    const required = [
      { field: data.title, name: "Τίτλος" },
      { field: data.mainImage, name: "Κύρια Φωτογραφία" },
      { field: data.partyDate, name: "Ημερομηνία Party" },
      { field: data.partyTime, name: "Ώρα Party" },
      { field: data.venueLocation, name: "Τοποθεσία" },
    ];

    for (const item of required) {
      if (!item.field) {
        toast.error(`Το πεδίο "${item.name}" είναι υποχρεωτικό`);
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
      
      await publishInvitation(invitationId, data, 'party', data.title);

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
        setTimeout(() => navigate("/party/all"), 2000);
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
            {isEditMode ? 'Επεξεργασία' : 'Δημιουργία'} Πρόσκλησης Πάρτυ
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
                placeholder="π.χ. Το Party μας"
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
                <CardTitle className="text-xl">Οργανωτές (Προαιρετικό)</CardTitle>
              </CardHeader>
              <CardContent>
                <RepeatableTable
                  title=""
                  col1Label="Όνομα Οργανωτή"
                  col2Label="Φωτογραφία Οργανωτή"
                  col2Type="image"
                  rows={data.hosts}
                  onRowsChange={(rows) => updateData("hosts", rows)}
                />
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Ημερομηνία & Ώρα</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ημερομηνία Party</label>
                  <Input
                    type="date"
                    value={data.partyDate}
                    onChange={(e) => updateData("partyDate", e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ώρα Party</label>
                  <Input
                    type="time"
                    value={data.partyTime}
                    onChange={(e) => updateData("partyTime", e.target.value)}
                    className="h-12"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Τοποθεσία Party</CardTitle>
              </CardHeader>
              <CardContent>
                <MapPicker
                  label=""
                  locationName={data.venueLocation}
                  onLocationNameChange={(name) => updateData("venueLocation", name)}
                  position={data.venuePosition}
                  onPositionChange={(pos) => updateData("venuePosition", pos)}
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
        invitationType="party"
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

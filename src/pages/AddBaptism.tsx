import { useState, useEffect } from "react";
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
  const [data, setData] = useState<BaptismData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : {
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
        };
  });

  const [newParent, setNewParent] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

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
    toast.success("Το προσχέδιο αποθηκεύτηκε επιτυχώς");
  };

  const handlePreview = () => {
    if (!validateData()) return;
    toast.info("Προεπισκόπηση: Θα ανοίξει σε νέο παράθυρο");
    console.log("Preview data:", data);
  };

  const handlePublish = () => {
    if (!validateData()) return;
    
    // Save to invitations list
    const invitations = JSON.parse(localStorage.getItem("baptism_invitations") || "[]");
    const newInvitation = {
      id: Date.now().toString(),
      title: data.title,
      baptismDate: data.baptismDate,
      createdAt: new Date().toISOString(),
      data: data,
    };
    invitations.push(newInvitation);
    localStorage.setItem("baptism_invitations", JSON.stringify(invitations));
    
    // Clear draft
    localStorage.removeItem(STORAGE_KEY);
    
    toast.success("Η πρόσκληση δημοσιεύτηκε επιτυχώς!");
  };

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
                <CardTitle>Στοιχεία Παιδιού</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={data.childName}
                  onChange={(e) => updateData("childName", e.target.value)}
                  placeholder="Όνομα Παιδιού"
                />
                <ImagePicker
                  label="Φωτογραφία Παιδιού"
                  value={data.childPhoto}
                  onChange={(url) => updateData("childPhoto", url)}
                  onRemove={() => updateData("childPhoto", "")}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ανάδοχοι</CardTitle>
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

            <Card>
              <CardHeader>
                <CardTitle>Ημερομηνία & Ώρα</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Ημερομηνία Βάπτισης</label>
                  <Input
                    type="date"
                    value={data.baptismDate}
                    onChange={(e) => updateData("baptismDate", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Ώρα Βάπτισης</label>
                  <Input
                    type="time"
                    value={data.baptismTime}
                    onChange={(e) => updateData("baptismTime", e.target.value)}
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
                <CardTitle>Οικογένεια Γονέων</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newParent}
                    onChange={(e) => setNewParent(e.target.value)}
                    placeholder="Όνομα μέλους οικογένειας"
                    onKeyDown={(e) => e.key === "Enter" && addParent()}
                  />
                  <Button onClick={addParent}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.parentsFamily.map((name, index) => (
                    <div
                      key={index}
                      className="bg-secondary px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      <span>{name}</span>
                      <button
                        onClick={() => removeParent(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        ×
                      </button>
                    </div>
                  ))}
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
    </div>
  );
}

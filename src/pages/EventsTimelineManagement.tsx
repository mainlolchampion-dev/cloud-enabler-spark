import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Edit, MapPin, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getEvents, createEvent, updateEvent, deleteEvent, EventTimeline } from "@/lib/eventsStorage";

export default function EventsTimelineManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [events, setEvents] = useState<EventTimeline[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventTimeline | null>(null);
  
  const [formData, setFormData] = useState({
    eventName: '',
    eventDescription: '',
    eventDate: '',
    eventTime: '',
    locationName: '',
    locationAddress: '',
    locationLat: '',
    locationLng: '',
  });

  const loadEvents = async () => {
    if (!id) return;
    const data = await getEvents(id);
    setEvents(data);
  };

  useEffect(() => {
    loadEvents();
  }, [id]);

  const resetForm = () => {
    setFormData({
      eventName: '',
      eventDescription: '',
      eventDate: '',
      eventTime: '',
      locationName: '',
      locationAddress: '',
      locationLat: '',
      locationLng: '',
    });
    setEditingEvent(null);
  };

  const handleOpenDialog = (event?: EventTimeline) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        eventName: event.eventName,
        eventDescription: event.eventDescription || '',
        eventDate: event.eventDate,
        eventTime: event.eventTime || '',
        locationName: event.locationName || '',
        locationAddress: event.locationAddress || '',
        locationLat: event.locationLat?.toString() || '',
        locationLng: event.locationLng?.toString() || '',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!id || !formData.eventName || !formData.eventDate) return;

    try {
      const eventData = {
        invitationId: id,
        eventName: formData.eventName,
        eventDescription: formData.eventDescription || undefined,
        eventDate: formData.eventDate,
        eventTime: formData.eventTime || undefined,
        locationName: formData.locationName || undefined,
        locationAddress: formData.locationAddress || undefined,
        locationLat: formData.locationLat ? parseFloat(formData.locationLat) : undefined,
        locationLng: formData.locationLng ? parseFloat(formData.locationLng) : undefined,
        eventOrder: editingEvent?.eventOrder || events.length,
      };

      if (editingEvent) {
        await updateEvent(editingEvent.id, eventData);
        toast({ title: "Ενημερώθηκε η εκδήλωση" });
      } else {
        await createEvent(eventData);
        toast({ title: "Προστέθηκε η εκδήλωση" });
      }

      setIsDialogOpen(false);
      resetForm();
      loadEvents();
    } catch (error) {
      toast({ title: "Σφάλμα", variant: "destructive" });
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      toast({ title: "Διαγράφηκε η εκδήλωση" });
      loadEvents();
    } catch (error) {
      toast({ title: "Σφάλμα", variant: "destructive" });
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('el-GR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Πίσω
            </Button>
            <h1 className="text-3xl font-bold">Χρονοδιάγραμμα Εκδηλώσεων</h1>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Προσθήκη Εκδήλωσης
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingEvent ? 'Επεξεργασία' : 'Προσθήκη'} Εκδήλωσης</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Όνομα Εκδήλωσης *</Label>
                  <Input
                    value={formData.eventName}
                    onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                    placeholder="π.χ. Τελετή Γάμου"
                  />
                </div>
                <div>
                  <Label>Περιγραφή</Label>
                  <Textarea
                    value={formData.eventDescription}
                    onChange={(e) => setFormData({ ...formData, eventDescription: e.target.value })}
                    placeholder="Περιγράψτε την εκδήλωση..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Ημερομηνία *</Label>
                    <Input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Ώρα</Label>
                    <Input
                      type="time"
                      value={formData.eventTime}
                      onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Όνομα Τοποθεσίας</Label>
                  <Input
                    value={formData.locationName}
                    onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                    placeholder="π.χ. Εκκλησία Αγίου Νικολάου"
                  />
                </div>
                <div>
                  <Label>Διεύθυνση</Label>
                  <Input
                    value={formData.locationAddress}
                    onChange={(e) => setFormData({ ...formData, locationAddress: e.target.value })}
                    placeholder="Οδός, Αριθμός, Πόλη"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Γεωγραφικό Πλάτος</Label>
                    <Input
                      type="number"
                      step="any"
                      value={formData.locationLat}
                      onChange={(e) => setFormData({ ...formData, locationLat: e.target.value })}
                      placeholder="37.9838"
                    />
                  </div>
                  <div>
                    <Label>Γεωγραφικό Μήκος</Label>
                    <Input
                      type="number"
                      step="any"
                      value={formData.locationLng}
                      onChange={(e) => setFormData({ ...formData, locationLng: e.target.value })}
                      placeholder="23.7275"
                    />
                  </div>
                </div>
                <Button onClick={handleSave} className="w-full">
                  {editingEvent ? 'Ενημέρωση' : 'Προσθήκη'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {events.map((event, index) => (
            <Card key={event.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <h3 className="text-2xl font-bold">{event.eventName}</h3>
                  </div>
                  
                  {event.eventDescription && (
                    <p className="text-muted-foreground mb-4 ml-13">
                      {event.eventDescription}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(event)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(event.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="ml-13 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(event.eventDate)}</span>
                  {event.eventTime && (
                    <>
                      <Clock className="w-4 h-4 ml-4" />
                      <span>{event.eventTime}</span>
                    </>
                  )}
                </div>

                {event.locationName && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-1" />
                    <div>
                      <p className="font-medium text-foreground">{event.locationName}</p>
                      {event.locationAddress && (
                        <p className="text-sm">{event.locationAddress}</p>
                      )}
                      {event.locationLat && event.locationLng && (
                        <a
                          href={`https://www.google.com/maps?q=${event.locationLat},${event.locationLng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          Δείτε στο χάρτη →
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Δεν υπάρχουν εκδηλώσεις. Προσθέστε την πρώτη σας!</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  UserPlus,
  Download,
  Upload,
  Search,
  Filter,
  Edit,
  Trash2,
  Mail,
  Phone,
  ArrowLeft,
} from "lucide-react";
import {
  Guest,
  getGuests,
  createGuest,
  updateGuest,
  deleteGuest,
  importGuestsFromCSV,
  exportGuestsToCSV,
  getGuestStats,
} from "@/lib/guestStorage";

export default function GuestManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, withPlusOne: 0, invited: 0, categories: {} });
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    category: "",
    plusOneAllowed: false,
    plusOneName: "",
    dietaryRestrictions: "",
    notes: "",
  });

  useEffect(() => {
    if (id) {
      loadGuests();
    }
  }, [id]);

  useEffect(() => {
    filterGuests();
  }, [guests, searchTerm, categoryFilter]);

  const loadGuests = async () => {
    if (!id) return;
    
    setLoading(true);
    const data = await getGuests(id);
    const guestStats = await getGuestStats(id);
    setGuests(data);
    setStats(guestStats);
    setLoading(false);
  };

  const filterGuests = () => {
    let filtered = [...guests];

    if (searchTerm) {
      filtered = filtered.filter(
        (guest) =>
          guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          guest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          guest.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((guest) => guest.category === categoryFilter);
    }

    setFilteredGuests(filtered);
  };

  const handleAddGuest = () => {
    setSelectedGuest(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      category: "",
      plusOneAllowed: false,
      plusOneName: "",
      dietaryRestrictions: "",
      notes: "",
    });
    setDialogOpen(true);
  };

  const handleEditGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setFormData({
      firstName: guest.firstName,
      lastName: guest.lastName,
      email: guest.email || "",
      phone: guest.phone || "",
      category: guest.category || "",
      plusOneAllowed: guest.plusOneAllowed,
      plusOneName: guest.plusOneName || "",
      dietaryRestrictions: guest.dietaryRestrictions || "",
      notes: guest.notes || "",
    });
    setDialogOpen(true);
  };

  const handleSaveGuest = async () => {
    if (!id || !formData.firstName || !formData.lastName) {
      toast({
        title: "Σφάλμα",
        description: "Παρακαλώ συμπληρώστε όνομα και επώνυμο",
        variant: "destructive",
      });
      return;
    }

    try {
      if (selectedGuest) {
        await updateGuest(selectedGuest.id, {
          ...formData,
          invitationId: id,
          invitationSent: selectedGuest.invitationSent,
        });
        toast({ title: "Επιτυχία", description: "Ο καλεσμένος ενημερώθηκε" });
      } else {
        await createGuest({
          ...formData,
          invitationId: id,
          invitationSent: false,
        });
        toast({ title: "Επιτυχία", description: "Ο καλεσμένος προστέθηκε" });
      }
      
      setDialogOpen(false);
      loadGuests();
    } catch (error) {
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία αποθήκευσης καλεσμένου",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGuest = async () => {
    if (!selectedGuest) return;

    try {
      await deleteGuest(selectedGuest.id);
      toast({ title: "Επιτυχία", description: "Ο καλεσμένος διαγράφηκε" });
      setDeleteDialogOpen(false);
      loadGuests();
    } catch (error) {
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία διαγραφής καλεσμένου",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const csv = exportGuestsToCSV(guests);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guests-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!id) return;
    
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const csvContent = e.target?.result as string;
      try {
        const result = await importGuestsFromCSV(id, csvContent);
        toast({
          title: "Εισαγωγή ολοκληρώθηκε",
          description: `${result.success} καλεσμένοι προστέθηκαν. ${result.errors.length} σφάλματα.`,
        });
        loadGuests();
      } catch (error) {
        toast({
          title: "Σφάλμα",
          description: "Αποτυχία εισαγωγής αρχείου",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const categories = Array.from(new Set(guests.map((g) => g.category).filter(Boolean)));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Φόρτωση...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/5 p-8">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Πίσω
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif mb-2">Διαχείριση Καλεσμένων</h1>
            <p className="text-muted-foreground">
              Διαχειριστείτε τη λίστα καλεσμένων σας
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" asChild>
              <label>
                <Upload className="mr-2 h-4 w-4" />
                Import CSV
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </Button>
            <Button onClick={handleAddGuest}>
              <UserPlus className="mr-2 h-4 w-4" />
              Προσθήκη Καλεσμένου
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Σύνολο</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Με +1</p>
                <p className="text-3xl font-bold">{stats.withPlusOne}</p>
              </div>
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Προσκλήσεις Σταλμένες</p>
                <p className="text-3xl font-bold">{stats.invited}</p>
              </div>
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Κατηγορίες</p>
                <p className="text-3xl font-bold">{Object.keys(stats.categories).length}</p>
              </div>
              <Filter className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Αναζήτηση καλεσμένων..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Κατηγορία" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Όλες οι κατηγορίες</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat!}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Guests Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Όνομα</TableHead>
                <TableHead>Επικοινωνία</TableHead>
                <TableHead>Κατηγορία</TableHead>
                <TableHead>+1</TableHead>
                <TableHead>Διατροφικοί Περιορισμοί</TableHead>
                <TableHead>Ενέργειες</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell className="font-medium">
                    {guest.firstName} {guest.lastName}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {guest.email && (
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          {guest.email}
                        </div>
                      )}
                      {guest.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1" />
                          {guest.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {guest.category && (
                      <Badge variant="secondary">{guest.category}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {guest.plusOneAllowed ? (
                      <Badge variant="default">
                        {guest.plusOneName || "Ναι"}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Όχι</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {guest.dietaryRestrictions || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditGuest(guest)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedGuest(guest);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Add/Edit Guest Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedGuest ? "Επεξεργασία" : "Προσθήκη"} Καλεσμένου
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Όνομα *</Label>
              <Input
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Επώνυμο *</Label>
              <Input
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Τηλέφωνο</Label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Κατηγορία</Label>
              <Input
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="π.χ. Οικογένεια, Φίλοι"
              />
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="plusOne"
                checked={formData.plusOneAllowed}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, plusOneAllowed: checked as boolean })
                }
              />
              <Label htmlFor="plusOne">Επιτρέπεται +1</Label>
            </div>
            {formData.plusOneAllowed && (
              <div className="col-span-2">
                <Label>Όνομα +1</Label>
                <Input
                  value={formData.plusOneName}
                  onChange={(e) =>
                    setFormData({ ...formData, plusOneName: e.target.value })
                  }
                />
              </div>
            )}
            <div className="col-span-2">
              <Label>Διατροφικοί Περιορισμοί</Label>
              <Input
                value={formData.dietaryRestrictions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dietaryRestrictions: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-span-2">
              <Label>Σημειώσεις</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Ακύρωση
            </Button>
            <Button onClick={handleSaveGuest}>Αποθήκευση</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Διαγραφή Καλεσμένου</AlertDialogTitle>
            <AlertDialogDescription>
              Είστε σίγουροι ότι θέλετε να διαγράψετε τον καλεσμένο{" "}
              {selectedGuest?.firstName} {selectedGuest?.lastName};
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGuest}>
              Διαγραφή
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

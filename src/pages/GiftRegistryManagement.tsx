import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Edit, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getGiftItems, createGiftItem, updateGiftItem, deleteGiftItem, GiftItem } from "@/lib/giftRegistryStorage";

export default function GiftRegistryManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [items, setItems] = useState<GiftItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GiftItem | null>(null);
  
  const [formData, setFormData] = useState({
    itemName: '',
    itemDescription: '',
    price: '',
    storeName: '',
    storeUrl: '',
    imageUrl: '',
    priority: 0,
  });

  const loadItems = async () => {
    if (!id) return;
    const data = await getGiftItems(id);
    setItems(data);
  };

  useEffect(() => {
    loadItems();
  }, [id]);

  const resetForm = () => {
    setFormData({
      itemName: '',
      itemDescription: '',
      price: '',
      storeName: '',
      storeUrl: '',
      imageUrl: '',
      priority: 0,
    });
    setEditingItem(null);
  };

  const handleOpenDialog = (item?: GiftItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        itemName: item.itemName,
        itemDescription: item.itemDescription || '',
        price: item.price?.toString() || '',
        storeName: item.storeName || '',
        storeUrl: item.storeUrl || '',
        imageUrl: item.imageUrl || '',
        priority: item.priority,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!id || !formData.itemName) return;

    try {
      const itemData = {
        invitationId: id,
        itemName: formData.itemName,
        itemDescription: formData.itemDescription || undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        storeName: formData.storeName || undefined,
        storeUrl: formData.storeUrl || undefined,
        imageUrl: formData.imageUrl || undefined,
        priority: formData.priority,
        purchased: false,
      };

      if (editingItem) {
        await updateGiftItem(editingItem.id, itemData);
        toast({ title: "Ενημερώθηκε το δώρο" });
      } else {
        await createGiftItem(itemData);
        toast({ title: "Προστέθηκε το δώρο" });
      }

      setIsDialogOpen(false);
      resetForm();
      loadItems();
    } catch (error) {
      toast({ title: "Σφάλμα", variant: "destructive" });
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await deleteGiftItem(itemId);
      toast({ title: "Διαγράφηκε το δώρο" });
      loadItems();
    } catch (error) {
      toast({ title: "Σφάλμα", variant: "destructive" });
    }
  };

  const priorityLabels: Record<number, { label: string; color: string }> = {
    2: { label: 'Υψηλή', color: 'bg-red-500' },
    1: { label: 'Μεσαία', color: 'bg-yellow-500' },
    0: { label: 'Κανονική', color: 'bg-green-500' },
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Πίσω
            </Button>
            <h1 className="text-3xl font-bold">Λίστα Δώρων</h1>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Προσθήκη Δώρου
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Επεξεργασία' : 'Προσθήκη'} Δώρου</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Όνομα Δώρου *</Label>
                  <Input
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    placeholder="π.χ. Σετ Πιάτων"
                  />
                </div>
                <div>
                  <Label>Περιγραφή</Label>
                  <Textarea
                    value={formData.itemDescription}
                    onChange={(e) => setFormData({ ...formData, itemDescription: e.target.value })}
                    placeholder="Περιγράψτε το δώρο..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Τιμή (€)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>Προτεραιότητα</Label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                    >
                      <option value={0}>Κανονική</option>
                      <option value={1}>Μεσαία</option>
                      <option value={2}>Υψηλή</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Κατάστημα</Label>
                  <Input
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    placeholder="π.χ. IKEA"
                  />
                </div>
                <div>
                  <Label>URL Καταστήματος</Label>
                  <Input
                    value={formData.storeUrl}
                    onChange={(e) => setFormData({ ...formData, storeUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label>URL Εικόνας</Label>
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <Button onClick={handleSave} className="w-full">
                  {editingItem ? 'Ενημέρωση' : 'Προσθήκη'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Συνολικά Δώρα</p>
                <p className="text-2xl font-bold">{items.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Αγορασμένα</p>
                <p className="text-2xl font-bold text-green-600">
                  {items.filter(i => i.purchased).length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Διαθέσιμα</p>
                <p className="text-2xl font-bold text-blue-600">
                  {items.filter(i => !i.purchased).length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Συνολική Αξία</p>
                <p className="text-2xl font-bold">
                  €{items.reduce((sum, i) => sum + (i.price || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              {item.imageUrl && (
                <div className="w-full h-48 bg-muted overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.itemName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{item.itemName}</h3>
                    {item.purchased && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 mb-2">
                        Αγορασμένο
                      </Badge>
                    )}
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full ${priorityLabels[item.priority].color}`}
                    title={priorityLabels[item.priority].label}
                  />
                </div>

                {item.itemDescription && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {item.itemDescription}
                  </p>
                )}

                {item.price && (
                  <p className="text-lg font-bold text-primary mb-3">
                    €{item.price.toFixed(2)}
                  </p>
                )}

                {item.storeName && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <span>{item.storeName}</span>
                    {item.storeUrl && (
                      <a
                        href={item.storeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}

                {item.purchased && item.purchasedBy && (
                  <p className="text-xs text-muted-foreground mb-3">
                    Αγοράστηκε από: {item.purchasedBy}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(item)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Επεξ.
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Δεν υπάρχουν δώρα. Προσθέστε το πρώτο σας!</p>
          </div>
        )}
      </div>
    </div>
  );
}

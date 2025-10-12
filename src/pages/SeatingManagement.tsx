import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ArrowLeft, Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getTablesWithGuests, createTable, updateTable, deleteTable, assignGuestToTable, removeGuestFromTable, TableWithGuests } from "@/lib/seatingStorage";
import { getGuests, Guest } from "@/lib/guestStorage";

const ItemTypes = {
  GUEST: 'guest',
};

interface DraggableGuestProps {
  guest: Guest;
}

function DraggableGuest({ guest }: DraggableGuestProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.GUEST,
    item: { guestId: guest.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-2 mb-2 bg-card border rounded-md cursor-move hover:bg-accent transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <p className="text-sm font-medium">{guest.firstName} {guest.lastName}</p>
      {guest.plusOneName && <p className="text-xs text-muted-foreground">+1: {guest.plusOneName}</p>}
    </div>
  );
}

interface TableCardProps {
  table: TableWithGuests;
  onUpdate: () => void;
  onDelete: (id: string) => void;
}

function TableCard({ table, onUpdate, onDelete }: TableCardProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [tableName, setTableName] = useState(table.tableName || '');
  const [capacity, setCapacity] = useState(table.capacity);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.GUEST,
    drop: async (item: { guestId: string }) => {
      try {
        await assignGuestToTable(item.guestId, table.id);
        toast({ title: "Επιτυχής τοποθέτηση" });
        onUpdate();
      } catch (error) {
        toast({ title: "Σφάλμα", description: "Αποτυχία τοποθέτησης καλεσμένου", variant: "destructive" });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleRemoveGuest = async (guestId: string) => {
    try {
      await removeGuestFromTable(guestId);
      toast({ title: "Αφαιρέθηκε ο καλεσμένος" });
      onUpdate();
    } catch (error) {
      toast({ title: "Σφάλμα", variant: "destructive" });
    }
  };

  const handleSave = async () => {
    try {
      await updateTable(table.id, { tableName, capacity });
      toast({ title: "Ενημερώθηκε το τραπέζι" });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      toast({ title: "Σφάλμα", variant: "destructive" });
    }
  };

  const currentGuests = table.guests.length + table.guests.filter(g => g.plusOne).length;

  return (
    <Card
      ref={drop}
      className={`p-4 transition-all ${isOver ? 'border-primary bg-accent' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        {isEditing ? (
          <div className="flex-1 space-y-2">
            <Input
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="Όνομα τραπεζιού"
              className="mb-2"
            />
            <Input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="mb-2"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>Αποθήκευση</Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Ακύρωση</Button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h3 className="font-semibold">Τραπέζι {table.tableNumber}</h3>
              {table.tableName && <p className="text-sm text-muted-foreground">{table.tableName}</p>}
              <p className="text-xs text-muted-foreground mt-1">
                <Users className="inline w-3 h-3 mr-1" />
                {currentGuests} / {table.capacity}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>Επεξ.</Button>
              <Button size="sm" variant="ghost" onClick={() => onDelete(table.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>
      
      <div className="space-y-2">
        {table.guests.map((guest) => (
          <div key={guest.id} className="p-2 bg-accent rounded-md text-sm group relative">
            <p className="font-medium">{guest.name}</p>
            {guest.plusOne && <p className="text-xs text-muted-foreground">+1: {guest.plusOne}</p>}
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
              onClick={() => handleRemoveGuest(guest.id)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function SeatingManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tables, setTables] = useState<TableWithGuests[]>([]);
  const [unassignedGuests, setUnassignedGuests] = useState<Guest[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState(1);
  const [newTableName, setNewTableName] = useState('');
  const [newCapacity, setNewCapacity] = useState(8);

  const loadData = async () => {
    if (!id) return;
    
    const [tablesData, guestsData] = await Promise.all([
      getTablesWithGuests(id),
      getGuests(id)
    ]);
    
    setTables(tablesData);
    
    const assignedGuestIds = new Set(tablesData.flatMap(t => t.guests.map(g => g.id)));
    const unassigned = guestsData.filter(g => !assignedGuestIds.has(g.id));
    setUnassignedGuests(unassigned);
    
    const maxTableNumber = tablesData.reduce((max, t) => Math.max(max, t.tableNumber), 0);
    setNewTableNumber(maxTableNumber + 1);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAddTable = async () => {
    if (!id) return;
    
    try {
      await createTable({
        invitationId: id,
        tableNumber: newTableNumber,
        tableName: newTableName,
        capacity: newCapacity,
      });
      
      toast({ title: "Προστέθηκε το τραπέζι" });
      setIsAddDialogOpen(false);
      setNewTableName('');
      setNewCapacity(8);
      loadData();
    } catch (error) {
      toast({ title: "Σφάλμα", variant: "destructive" });
    }
  };

  const handleDeleteTable = async (tableId: string) => {
    try {
      await deleteTable(tableId);
      toast({ title: "Διαγράφηκε το τραπέζι" });
      loadData();
    } catch (error) {
      toast({ title: "Σφάλμα", variant: "destructive" });
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Πίσω
              </Button>
              <h1 className="text-3xl font-bold">Διάταξη Τραπεζιών</h1>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Νέο Τραπέζι
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Προσθήκη Τραπεζιού</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Αριθμός Τραπεζιού</Label>
                    <Input
                      type="number"
                      value={newTableNumber}
                      onChange={(e) => setNewTableNumber(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Όνομα (προαιρετικό)</Label>
                    <Input
                      value={newTableName}
                      onChange={(e) => setNewTableName(e.target.value)}
                      placeholder="π.χ. Οικογένεια, Φίλοι"
                    />
                  </div>
                  <div>
                    <Label>Χωρητικότητα</Label>
                    <Input
                      type="number"
                      value={newCapacity}
                      onChange={(e) => setNewCapacity(Number(e.target.value))}
                    />
                  </div>
                  <Button onClick={handleAddTable} className="w-full">
                    Προσθήκη
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card className="p-4 sticky top-4">
                <h2 className="font-semibold mb-4">Μη Τοποθετημένοι ({unassignedGuests.length})</h2>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {unassignedGuests.map((guest) => (
                    <DraggableGuest key={guest.id} guest={guest} />
                  ))}
                  {unassignedGuests.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Όλοι οι καλεσμένοι έχουν τοποθετηθεί
                    </p>
                  )}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {tables.map((table) => (
                  <TableCard
                    key={table.id}
                    table={table}
                    onUpdate={loadData}
                    onDelete={handleDeleteTable}
                  />
                ))}
                {tables.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">Δεν υπάρχουν τραπέζια. Προσθέστε το πρώτο σας!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

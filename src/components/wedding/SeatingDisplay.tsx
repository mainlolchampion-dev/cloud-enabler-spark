import { useEffect, useState } from "react";
import { getTablesWithGuests, TableWithGuests } from "@/lib/seatingStorage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface SeatingDisplayProps {
  invitationId: string;
}

export const SeatingDisplay = ({ invitationId }: SeatingDisplayProps) => {
  const [tables, setTables] = useState<TableWithGuests[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const tablesData = await getTablesWithGuests(invitationId);
        // Only show tables that have guests assigned
        setTables(tablesData.filter(table => table.guests.length > 0));
      } catch (error) {
        console.error('Error fetching tables:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, [invitationId]);

  if (loading) {
    return null;
  }

  // Always show the section, even if empty
  return (
    <section>
      <h2 className="text-2xl font-semibold font-serif text-center mb-6">
        Διάταξη Τραπεζιών
      </h2>
      {tables.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Η διάταξη των τραπεζιών θα ανακοινωθεί σύντομα.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <Card key={table.id} className="overflow-hidden">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center justify-between">
                <span>
                  Τραπέζι {table.tableNumber}
                  {table.tableName && ` - ${table.tableName}`}
                </span>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{table.guests.length}/{table.capacity}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                {table.guests.map((guest) => (
                  <li key={guest.id} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm">
                      {guest.name}
                      {guest.plusOne && (
                        <span className="text-muted-foreground"> & {guest.plusOne}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
        </div>
      )}
    </section>
  );
};

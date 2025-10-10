import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";

interface Row {
  id: string;
  col1: string;
  col2?: string;
}

interface RepeatableTableProps {
  title: string;
  col1Label: string;
  col2Label?: string;
  rows: Row[];
  onRowsChange: (rows: Row[]) => void;
  col2Type?: "text" | "image";
  onImageChange?: (id: string, url: string) => void;
}

export function RepeatableTable({
  title,
  col1Label,
  col2Label,
  rows,
  onRowsChange,
  col2Type = "text",
  onImageChange,
}: RepeatableTableProps) {
  const addRow = () => {
    const newRow: Row = {
      id: Date.now().toString(),
      col1: "",
      col2: "",
    };
    onRowsChange([...rows, newRow]);
  };

  const removeRow = (id: string) => {
    onRowsChange(rows.filter((row) => row.id !== id));
  };

  const updateRow = (id: string, field: "col1" | "col2", value: string) => {
    onRowsChange(
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageChange) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(id, reader.result as string);
        updateRow(id, "col2", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">{title}</h3>
        <Button onClick={addRow} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Προσθήκη
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">{col1Label}</th>
              {col2Label && (
                <th className="px-4 py-2 text-left text-sm font-medium">{col2Label}</th>
              )}
              <th className="px-4 py-2 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-4 py-2">
                  <Input
                    value={row.col1}
                    onChange={(e) => updateRow(row.id, "col1", e.target.value)}
                    placeholder={col1Label}
                  />
                </td>
                {col2Label && (
                  <td className="px-4 py-2">
                    {col2Type === "text" ? (
                      <Input
                        value={row.col2 || ""}
                        onChange={(e) => updateRow(row.id, "col2", e.target.value)}
                        placeholder={col2Label}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          className="text-sm"
                          onChange={(e) => handleImageUpload(row.id, e)}
                        />
                      </div>
                    )}
                  </td>
                )}
                <td className="px-4 py-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRow(row.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

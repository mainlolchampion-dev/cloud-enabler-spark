import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Loader2, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { uploadImage } from "@/lib/imageUpload";
import { toast } from "sonner";

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
  const [uploadingId, setUploadingId] = useState<string | null>(null);

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

  const handleImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingId(id);
      const url = await uploadImage(file, 'invitations');
      updateRow(id, "col2", url);
      if (onImageChange) {
        onImageChange(id, url);
      }
      toast.success("Η φωτογραφία ανέβηκε επιτυχώς!");
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.message || "Σφάλμα κατά το ανέβασμα της φωτογραφίας");
    } finally {
      setUploadingId(null);
      e.target.value = '';
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
                        {row.col2 ? (
                          <div className="flex items-center gap-2">
                            <img 
                              src={row.col2} 
                              alt="Preview" 
                              className="w-12 h-12 object-cover rounded"
                            />
                            <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                              {row.col2.split('/').pop()}
                            </span>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={uploadingId === row.id}
                            onClick={() => document.getElementById(`file-${row.id}`)?.click()}
                          >
                            {uploadingId === row.id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Ανέβασμα...
                              </>
                            ) : (
                              <>
                                <ImageIcon className="w-4 h-4 mr-2" />
                                Επιλογή αρχείου
                              </>
                            )}
                          </Button>
                        )}
                        <input
                          id={`file-${row.id}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(row.id, e)}
                          disabled={uploadingId === row.id}
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

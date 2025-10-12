import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import { downloadICS, getGoogleCalendarUrl } from "@/lib/calendarUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AddToCalendarProps {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  url?: string;
}

export const AddToCalendar = ({
  title,
  description,
  location,
  startDate,
  endDate,
  url,
}: AddToCalendarProps) => {
  const event = { title, description, location, startDate, endDate, url };

  const handleDownloadICS = () => {
    downloadICS(event, `${title.toLowerCase().replace(/\s+/g, '-')}.ics`);
  };

  const handleGoogleCalendar = () => {
    window.open(getGoogleCalendarUrl(event), '_blank');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calendar className="w-4 h-4" />
          Προσθήκη στο Ημερολόγιο
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleGoogleCalendar}>
          <Calendar className="w-4 h-4 mr-2" />
          Google Calendar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadICS}>
          <Download className="w-4 h-4 mr-2" />
          Λήψη .ics
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

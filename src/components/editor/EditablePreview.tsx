import { useState } from 'react';
import { PremiumTemplateConfig } from '@/config/premiumTemplates';
import { Calendar, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface EditablePreviewProps {
  template: PremiumTemplateConfig;
  onUpdate: (updates: Partial<PremiumTemplateConfig>) => void;
  previewMode: boolean;
}

export function EditablePreview({ template, onUpdate, previewMode }: EditablePreviewProps) {
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleInlineEdit = (field: keyof PremiumTemplateConfig, value: string) => {
    onUpdate({ [field]: value });
  };

  const EditableText = ({ 
    field, 
    value, 
    className,
    multiline = false 
  }: { 
    field: keyof PremiumTemplateConfig; 
    value: string; 
    className?: string;
    multiline?: boolean;
  }) => {
    const isEditing = editingField === field;
    
    if (previewMode || !isEditing) {
      return (
        <div
          className={`${className} ${!previewMode ? 'cursor-pointer hover:ring-2 hover:ring-primary/50 rounded px-2 -mx-2 transition-all' : ''}`}
          onClick={() => !previewMode && setEditingField(field)}
          suppressContentEditableWarning
        >
          {value || 'Click to edit'}
        </div>
      );
    }

    return multiline ? (
      <textarea
        className={`${className} bg-white/10 backdrop-blur-sm border border-primary rounded px-2 w-full resize-none`}
        value={value}
        onChange={(e) => handleInlineEdit(field, e.target.value)}
        onBlur={() => setEditingField(null)}
        autoFocus
        rows={3}
      />
    ) : (
      <input
        type="text"
        className={`${className} bg-white/10 backdrop-blur-sm border border-primary rounded px-2`}
        value={value}
        onChange={(e) => handleInlineEdit(field, e.target.value)}
        onBlur={() => setEditingField(null)}
        autoFocus
      />
    );
  };

  return (
    <Card className="overflow-hidden shadow-2xl">
      {/* Hero Section */}
      <div 
        className="relative h-[500px] flex flex-col items-center justify-center text-white p-8"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${template.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Category Badge */}
        <div 
          className="absolute top-6 right-6 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md border"
          style={{
            backgroundColor: `${template.accentColor}33`,
            borderColor: template.accentColor,
            color: '#fff'
          }}
        >
          {template.category}
        </div>

        {/* Main Content */}
        <div className="text-center space-y-6 max-w-2xl">
          <EditableText
            field="title"
            value={template.title}
            className="text-5xl font-serif font-bold drop-shadow-lg"
          />
          
          {template.subtitle && (
            <EditableText
              field="subtitle"
              value={template.subtitle}
              className="text-xl font-light tracking-wide drop-shadow"
            />
          )}

          <EditableText
            field="names"
            value={template.names}
            className="text-3xl font-serif italic drop-shadow-lg mt-8"
          />

          {/* Date & Venue */}
          {(template.date || template.venue) && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 text-sm">
              {template.date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <EditableText
                    field="date"
                    value={new Date(template.date).toLocaleDateString('el-GR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                    className="font-medium"
                  />
                </div>
              )}
              {template.venue && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <EditableText
                    field="venue"
                    value={template.venue}
                    className="font-medium"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Accent decoration */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ backgroundColor: template.accentColor }}
        />
      </div>

      {/* Description Section */}
      {template.description && (
        <div className="p-12 bg-white">
          <div className="max-w-2xl mx-auto">
            <EditableText
              field="description"
              value={template.description}
              className="text-lg text-muted-foreground leading-relaxed text-center"
              multiline
            />
          </div>
        </div>
      )}

      {/* Details Section */}
      <div 
        className="p-12 text-white"
        style={{
          background: `linear-gradient(135deg, ${template.accentColor} 0%, ${template.secondaryColor} 100%)`
        }}
      >
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h3 className="text-2xl font-serif font-bold">Event Details</h3>
          <p className="text-white/90">
            Join us for a {template.mood.toLowerCase()} celebration
          </p>
          
          {template.date && (
            <div className="pt-6">
              <div className="inline-block px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <p className="text-sm uppercase tracking-wide mb-1">Save the Date</p>
                <p className="text-2xl font-bold">
                  {new Date(template.date).toLocaleDateString('el-GR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Theme indicator */}
      <div className="p-6 bg-muted/50 text-center text-sm text-muted-foreground">
        <p>Theme: <span className="font-medium capitalize">{template.theme}</span> • Mood: {template.mood}</p>
      </div>
    </Card>
  );
}

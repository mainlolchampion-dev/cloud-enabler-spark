import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Type, ImageIcon, Clock, Palette, Settings, Upload } from 'lucide-react';
import { PremiumTemplateConfig } from '@/config/premiumTemplates';
import { toast } from 'sonner';

interface EditorSidebarProps {
  template: PremiumTemplateConfig;
  onUpdate: (updates: Partial<PremiumTemplateConfig>) => void;
}

export function EditorSidebar({ template, onUpdate }: EditorSidebarProps) {
  const [countdownEnabled, setCountdownEnabled] = useState(!!template.date);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      onUpdate({ backgroundImage: imageUrl });
      toast.success('Image uploaded!');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-[400px] border-r bg-background overflow-auto">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-12 bg-muted/50">
          <TabsTrigger value="content" className="gap-2">
            <Type className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="images" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            Images
          </TabsTrigger>
          <TabsTrigger value="countdown" className="gap-2">
            <Clock className="h-4 w-4" />
            Timer
          </TabsTrigger>
          <TabsTrigger value="colors" className="gap-2">
            <Palette className="h-4 w-4" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography" className="gap-2">
            <Type className="h-4 w-4" />
            Fonts
          </TabsTrigger>
          <TabsTrigger value="advanced" className="gap-2">
            <Settings className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* CONTENT TAB */}
        <TabsContent value="content" className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={template.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Enter invitation title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={template.subtitle || ''}
              onChange={(e) => onUpdate({ subtitle: e.target.value })}
              placeholder="Enter subtitle (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="names">Names</Label>
            <Input
              id="names"
              value={template.names}
              onChange={(e) => onUpdate({ names: e.target.value })}
              placeholder="e.g., John & Jane"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={template.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Enter event description"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Event Date</Label>
            <Input
              id="date"
              type="date"
              value={template.date || ''}
              onChange={(e) => onUpdate({ date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              value={template.venue || ''}
              onChange={(e) => onUpdate({ venue: e.target.value })}
              placeholder="Enter venue name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Event Category</Label>
            <Select
              value={template.category}
              onValueChange={(value: any) => onUpdate({ category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Wedding">Wedding</SelectItem>
                <SelectItem value="Baptism">Baptism</SelectItem>
                <SelectItem value="Party">Party</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mood">Mood</Label>
            <Input
              id="mood"
              value={template.mood}
              onChange={(e) => onUpdate({ mood: e.target.value })}
              placeholder="e.g., Elegant & Romantic"
            />
          </div>
        </TabsContent>

        {/* IMAGES TAB */}
        <TabsContent value="images" className="p-6 space-y-6">
          <div className="space-y-2">
            <Label>Background Image</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center space-y-3">
              {template.backgroundImage && (
                <img
                  src={template.backgroundImage}
                  alt="Background preview"
                  className="w-full h-32 object-cover rounded"
                />
              )}
              <Button variant="outline" className="w-full" asChild>
                <label htmlFor="background-upload" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                  <input
                    id="background-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-url">Or Use Image URL</Label>
            <Input
              id="image-url"
              value={template.backgroundImage}
              onChange={(e) => onUpdate({ backgroundImage: e.target.value })}
              placeholder="https://images.unsplash.com/..."
            />
            <p className="text-xs text-muted-foreground">
              Try <a href="https://unsplash.com" target="_blank" rel="noopener" className="underline">Unsplash</a> for free high-quality images
            </p>
          </div>
        </TabsContent>

        {/* COUNTDOWN TAB */}
        <TabsContent value="countdown" className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="countdown-enabled">Enable Countdown Timer</Label>
            <Switch
              id="countdown-enabled"
              checked={countdownEnabled}
              onCheckedChange={setCountdownEnabled}
            />
          </div>

          {countdownEnabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="countdown-date">Target Date</Label>
                <Input
                  id="countdown-date"
                  type="date"
                  value={template.date || ''}
                  onChange={(e) => onUpdate({ date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Countdown Style</Label>
                <Select defaultValue="classic">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </TabsContent>

        {/* COLORS TAB */}
        <TabsContent value="colors" className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="accent-color">Accent Color</Label>
            <div className="flex gap-2">
              <Input
                id="accent-color"
                type="color"
                value={template.accentColor}
                onChange={(e) => onUpdate({ accentColor: e.target.value })}
                className="w-20 h-10"
              />
              <Input
                value={template.accentColor}
                onChange={(e) => onUpdate({ accentColor: e.target.value })}
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondary-color">Secondary Color</Label>
            <div className="flex gap-2">
              <Input
                id="secondary-color"
                type="color"
                value={template.secondaryColor}
                onChange={(e) => onUpdate({ secondaryColor: e.target.value })}
                className="w-20 h-10"
              />
              <Input
                value={template.secondaryColor}
                onChange={(e) => onUpdate({ secondaryColor: e.target.value })}
                placeholder="#FFFFFF"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Background Overlay Opacity</Label>
            <Slider
              defaultValue={[50]}
              max={100}
              step={5}
              className="py-4"
            />
          </div>
        </TabsContent>

        {/* TYPOGRAPHY TAB */}
        <TabsContent value="typography" className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="primary-font">Primary Font</Label>
            <Select defaultValue="playfair">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="playfair">Playfair Display (Elegant)</SelectItem>
                <SelectItem value="montserrat">Montserrat (Modern)</SelectItem>
                <SelectItem value="great-vibes">Great Vibes (Script)</SelectItem>
                <SelectItem value="cinzel">Cinzel (Luxury)</SelectItem>
                <SelectItem value="cormorant">Cormorant Garamond (Serif)</SelectItem>
                <SelectItem value="dancing">Dancing Script (Playful)</SelectItem>
                <SelectItem value="libre">Libre Baskerville (Classic)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondary-font">Secondary Font</Label>
            <Select defaultValue="montserrat">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="montserrat">Montserrat</SelectItem>
                <SelectItem value="raleway">Raleway</SelectItem>
                <SelectItem value="libre">Libre Baskerville</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Title Font Size</Label>
            <Slider
              defaultValue={[48]}
              min={32}
              max={72}
              step={4}
              className="py-4"
            />
            <p className="text-xs text-muted-foreground text-center">48px</p>
          </div>

          <div className="space-y-2">
            <Label>Body Font Size</Label>
            <Slider
              defaultValue={[16]}
              min={12}
              max={24}
              step={1}
              className="py-4"
            />
            <p className="text-xs text-muted-foreground text-center">16px</p>
          </div>

          <div className="space-y-2">
            <Label>Line Height</Label>
            <Slider
              defaultValue={[150]}
              min={100}
              max={200}
              step={10}
              className="py-4"
            />
            <p className="text-xs text-muted-foreground text-center">150%</p>
          </div>

          <div className="space-y-2">
            <Label>Letter Spacing</Label>
            <Slider
              defaultValue={[0]}
              min={-2}
              max={4}
              step={0.5}
              className="py-4"
            />
            <p className="text-xs text-muted-foreground text-center">0px</p>
          </div>
        </TabsContent>

        {/* ADVANCED TAB */}
        <TabsContent value="advanced" className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="theme">Template Theme</Label>
            <Select
              value={template.theme}
              onValueChange={(value: any) => onUpdate({ theme: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="elegant">Elegant</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="romantic">Romantic</SelectItem>
                <SelectItem value="royal">Royal</SelectItem>
                <SelectItem value="fun">Fun</SelectItem>
                <SelectItem value="cute">Cute</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Animation Style</Label>
            <Select defaultValue="fade">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fade">Fade</SelectItem>
                <SelectItem value="slide">Slide</SelectItem>
                <SelectItem value="zoom">Zoom</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Border Radius</Label>
            <Slider
              defaultValue={[8]}
              max={32}
              step={4}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <Label>Shadow Intensity</Label>
            <Slider
              defaultValue={[50]}
              max={100}
              step={10}
              className="py-4"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

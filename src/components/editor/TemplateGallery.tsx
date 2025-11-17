import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { premiumTemplates, PremiumTemplateConfig } from '@/config/premiumTemplates';
import { Search, Eye, Edit, Heart, Star, Sparkles } from 'lucide-react';

interface TemplateGalleryProps {
  onSelectTemplate: (template: PremiumTemplateConfig) => void;
}

type CategoryFilter = 'all' | 'Wedding' | 'Baptism' | 'Party';

export function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [previewTemplate, setPreviewTemplate] = useState<PremiumTemplateConfig | null>(null);

  // Filter templates
  const filteredTemplates = premiumTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.mood.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.theme.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get theme icon
  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'luxury': return '💎';
      case 'elegant': return '✨';
      case 'modern': return '🎨';
      case 'romantic': return '💕';
      case 'royal': return '👑';
      case 'fun': return '🎉';
      case 'cute': return '🐰';
      default: return '⭐';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            <Star className="h-3 w-3 mr-1" />
            60 Premium Templates
          </Badge>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Choose Your Perfect Design
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Επιλέξτε από 60 premium templates και προσαρμόστε το στον δικό σας μοναδικό στυλ
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search templates by name, mood, or theme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Tabs */}
          <Tabs value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as CategoryFilter)} className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 h-12">
              <TabsTrigger value="all" className="gap-2">
                <Sparkles className="h-4 w-4" />
                All ({premiumTemplates.length})
              </TabsTrigger>
              <TabsTrigger value="Wedding" className="gap-2">
                <Heart className="h-4 w-4" />
                Wedding (20)
              </TabsTrigger>
              <TabsTrigger value="Baptism" className="gap-2">
                ✨ Baptism (20)
              </TabsTrigger>
              <TabsTrigger value="Party" className="gap-2">
                🎉 Party (20)
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Results count */}
        <p className="text-center text-sm text-muted-foreground mb-6">
          Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
        </p>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id} 
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={template.backgroundImage}
                  alt={template.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Category Badge */}
                <Badge 
                  className="absolute top-3 right-3"
                  style={{
                    backgroundColor: `${template.accentColor}22`,
                    borderColor: template.accentColor,
                    color: '#fff'
                  }}
                >
                  {template.category}
                </Badge>

                {/* Theme icon */}
                <div className="absolute top-3 left-3 text-2xl">
                  {getThemeIcon(template.theme)}
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setPreviewTemplate(template)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onSelectTemplate(template)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Customize
                  </Button>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{template.mood}</p>
                
                {/* Color palette */}
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: template.accentColor }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: template.secondaryColor }}
                  />
                  <span className="text-xs text-muted-foreground ml-auto capitalize">
                    {template.theme}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {template.price}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => onSelectTemplate(template)}
                    className="text-xs"
                  >
                    Get Started →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{previewTemplate?.name}</span>
              <Badge>{previewTemplate?.category}</Badge>
            </DialogTitle>
          </DialogHeader>
          
          {previewTemplate && (
            <div className="space-y-4">
              {/* Preview Image */}
              <div className="relative h-96 rounded-lg overflow-hidden">
                <img
                  src={previewTemplate.backgroundImage}
                  alt={previewTemplate.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col items-center justify-center text-white p-8">
                  <h2 className="text-4xl font-serif font-bold mb-2">{previewTemplate.title}</h2>
                  {previewTemplate.subtitle && (
                    <p className="text-xl mb-4">{previewTemplate.subtitle}</p>
                  )}
                  <p className="text-2xl font-serif italic">{previewTemplate.names}</p>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Mood:</span>
                  <p className="font-medium">{previewTemplate.mood}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Theme:</span>
                  <p className="font-medium capitalize">{previewTemplate.theme}</p>
                </div>
                {previewTemplate.description && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Description:</span>
                    <p className="font-medium">{previewTemplate.description}</p>
                  </div>
                )}
              </div>

              {/* Color Palette */}
              <div>
                <span className="text-sm text-muted-foreground mb-2 block">Color Palette:</span>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-12 h-12 rounded-lg border-2 border-border shadow-sm"
                      style={{ backgroundColor: previewTemplate.accentColor }}
                    />
                    <span className="text-xs">{previewTemplate.accentColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-12 h-12 rounded-lg border-2 border-border shadow-sm"
                      style={{ backgroundColor: previewTemplate.secondaryColor }}
                    />
                    <span className="text-xs">{previewTemplate.secondaryColor}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button 
                  className="flex-1" 
                  onClick={() => {
                    onSelectTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Customize This Template
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setPreviewTemplate(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

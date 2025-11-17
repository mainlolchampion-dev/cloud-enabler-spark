import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Undo, Redo, Eye, Save, Download, Monitor, Tablet, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { EditorSidebar } from './EditorSidebar';
import { EditablePreview } from './EditablePreview';
import { PremiumTemplateConfig } from '@/config/premiumTemplates';

interface CustomizationEditorProps {
  template: PremiumTemplateConfig;
  onClose: () => void;
  onSave: (customizedTemplate: PremiumTemplateConfig) => void;
}

type ViewMode = 'desktop' | 'tablet' | 'mobile';

interface HistoryState {
  past: PremiumTemplateConfig[];
  present: PremiumTemplateConfig;
  future: PremiumTemplateConfig[];
}

export function CustomizationEditor({ template, onClose, onSave }: CustomizationEditorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [previewMode, setPreviewMode] = useState(false);
  
  // History management for undo/redo
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: template,
    future: []
  });

  const currentTemplate = history.present;

  // Update template with undo/redo support
  const updateTemplate = useCallback((updates: Partial<PremiumTemplateConfig>) => {
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: { ...prev.present, ...updates },
      future: []
    }));
    toast.success('Updated! ✨');
  }, []);

  // Undo
  const handleUndo = useCallback(() => {
    if (history.past.length === 0) return;
    
    setHistory(prev => ({
      past: prev.past.slice(0, -1),
      present: prev.past[prev.past.length - 1],
      future: [prev.present, ...prev.future]
    }));
    toast.info('Undo');
  }, [history.past.length]);

  // Redo
  const handleRedo = useCallback(() => {
    if (history.future.length === 0) return;
    
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: prev.future[0],
      future: prev.future.slice(1)
    }));
    toast.info('Redo');
  }, [history.future.length]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        handleRedo();
      } else {
        handleUndo();
      }
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault();
      handleRedo();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  }, [handleUndo, handleRedo]);

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleSave = () => {
    onSave(currentTemplate);
    toast.success('🎉 Template Saved!');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(currentTemplate, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${currentTemplate.id}-customized.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('💾 Exported Successfully!');
  };

  const getViewModeWidth = () => {
    switch (viewMode) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      default:
        return 'w-full';
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-background"
      >
        {/* Top Toolbar */}
        <motion.header 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3, type: "spring" }}
          className="h-16 border-b bg-white/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-10"
        >
        <div className="flex items-center gap-4">
          <div>
            <h2 className="font-semibold text-lg">{currentTemplate.name}</h2>
            <span className="text-xs text-muted-foreground">
              {currentTemplate.category} • {currentTemplate.theme}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleUndo}
            disabled={history.past.length === 0}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRedo}
            disabled={history.future.length === 0}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </Button>

          <div className="h-6 w-px bg-border mx-2" />

          {/* View Mode */}
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'desktop' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('desktop')}
              className="h-8 w-8"
              title="Desktop View"
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'tablet' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('tablet')}
              className="h-8 w-8"
              title="Tablet View"
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('mobile')}
              className="h-8 w-8"
              title="Mobile View"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>

          <div className="h-6 w-px bg-border mx-2" />

          {/* Preview Mode */}
          <Button
            variant={previewMode ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setPreviewMode(!previewMode)}
            title="Preview Mode"
          >
            <Eye className="h-4 w-4" />
          </Button>

          {/* Save */}
          <Button onClick={handleSave} title="Save (Ctrl+S)">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>

          {/* Export */}
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          {/* Close */}
          <Button variant="ghost" size="icon" onClick={onClose} title="Close (Esc)">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </motion.header>

      {/* Main Editor Layout */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar */}
        <AnimatePresence>
          {!previewMode && (
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <EditorSidebar
                template={currentTemplate}
                onUpdate={updateTemplate}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Canvas - Preview */}
        <motion.div 
          className="flex-1 overflow-auto bg-muted/30 p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <motion.div 
            className={`mx-auto transition-all duration-300 ${getViewModeWidth()}`}
            animate={{ 
              maxWidth: viewMode === 'mobile' ? '375px' : 
                       viewMode === 'tablet' ? '768px' : '100%' 
            }}
            transition={{ duration: 0.3 }}
          >
            <EditablePreview
              template={currentTemplate}
              onUpdate={updateTemplate}
              previewMode={previewMode}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Toast hint */}
      <AnimatePresence>
        {!previewMode && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border shadow-sm"
          >
            💡 Click any text to edit • Ctrl+Z to undo • Ctrl+S to save
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    </AnimatePresence>
  );
}

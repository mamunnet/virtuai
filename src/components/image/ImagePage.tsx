import { useState, useEffect } from 'react';
import { 
  ImageDown, ImagePlus, Upload, Sparkles, Image as ImageIcon, X,
  AlertCircle, RefreshCw, Clock, Trash2, Maximize2, Download
} from 'lucide-react';
import { 
  generateImage, analyzeImage, downloadImage, 
  getImageHistory, saveToImageHistory, clearImageHistory,
  type GeneratedImage 
} from '../../services/image';

type ImageMode = 'text-to-image' | 'image-to-text';

interface PreviewImage {
  url: string;
  index: number;
  prompt: string;
}

export function ImagePage() {
  const [mode, setMode] = useState<ImageMode>('text-to-image');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [imageHistory, setImageHistory] = useState<GeneratedImage[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [previewImage, setPreviewImage] = useState<PreviewImage | null>(null);

  useEffect(() => {
    setImageHistory(getImageHistory());
  }, []);

  const resetState = () => {
    setResults([]);
    setError(null);
    setProgress(0);
    setStatus('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      resetState();
    }
  };

  const handleDownload = async (url: string, index: number) => {
    try {
      await downloadImage(url, `generated-image-${index + 1}.png`);
    } catch (error) {
      console.error('Download error:', error);
      setError('Failed to download image');
    }
  };

  const handleClearHistory = () => {
    clearImageHistory();
    setImageHistory([]);
  };

  const handleSubmit = async () => {
    if (!prompt.trim() && mode === 'text-to-image') {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    resetState();
    
    try {
      if (mode === 'text-to-image') {
        const imageUrls = await generateImage(prompt, (progress, status) => {
          setProgress(progress);
          setStatus(status);
        });
        setResults(imageUrls);
        setImageHistory(saveToImageHistory(imageUrls, prompt));
      } else if (selectedImage) {
        setStatus('Analyzing image...');
        const analysis = await analyzeImage(selectedImage);
        setResults([analysis]);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    handleSubmit();
  };

  const handleImageClick = (url: string, index: number, prompt: string) => {
    setPreviewImage({ url, index, prompt });
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-primary" />
          <h1 className="text-lg font-semibold">AI Image Tools</h1>
        </div>
        {mode === 'text-to-image' && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 rounded-lg hover:bg-secondary/20 transition-colors"
            title="View History"
          >
            <Clock className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Mode Selection */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => {
            setMode('text-to-image');
            setResults([]);
            setSelectedImage(null);
            setPreviewUrl(null);
          }}
          className={`p-4 rounded-xl border border-border/40 flex flex-col items-center gap-2 transition-all duration-200
            ${mode === 'text-to-image' 
              ? 'bg-primary/10 border-primary/50' 
              : 'bg-secondary/10 hover:bg-secondary/20'}`}
        >
          <ImagePlus className={`w-5 h-5 ${mode === 'text-to-image' ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className={`text-sm font-medium ${mode === 'text-to-image' ? 'text-primary' : 'text-muted-foreground'}`}>
            Text to Image
          </span>
        </button>

        <button
          onClick={() => {
            setMode('image-to-text');
            setResults([]);
            setPrompt('');
          }}
          className={`p-4 rounded-xl border border-border/40 flex flex-col items-center gap-2 transition-all duration-200
            ${mode === 'image-to-text' 
              ? 'bg-primary/10 border-primary/50' 
              : 'bg-secondary/10 hover:bg-secondary/20'}`}
        >
          <ImageDown className={`w-5 h-5 ${mode === 'image-to-text' ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className={`text-sm font-medium ${mode === 'image-to-text' ? 'text-primary' : 'text-muted-foreground'}`}>
            Image to Text
          </span>
        </button>
      </div>

      {/* Error Message with Retry */}
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm">{error}</p>
              {retryCount < 3 && (
                <button
                  onClick={handleRetry}
                  className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Try Again</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      {loading && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">{status}</span>
            <span className="text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full bg-secondary/10">
            <div 
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {showHistory ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Generated Images</h2>
              {imageHistory.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear History
                </button>
              )}
            </div>
            {imageHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No generated images yet
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {imageHistory.map((item, index) => (
                  <div 
                    key={item.timestamp}
                    className="relative rounded-xl overflow-hidden bg-secondary/10 border border-border/40 group cursor-pointer"
                    onClick={() => handleImageClick(item.url, index, item.prompt)}
                  >
                    <img src={item.url} alt={item.prompt} className="w-full h-auto" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                      <p className="text-xs text-white/90 line-clamp-3">{item.prompt}</p>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(item.url, index);
                          }}
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        >
                          <Download className="w-4 h-4 text-white" />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        >
                          <Maximize2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {mode === 'text-to-image' ? (
              <>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the image you want to generate..."
                    className="w-full h-32 rounded-xl bg-secondary/10 border border-border/40 p-4 text-sm
                      focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
                      placeholder:text-muted-foreground/70 resize-none"
                    disabled={loading}
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
                    {prompt.length}/1000
                  </div>
                </div>

                {results.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {results.map((url, index) => (
                      <div 
                        key={index}
                        className="relative rounded-xl overflow-hidden bg-secondary/10 border border-border/40 group cursor-pointer"
                        onClick={() => handleImageClick(url, index, prompt)}
                      >
                        <img src={url} alt={`Variation ${index + 1}`} className="w-full h-auto" />
                        <div className="absolute top-4 left-4 text-xs font-medium px-2.5 py-1 rounded-md bg-black/60 text-white">
                          Variation {index + 1}
                        </div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(url, index);
                            }}
                            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                          >
                            <Download className="w-5 h-5 text-white" />
                          </button>
                          <button
                            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                          >
                            <Maximize2 className="w-5 h-5 text-white" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="relative">
                  {previewUrl ? (
                    <div className="relative rounded-xl overflow-hidden bg-secondary/10 border border-border/40">
                      <img src={previewUrl} alt="Preview" className="w-full h-auto" />
                      <button
                        onClick={() => {
                          setSelectedImage(null);
                          setPreviewUrl(null);
                          setResults([]);
                        }}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-background/80 
                          hover:bg-background transition-colors border border-border/40"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 rounded-xl 
                      bg-secondary/10 border-2 border-dashed border-border/40 cursor-pointer
                      hover:bg-secondary/20 transition-all duration-200">
                      <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Click to upload an image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {results.length > 0 && (
                  <div className="rounded-xl bg-secondary/10 border border-border/40 p-4">
                    <p className="text-sm whitespace-pre-wrap">{results.join('\n')}</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closePreview}
        >
          <div 
            className="relative max-w-5xl w-full bg-background rounded-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(previewImage.url, previewImage.index);
                }}
                className="p-2 rounded-lg bg-black/60 hover:bg-black/80 transition-colors"
              >
                <Download className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={closePreview}
                className="p-2 rounded-lg bg-black/60 hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <img 
              src={previewImage.url} 
              alt={`Preview ${previewImage.index + 1}`}
              className="w-full h-auto"
            />
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-sm text-white/90">{previewImage.prompt}</p>
              {!showHistory && (
                <div className="mt-2 text-xs text-white/70">
                  Variation {previewImage.index + 1}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      {!showHistory && (
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading || (!prompt.trim() && mode === 'text-to-image') || (!selectedImage && mode === 'image-to-text')}
            className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-medium
              transition-all duration-200 disabled:opacity-50
              ${loading ? 'bg-secondary/20' : 'bg-primary text-primary-foreground hover:opacity-90'}`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>{status || (mode === 'text-to-image' ? 'Generating...' : 'Analyzing...')}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>{mode === 'text-to-image' ? 'Generate Variations' : 'Analyze Image'}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
} 
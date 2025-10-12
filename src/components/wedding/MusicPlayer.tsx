import { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, Volume2, VolumeX, X, Maximize2, Minimize2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

// Declare YouTube IFrame API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface MusicPlayerProps {
  audioUrl?: string;
  autoPlay?: boolean;
  theme?: string;
}

// Helper function to detect music platform
const detectMusicPlatform = (url: string): 'youtube' | 'spotify' | 'audio' | 'unknown' => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('spotify.com')) return 'spotify';
  if (url.match(/\.(mp3|wav|ogg|m4a)$/i)) return 'audio';
  // Try to detect if it's a direct audio URL
  try {
    const urlObj = new URL(url);
    if (urlObj.pathname.match(/\.(mp3|wav|ogg|m4a)$/i)) return 'audio';
  } catch {}
  return 'unknown';
};

// Extract YouTube video ID
const getYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export function MusicPlayer({ audioUrl, autoPlay = false, theme = 'romantic' }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const youtubePlayerRef = useRef<any>(null);
  const [platform, setPlatform] = useState<'youtube' | 'spotify' | 'audio' | 'unknown'>('audio');
  const [youtubeId, setYoutubeId] = useState<string | null>(null);

  // Detect platform and setup
  useEffect(() => {
    if (!audioUrl) return;
    
    const detectedPlatform = detectMusicPlatform(audioUrl);
    setPlatform(detectedPlatform);
    
    if (detectedPlatform === 'youtube') {
      const videoId = getYouTubeId(audioUrl);
      setYoutubeId(videoId);
      
      // Load YouTube IFrame API
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }
    }
  }, [audioUrl]);

  // YouTube Player Setup
  useEffect(() => {
    if (platform !== 'youtube' || !youtubeId || !window.YT) return;

    const initYouTubePlayer = () => {
      youtubePlayerRef.current = new window.YT.Player('youtube-player', {
        videoId: youtubeId,
        playerVars: {
          autoplay: autoPlay ? 1 : 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (event: any) => {
            const savedVolume = localStorage.getItem('musicVolume');
            if (savedVolume) {
              event.target.setVolume(parseFloat(savedVolume) * 100);
            }
            if (autoPlay) {
              event.target.playVideo();
              setIsPlaying(true);
            }
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            } else if (event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
            }
          },
        },
      });

      // Update time
      const interval = setInterval(() => {
        if (youtubePlayerRef.current && youtubePlayerRef.current.getCurrentTime) {
          setCurrentTime(youtubePlayerRef.current.getCurrentTime());
          setDuration(youtubePlayerRef.current.getDuration());
        }
      }, 1000);

      return () => clearInterval(interval);
    };

    if (window.YT && window.YT.Player) {
      initYouTubePlayer();
    } else {
      window.onYouTubeIframeAPIReady = initYouTubePlayer;
    }
  }, [platform, youtubeId, autoPlay]);

  // Audio Player Setup (for direct audio files)
  useEffect(() => {
    if (platform !== 'audio') return;
    
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    // Load saved volume
    const savedVolume = localStorage.getItem('musicVolume');
    if (savedVolume) {
      const vol = parseFloat(savedVolume);
      setVolume(vol);
      audio.volume = vol;
    } else {
      audio.volume = volume;
    }

    // Auto-play if enabled
    if (autoPlay) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [platform, audioUrl, autoPlay]);

  const togglePlay = () => {
    if (platform === 'youtube' && youtubePlayerRef.current) {
      if (isPlaying) {
        youtubePlayerRef.current.pauseVideo();
      } else {
        youtubePlayerRef.current.playVideo();
      }
    } else if (platform === 'audio') {
      const audio = audioRef.current;
      if (!audio) return;
      
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (platform === 'youtube' && youtubePlayerRef.current) {
      youtubePlayerRef.current.setVolume(newVolume * 100);
    } else if (platform === 'audio' && audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    
    localStorage.setItem('musicVolume', newVolume.toString());
    if (newVolume > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    if (platform === 'youtube' && youtubePlayerRef.current) {
      if (isMuted) {
        youtubePlayerRef.current.unMute();
      } else {
        youtubePlayerRef.current.mute();
      }
      setIsMuted(!isMuted);
    } else if (platform === 'audio' && audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (value: number[]) => {
    const time = value[0];
    
    if (platform === 'youtube' && youtubePlayerRef.current) {
      youtubePlayerRef.current.seekTo(time, true);
    } else if (platform === 'audio' && audioRef.current) {
      audioRef.current.currentTime = time;
    }
    
    setCurrentTime(time);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!audioUrl || !isVisible) return null;

  // If platform is Spotify or unknown, show a link to open externally
  if (platform === 'spotify' || platform === 'unknown') {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-72">
        <div className="bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Wedding Music</span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => setIsVisible(false)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          <a
            href={audioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Άνοιγμα {platform === 'spotify' ? 'στο Spotify' : 'Μουσικής'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      {platform === 'audio' && <audio ref={audioRef} src={audioUrl} preload="metadata" />}
      {platform === 'youtube' && (
        <div className="hidden">
          <div id="youtube-player"></div>
        </div>
      )}
      
      <div 
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isExpanded ? 'w-80' : 'w-64'
        }`}
      >
        <div className="bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-lg overflow-hidden">
          {/* Compact Header */}
          <div className="flex items-center justify-between p-3 border-b border-border">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Music className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm font-medium truncate">Wedding Music</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => setIsVisible(false)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Player Controls */}
          <div className="p-4 space-y-3">
            {/* Play Button & Time */}
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="outline"
                className="h-10 w-10 rounded-full"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </Button>
              
              {isExpanded && (
                <div className="text-xs text-muted-foreground">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {isExpanded && (
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
                className="cursor-pointer"
              />
            )}

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={toggleMute}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

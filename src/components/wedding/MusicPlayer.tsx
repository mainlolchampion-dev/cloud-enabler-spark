import React, { useState, useEffect, useRef } from 'react';
import { Music, Pause, VolumeX, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

interface MusicPlayerProps {
  youtubeVideoId?: string;
  audioUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  youtubeVideoId = 'zeip_QOwnAw',
  audioUrl = '/wedding-song.mp3',
  primaryColor = '#FF80AB',
  secondaryColor = '#FF5A8C'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [useAudio, setUseAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerReadyRef = useRef<boolean>(false);
  
  useEffect(() => {
    const setupPlayback = () => {
      // Setup audio fallback
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.loop = true;
        audio.volume = 0.5;
        audioRef.current = audio;
        
        audio.addEventListener('canplay', () => {
          setAudioLoaded(true);
        });

        audio.addEventListener('error', () => {
          console.log('Audio failed to load, YouTube only mode');
          setAudioLoaded(false);
        });
      }

      // Setup YouTube player
      if (youtubeVideoId) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        (window as any).onYouTubeIframeAPIReady = () => {
          try {
            new (window as any).YT.Player('youtube-player-' + youtubeVideoId, {
              videoId: youtubeVideoId,
              playerVars: {
                autoplay: 0,
                controls: 0,
                loop: 1,
                mute: 1,
                playlist: youtubeVideoId
              },
              events: {
                onReady: (event: any) => {
                  (window as any).ytPlayer = event.target;
                  playerReadyRef.current = true;
                  setAudioLoaded(true);
                },
                onError: () => {
                  console.log('YouTube player error, falling back to audio');
                  setUseAudio(true);
                }
              }
            });
          } catch (error) {
            console.log('YouTube player setup failed:', error);
            setUseAudio(true);
          }
        };
      }
    };
    
    setupPlayback();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [youtubeVideoId, audioUrl]);

  const togglePlay = () => {
    if (useAudio && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          toast.error("Δεν μπορεί να παιχτεί η μουσική");
        });
      }
      setIsPlaying(!isPlaying);
    } else if (playerReadyRef.current && (window as any).ytPlayer) {
      if (isPlaying) {
        (window as any).ytPlayer.pauseVideo();
      } else {
        (window as any).ytPlayer.playVideo();
        if (isMuted) {
          (window as any).ytPlayer.mute();
        }
      }
      setIsPlaying(!isPlaying);
    } else if (audioRef.current) {
      // Fallback to audio if YouTube not ready
      setUseAudio(true);
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          toast.error("Δεν μπορεί να παιχτεί η μουσική");
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (useAudio && audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    } else if (playerReadyRef.current && (window as any).ytPlayer) {
      if (isMuted) {
        (window as any).ytPlayer.unMute();
      } else {
        (window as any).ytPlayer.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div style={{ position: 'absolute', visibility: 'hidden' }}>
        <div id={'youtube-player-' + youtubeVideoId}></div>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        <button 
          onClick={togglePlay}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 text-white border-2 border-white/30"
          style={{ 
            background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` 
          }}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Music className="w-6 h-6" />}
        </button>
        
        {isPlaying && (
          <button
            onClick={toggleMute}
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all text-white border-2 border-white/30"
            style={{ 
              background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` 
            }}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;
export type YouTubePlayer = {
  pauseVideo: () => void;
  destroy: () => void;
  getIframe: () => HTMLIFrameElement;
};
type PlayerOptions = {
  host: string;
  videoId: string;
  width: string;
  height: string;
  playerVars: Record<string, string | number>;
  events: {
    onReady: (event: { target: YouTubePlayer }) => void;
    onError: (event: { data: number }) => void;
    onStateChange: (event: { data: number }) => void;
  };
};
export type YouTubeAPI = {
  Player: new (element: HTMLElement, options: PlayerOptions) => YouTubePlayer;
};
declare global {
  interface Window {
    YT?: YouTubeAPI;
    onYouTubeIframeAPIReady?: () => void;
  }
}
let loading: Promise<YouTubeAPI> | null = null;
/** Official IFrame API only. No OAuth, Data API, media downloads or channel auto-import. */
export function loadYouTube(): Promise<YouTubeAPI> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      loading = null;
      reject(Error('YouTube took too long to load'));
    }, 15000);
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT?.Player) {
        clearTimeout(timer);
        resolve(window.YT);
      }
    };
    let script = document.querySelector<HTMLScriptElement>('script[data-quick-youtube]');
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.dataset.quickYoutube = 'true';
      script.async = true;
      document.head.appendChild(script);
    }
    script.onerror = () => {
      clearTimeout(timer);
      script.remove();
      loading = null;
      reject(Error('YouTube could not load'));
    };
  });
  return loading;
}

import * as React from "react";
import { addPropertyControls, ControlType } from "framer";

/* ========================== Types ========================== */
export interface TrackData {
  id: string;
  title: string;
  artist: string;
  album: string;
  image: string;
  duration: number;
  explicit: boolean;
  popularity: number;
}

export interface SpotifyProviderProps {
  spotifyUrl: string;
  clientId: string;
  clientSecret: string;
  children: React.ReactNode;
}

/* ======================= Context ========================== */
const SpotifyContext = React.createContext<TrackData | null>(null);

export function SpotifyProvider({
  spotifyUrl,
  clientId,
  clientSecret,
  children,
}: SpotifyProviderProps) {
  const [track, setTrack] = React.useState<TrackData | null>(null);

  React.useEffect(() => {
    if (!spotifyUrl || !clientId || !clientSecret) return;
    let cancelled = false;

    async function fetchTrackData() {
      try {
        // 1. Get token
        const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            Authorization: "Basic " + btoa(`${clientId}:${clientSecret}`),
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: "grant_type=client_credentials",
        });
        const { access_token } = await tokenRes.json();

        // 2. Extract track ID
        const id = spotifyUrl.split("/track/")[1]?.split("?")[0];
        if (!id) return;

        // 3. Fetch track metadata
        const res = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        const json = await res.json();

        if (!cancelled) {
          setTrack({
            id,
            title: json.name,
            artist: json.artists.map((a: any) => a.name).join(", "),
            album: json.album.name,
            image: json.album.images?.[1]?.url ?? "",
            duration: json.duration_ms,
            explicit: json.explicit,
            popularity: json.popularity,
          });
        }
      } catch (e) {
        console.warn("Spotify fetch failed:", e);
      }
    }

    fetchTrackData();
    return () => {
      cancelled = true;
    };
  }, [spotifyUrl, clientId, clientSecret]);

  return (
    <SpotifyContext.Provider value={track}>{children}</SpotifyContext.Provider>
  );
}

export function useSpotify(): TrackData | null {
  return React.useContext(SpotifyContext);
}

/* ============== Framer Property Controls ================== */
SpotifyProvider.defaultProps = {
  spotifyUrl: "https://open.spotify.com/track/373C7aTyGRJw7sVT4UG6Fh",
  clientId: "",
  clientSecret: "",
};

addPropertyControls(SpotifyProvider, {
  spotifyUrl: { type: ControlType.String, title: "Track URL" },
  clientId: { type: ControlType.String, title: "Client ID" },
  clientSecret: {
    type: ControlType.String,
    title: "Client Secret",
    description: "[Create an API key](https://developer.spotify.com/dashboard)",
  },
});

/* ========================================================== */
/* =====================  OVERRIDES  ======================== */
/* ========================================================== */

import { forwardRef, useRef, useEffect, ComponentType } from "react";

// ————— Load Spotify Embed API Safely —————
let spotifyAPILoadPromise: Promise<any> | null = null;

function loadSpotifyIframeAPI(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject("SSR");

  if ((window as any).SpotifyIframe) {
    return Promise.resolve((window as any).SpotifyIframe);
  }

  if (!spotifyAPILoadPromise) {
    spotifyAPILoadPromise = new Promise((resolve) => {
      (window as any).onSpotifyIframeApiReady = (SI: any) => {
        resolve(SI);
      };

      if (!document.getElementById("spotify-embed-api")) {
        const script = document.createElement("script");
        script.id = "spotify-embed-api";
        script.src = "https://open.spotify.com/embed/iframe-api/v1";
        script.async = true;
        document.body.appendChild(script);
      }
    });
  }

  return spotifyAPILoadPromise;
}

// ————— Shared controller map: trackUri -> controller instance —————
const controllers: Record<string, any> = {};

async function getController(trackId: string, container: HTMLElement) {
  if (controllers[trackId]) return controllers[trackId];

  // clear previous iframe
  container.innerHTML = "";

  const SI = await loadSpotifyIframeAPI();

  return new Promise<any>((resolve) => {
    SI.createController(
      container,
      {
        uri: `spotify:track:${trackId}`,
        view: "coverart",
        theme: "white",
        width: "100%",
        height: "100%",
      },
      (ctrl: any) => {
        controllers[trackId] = ctrl;

        const iframe = container.querySelector("iframe");
        if (iframe instanceof HTMLIFrameElement) {
          iframe.removeAttribute("loading");
          iframe.style.width = "1px";
          iframe.style.height = "1px";
          iframe.style.pointerEvents = "none";
        }

        resolve(ctrl);
      },
    );
  });
}

// ————— Hook to prep hidden controller —————
function useTrackController() {
  const containerRef = useRef<HTMLDivElement>(null);
  const track = useSpotify();

  useEffect(() => {
    if (!track?.id || !containerRef.current) return;
    getController(track.id, containerRef.current);
  }, [track?.id]);

  return containerRef;
}

// ————— Play Button Override (Safari-safe) —————
export function withSpotifyPlayButton(
  Component: ComponentType<any>,
): ComponentType<any> {
  return forwardRef<any, any>((props, ref) => {
    const containerRef = useTrackController();
    const track = useSpotify();

    const handlePointerDown = async () => {
      if (!track?.id || !containerRef.current) return;

      // Always fetch controller and play immediately (Safari safe)
      const ctrl = await getController(track.id, containerRef.current);
      if (ctrl.play) ctrl.play();
    };

    return (
      <Component
        ref={ref}
        {...props}
        onPointerDown={handlePointerDown}
        style={{ cursor: "pointer", ...props.style }}
      >
        <div
          ref={containerRef}
          style={{ width: 0, height: 0, overflow: "hidden" }}
        />
        {props.children}
      </Component>
    );
  });
}

// ————— Pause Button Override —————
export function withSpotifyPauseButton(
  Component: ComponentType<any>,
): ComponentType<any> {
  return forwardRef<any, any>((props, ref) => {
    const containerRef = useTrackController();
    const track = useSpotify();

    const handlePause = async () => {
      if (!track?.id) return;
      const ctrl = await getController(track.id, containerRef.current!);
      if (ctrl.pause) ctrl.pause();
    };

    return (
      <Component
        ref={ref}
        {...props}
        onTap={handlePause}
        style={{ cursor: "pointer", ...props.style }}
      >
        <div
          ref={containerRef}
          style={{ width: 0, height: 0, overflow: "hidden" }}
        />
        {props.children}
      </Component>
    );
  });
}

// ————— Text & Image Overrides —————
function withTrackProp<P>(
  Component: ComponentType<P>,
  map: (track: ReturnType<typeof useSpotify>) => Partial<P>,
): ComponentType<P> {
  return forwardRef<any, P>((props, ref) => {
    const track = useSpotify();
    const injected = track ? map(track) : {};
    return <Component ref={ref} {...props} {...(injected as P)} />;
  });
}

export function withSpotifyTitle(
  Component: ComponentType<any>,
): ComponentType<any> {
  return withTrackProp(Component, (t) => ({ text: t?.title ?? "Loading…" }));
}
export function withSpotifyArtist(
  Component: ComponentType<any>,
): ComponentType<any> {
  return withTrackProp(Component, (t) => ({ text: t?.artist ?? "" }));
}
export function withSpotifyAlbum(
  Component: ComponentType<any>,
): ComponentType<any> {
  return withTrackProp(Component, (t) => ({ text: t?.album ?? "" }));
}
export function withSpotifyDuration(
  Component: ComponentType<any>,
): ComponentType<any> {
  return withTrackProp(Component, (t) => {
    if (!t?.duration) return { text: "" };
    const m = Math.floor(t.duration / 60000);
    const s = String(Math.floor((t.duration % 60000) / 1000)).padStart(2, "0");
    return { text: `${m}:${s}` };
  });
}
export function withSpotifyExplicit(
  Component: ComponentType<any>,
): ComponentType<any> {
  return withTrackProp(Component, (t) => ({
    text: t?.explicit ? "Explicit" : "",
  }));
}
export function withSpotifyPopularity(
  Component: ComponentType<any>,
): ComponentType<any> {
  return withTrackProp(Component, (t) => ({
    text: t?.popularity != null ? `Popularity: ${t.popularity}/100` : "",
  }));
}
export function withSpotifyImage(
  Component: ComponentType<any>,
): ComponentType<any> {
  return withTrackProp(Component, (t) => ({ image: t?.image ?? "" }));
}

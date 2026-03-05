// draft-announcer/use-draft-announcer.ts
import { useCallback, useEffect, useRef, useState } from "react";
import type { Side, ActionType, SoundKey } from "./types";
import { SOUND_FILES } from "./types";

type UseDraftAnnouncerOptions = {
    cooldownMs?: number;
    volume?: number;
    autoPreload?: boolean;
};

export function useDraftAnnouncer(options?: UseDraftAnnouncerOptions) {
    const { cooldownMs = 1500, volume = 1, autoPreload = true } = options ?? {};
    const audioMapRef = useRef<Partial<Record<SoundKey, HTMLAudioElement>>>({});
    const lastPlayedRef = useRef<Partial<Record<SoundKey, number>>>({});
    const [isLoaded, setIsLoaded] = useState(false);
    const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

    useEffect(() => {
        if (!isBrowser || !autoPreload) return;

        const entries = Object.entries(SOUND_FILES) as [SoundKey, string][];
        let loadedCount = 0;
        const total = entries.length;

        entries.forEach(([key, src]) => {
            try {
                const audio = new Audio(src);
                audio.preload = "auto";
                audio.volume = volume;
                const onLoaded = () => {
                    loadedCount += 1;
                    audio.removeEventListener("canplaythrough", onLoaded);
                    audio.removeEventListener("loadeddata", onLoaded);
                    if (loadedCount >= total) setIsLoaded(true);
                };
                audio.addEventListener("canplaythrough", onLoaded);
                audio.addEventListener("loadeddata", onLoaded);
                audio.load();
                audioMapRef.current[key] = audio;
            } catch (err) {
                console.warn("[DraftAnnouncer] preload error for", key, err);
            }
        });

        const timer = setTimeout(() => setIsLoaded(true), 2000);
        return () => clearTimeout(timer);
    }, [isBrowser, autoPreload, volume]);

    const setVolume = useCallback((v: number) => {
        Object.values(audioMapRef.current).forEach((a) => {
            if (a) a.volume = v;
        });
    }, []);

    const stopAll = useCallback(() => {
        Object.values(audioMapRef.current).forEach((a) => {
            try {
                if (a && !a.paused) {
                    a.pause();
                    a.currentTime = 0;
                }
            } catch {}
        });
    }, []);

    const playAnnouncement = useCallback(
        (side: Side | string, action: ActionType | string) => {
            if (!isBrowser) return false;

            // normalize inputs and defensively cast to keys
            const s = String(side ?? "").toLowerCase().trim();
            const a = String(action ?? "").toLowerCase().trim();
            const key = `${s}_${a}` as SoundKey;

            // debug log — will help you trace wrong side/action
            console.debug("[DraftAnnouncer] playAnnouncement ->", { side: s, action: a, key, file: SOUND_FILES[key] });

            const now = Date.now();
            const last = lastPlayedRef.current[key] ?? 0;
            if (now - last < cooldownMs) {
                console.debug("[DraftAnnouncer] suppressed by cooldown", key);
                return false;
            }
            lastPlayedRef.current[key] = now;

            let audio = audioMapRef.current[key];
            if (!audio) {
                try {
                    audio = new Audio(SOUND_FILES[key]);
                    audio.preload = "auto";
                    audio.volume = volume;
                    audioMapRef.current[key] = audio;
                } catch (e) {
                    console.warn("[DraftAnnouncer] fallback audio creation failed", key, e);
                    return false;
                }
            }

            try {
                if (!audio.paused) {
                    audio.pause();
                    audio.currentTime = 0;
                } else {
                    audio.currentTime = 0;
                }
                audio.play().catch((err) => {
                    console.warn("[DraftAnnouncer] play() promise rejected", key, err);
                });
                return true;
            } catch (err) {
                console.warn("[DraftAnnouncer] play error", key, err);
                return false;
            }
        },
        [isBrowser, cooldownMs, volume]
    );

    return {
        isLoaded,
        playAnnouncement,
        stopAll,
        setVolume,
    };
}
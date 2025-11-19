(() => {
    const audioContext =
        typeof window !== "undefined" &&
        (window.AudioContext || window.webkitAudioContext)
            ? new (window.AudioContext || window.webkitAudioContext)()
            : null;

    if (!window.SominnercoreChat) {
        window.SominnercoreChat = {};
    }

    const storageKey = "Sominnercore.ChatSession";

    window.SominnercoreChat.saveSession = (payload) => {
        try {
            if (typeof window.localStorage === "undefined") {
                return;
            }

            const data = {
                sessionId: payload?.sessionId ?? null,
                name: payload?.name ?? null,
                email: payload?.email ?? null
            };

            if (!data.sessionId && !data.name && !data.email) {
                window.localStorage.removeItem(storageKey);
            } else {
                window.localStorage.setItem(storageKey, JSON.stringify(data));
            }
        } catch (_) {
            // Ignore localStorage access issues (private browsing, etc.).
        }
    };

    window.SominnercoreChat.loadSession = () => {
        try {
            if (typeof window.localStorage === "undefined") {
                return null;
            }

            const raw = window.localStorage.getItem(storageKey);
            if (!raw) {
                return null;
            }

            return JSON.parse(raw);
        } catch (_) {
            return null;
        }
    };

    window.SominnercoreChat.clearSession = () => {
        try {
            if (typeof window.localStorage === "undefined") {
                return;
            }

            window.localStorage.removeItem(storageKey);
        } catch (_) {
            // Ignore errors.
        }
    };

    window.SominnercoreChat.playNotification = () => {
        if (!audioContext) {
            return;
        }

        const now = audioContext.currentTime;

        if (audioContext.state === "suspended") {
            audioContext.resume().catch(() => {
                /* Ignore resume failures (likely due to autoplay restrictions). */
            });
        }

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = 880;

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        oscillator.connect(gain).connect(audioContext.destination);

        oscillator.start(now);
        oscillator.stop(now + 0.4);
    };
})();


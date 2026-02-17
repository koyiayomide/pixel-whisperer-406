import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Share, MoreVertical, Check, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallScreen = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua));

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="mobile-container flex flex-col items-center justify-center p-8 bg-background min-h-screen">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-success" />
        </motion.div>
        <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>Already Installed!</h1>
        <p className="text-muted-foreground text-center mb-8">PayOs One is on your home screen. Open it from there for the best experience.</p>
        <button onClick={() => navigate("/")} className="w-full py-4 rounded-2xl gradient-secondary text-secondary-foreground font-semibold text-lg">
          Continue to App
        </button>
      </div>
    );
  }

  return (
    <div className="mobile-container flex flex-col bg-background min-h-screen">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center">
          <div className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Smartphone className="w-12 h-12 text-primary-foreground" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-3" style={{ fontFamily: "var(--font-heading)" }}>Install PayOs One</h1>
          <p className="text-muted-foreground mb-10 max-w-xs mx-auto">Add PayOs One to your home screen for instant access, offline support, and a native app experience.</p>

          {deferredPrompt ? (
            <button onClick={handleInstall} className="w-full py-4 rounded-2xl gradient-secondary text-secondary-foreground font-semibold text-lg flex items-center justify-center gap-3 shadow-md">
              <Download className="w-5 h-5" /> Install App
            </button>
          ) : isIOS ? (
            <div className="bg-card rounded-2xl p-6 border border-border text-left space-y-4">
              <p className="font-semibold text-foreground text-center mb-2">How to install on iPhone</p>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0"><Share className="w-4 h-4 text-secondary" /></div>
                <p className="text-muted-foreground text-sm">Tap the <strong className="text-foreground">Share</strong> button in Safari's toolbar</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0"><Download className="w-4 h-4 text-secondary" /></div>
                <p className="text-muted-foreground text-sm">Scroll down and tap <strong className="text-foreground">"Add to Home Screen"</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0"><Check className="w-4 h-4 text-secondary" /></div>
                <p className="text-muted-foreground text-sm">Tap <strong className="text-foreground">"Add"</strong> to confirm</p>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-2xl p-6 border border-border text-left space-y-4">
              <p className="font-semibold text-foreground text-center mb-2">How to install on Android</p>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0"><MoreVertical className="w-4 h-4 text-secondary" /></div>
                <p className="text-muted-foreground text-sm">Tap the <strong className="text-foreground">menu (⋮)</strong> in Chrome</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0"><Download className="w-4 h-4 text-secondary" /></div>
                <p className="text-muted-foreground text-sm">Tap <strong className="text-foreground">"Install app"</strong> or <strong className="text-foreground">"Add to Home screen"</strong></p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <div className="p-8 text-center">
        <button onClick={() => navigate("/")} className="text-muted-foreground text-sm underline">
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default InstallScreen;

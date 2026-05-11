import { useEffect, useState } from 'react';

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    // Listen for app install success
    const handleAppInstalled = () => {
      console.log('PWA app installed');
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowButton(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowButton(false);
      }
    }
  };

  if (isInstalled || !showButton) {
    return null;
  }

  return (
    <button
      onClick={handleInstallClick}
      className="install-button"
      title="Install MedNews as an app"
      aria-label="Install app"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 2v16M5 11l7-7 7 7" />
        <path d="M5 22h14" />
      </svg>
      Install App
    </button>
  );
}

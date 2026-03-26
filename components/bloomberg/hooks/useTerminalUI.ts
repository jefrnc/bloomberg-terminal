import { useAtom } from "jotai";
import { useCallback } from "react";
import { currentViewAtom, errorAtom, isDarkModeAtom, isShortcutsHelpOpenAtom } from "../atoms";
import { selectedTickerAtom, smallCapViewAtom } from "../atoms/smallcaps";

export function useTerminalUI() {
  const [isDarkMode, setIsDarkMode] = useAtom(isDarkModeAtom);
  const [error, setError] = useAtom(errorAtom);
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useAtom(isShortcutsHelpOpenAtom);
  const [currentView, setCurrentView] = useAtom(currentViewAtom);
  const [smallCapView, setSmallCapView] = useAtom(smallCapViewAtom);
  const [selectedTicker] = useAtom(selectedTickerAtom);

  // Theme toggle handler
  const handleThemeToggle = useCallback(() => {
    setIsDarkMode(!isDarkMode);
  }, [isDarkMode, setIsDarkMode]);

  // View handlers — small caps views
  const handleScannerView = useCallback(() => {
    setSmallCapView("scanner");
    setCurrentView("scanner");
  }, [setCurrentView, setSmallCapView]);

  const handleDilutionView = useCallback(() => {
    if (selectedTicker) {
      setSmallCapView("dilution");
      setCurrentView("dilution");
    }
  }, [setCurrentView, setSmallCapView, selectedTicker]);

  const handleMoversView = useCallback(() => {
    setSmallCapView("movers");
    setCurrentView("movers");
  }, [setCurrentView, setSmallCapView]);

  const handleSignalsView = useCallback(() => {
    setSmallCapView("signals");
    setCurrentView("signals");
  }, [setCurrentView, setSmallCapView]);

  const handleAlertsView = useCallback(() => {
    setSmallCapView("alerts");
    setCurrentView("alerts");
  }, [setCurrentView, setSmallCapView]);

  const handleHeatmapView = useCallback(() => {
    if (selectedTicker) {
      setSmallCapView("heatmap");
      setCurrentView("heatmap");
    }
  }, [setCurrentView, setSmallCapView, selectedTicker]);

  // Legacy view handlers (kept for compatibility)
  const handleMarketView = useCallback(() => {
    setCurrentView("market");
  }, [setCurrentView]);

  const handleNewsView = useCallback(() => {
    setCurrentView("news");
  }, [setCurrentView]);

  const handleVolatilityView = useCallback(() => {
    setCurrentView("volatility");
  }, [setCurrentView]);

  const handleRmiView = useCallback(() => {
    setCurrentView("rmi");
  }, [setCurrentView]);

  // Other UI handlers
  const handleCancelClick = useCallback(() => {
    console.log("Cancel clicked");
  }, []);

  const handleNewClick = useCallback(() => {
    console.log("New clicked");
  }, []);

  const handleBlancClick = useCallback(() => {
    console.log("Blanc clicked");
  }, []);

  const handleHelpClick = useCallback(() => {
    setIsShortcutsHelpOpen(true);
  }, [setIsShortcutsHelpOpen]);

  const handleCloseShortcutsHelp = useCallback(() => {
    setIsShortcutsHelpOpen(false);
  }, [setIsShortcutsHelpOpen]);

  return {
    // State
    isDarkMode,
    error,
    isShortcutsHelpOpen,
    currentView,
    smallCapView,
    selectedTicker,

    // Setters
    setIsDarkMode,
    setError,
    setIsShortcutsHelpOpen,
    setCurrentView,

    // Handlers — general
    handleThemeToggle,

    // Handlers — small caps
    handleScannerView,
    handleDilutionView,
    handleMoversView,
    handleSignalsView,
    handleAlertsView,
    handleHeatmapView,

    // Handlers — legacy
    handleMarketView,
    handleNewsView,
    handleVolatilityView,
    handleRmiView,
    handleCancelClick,
    handleNewClick,
    handleBlancClick,
    handleHelpClick,
    handleCloseShortcutsHelp,
  };
}

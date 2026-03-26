"use client";

import { useAtom } from "jotai";
import { useCallback } from "react";
import { showDilutionColumnAtom } from "../atoms/smallcaps";
import {
  activeWatchlistAtom,
  addWatchlistAtom,
  closeConfirmModalAtom,
  confirmAndCloseModalAtom,
  confirmModalPropsAtom,
  isConfirmModalOpenAtom,
  isWatchlistOpenAtom,
  openConfirmModalAtom,
  resetFiltersAtom,
  watchlistsAtom,
} from "../atoms/terminal-ui";
import { ConfirmationModal } from "../core/confirmation-modal";
import { ShortcutsHelp } from "../core/keyboard-shortcuts";
import { Watchlist } from "../core/watchlist";
import { useTerminalUI } from "../hooks";
import { useMarketDataQuery } from "../hooks";
import { TerminalFilterBar } from "../layout/terminal-filter-bar";
import { TerminalHeader } from "../layout/terminal-header";
import { TerminalLayout } from "../layout/terminal-layout";
import type { MarketItem } from "../types";
import { AlertsView } from "../views/alerts-view";
import { DilutionView } from "../views/dilution-view";
import { GapHeatmapView } from "../views/gap-heatmap-view";
import MarketMoversView from "../views/market-movers-view";
import { MarketView } from "../views/market-view";
import NewsView from "../views/news-view";
import { RmiView } from "../views/rmi-view";
import { ScannerView } from "../views/scanner-view";
import { StrategySignalsView } from "../views/strategy-signals-view";
import VolatilityView from "../views/volatility-view";

export default function BloombergTerminal() {
  const {
    isDarkMode,
    error,
    setError,
    currentView,
    setCurrentView,
    isShortcutsHelpOpen,
    setIsShortcutsHelpOpen,
    handleThemeToggle,
    handleScannerView,
    handleDilutionView,
    handleMoversView,
    handleSignalsView,
    handleAlertsView,
    handleHeatmapView,
    handleMarketView,
    handleNewsView,
    handleVolatilityView,
    handleRmiView,
    handleCancelClick,
    handleNewClick,
    handleBlancClick,
    handleHelpClick,
  } = useTerminalUI();

  // Jotai atoms for state management
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useAtom(isConfirmModalOpenAtom);
  const [confirmModalProps, setConfirmModalProps] = useAtom(confirmModalPropsAtom);
  const [isWatchlistOpen, setIsWatchlistOpen] = useAtom(isWatchlistOpenAtom);
  const [watchlists, setWatchlists] = useAtom(watchlistsAtom);
  const [activeWatchlist, setActiveWatchlist] = useAtom(activeWatchlistAtom);
  const [, resetFilters] = useAtom(resetFiltersAtom);
  const [showDilution, setShowDilution] = useAtom(showDilutionColumnAtom);

  // Action atoms
  const [, openConfirmModal] = useAtom(openConfirmModalAtom);
  const [, closeConfirmModal] = useAtom(closeConfirmModalAtom);
  const [, confirmAndCloseModal] = useAtom(confirmAndCloseModalAtom);
  const [, addWatchlist] = useAtom(addWatchlistAtom);

  // React Query hook for market data
  const { marketData: data, refreshData, toggleRealTimeUpdates, isLoading } = useMarketDataQuery();

  // Get all market indices for watchlist
  const allMarketIndices = useCallback(() => {
    const indices: string[] = [];
    if (data?.americas) {
      for (const item of data.americas) {
        indices.push(item.id);
      }
    }
    if (data?.emea) {
      for (const item of data.emea) {
        indices.push(item.id);
      }
    }
    if (data?.asiaPacific) {
      for (const item of data.asiaPacific) {
        indices.push(item.id);
      }
    }
    return indices;
  }, [data]);

  // Handle CANCL button with confirmation modal
  const handleCancelWithConfirm = () => {
    openConfirmModal({
      title: "Confirm Action",
      message: "Are you sure you want to cancel the current operation?",
      onConfirm: () => {
        console.log("Operation cancelled");
      },
    });
  };

  // Handle NEW button for watchlist
  const handleNewWatchlist = () => {
    setIsWatchlistOpen(true);
  };

  // Handle BLANC button with confirmation modal
  const handleBlancWithConfirm = () => {
    openConfirmModal({
      title: "Clear All Filters",
      message: "Are you sure you want to reset all filters to default?",
      onConfirm: () => {
        resetFilters();
        console.log("Filters reset to default");
      },
    });
  };

  // Handle back from specialized views
  const handleBackFromView = () => {
    setCurrentView("scanner");
  };

  // Handle watchlist save
  const handleWatchlistSave = (watchlist: { name: string; indices: string[] }) => {
    addWatchlist(watchlist);
  };

  // Toggle dilution column with keyboard
  const handleToggleDilution = useCallback(() => {
    setShowDilution((prev) => !prev);
  }, [setShowDilution]);

  // Define keyboard shortcuts
  const shortcuts = [
    {
      key: "n",
      ctrlKey: true,
      action: handleNewWatchlist,
      description: "Create new watchlist",
    },
    {
      key: "b",
      ctrlKey: true,
      action: handleBlancWithConfirm,
      description: "Reset all filters",
    },
    {
      key: "Escape",
      action: handleCancelWithConfirm,
      description: "Cancel current operation",
    },
    {
      key: "r",
      ctrlKey: true,
      action: refreshData,
      description: "Refresh data",
    },
    {
      key: "l",
      ctrlKey: true,
      action: toggleRealTimeUpdates,
      description: "Toggle live updates",
    },
    {
      key: "1",
      action: handleScannerView,
      description: "Scanner view",
    },
    {
      key: "2",
      action: handleDilutionView,
      description: "Dilution view (if ticker selected)",
    },
    {
      key: "3",
      action: handleMoversView,
      description: "Gap movers",
    },
    {
      key: "4",
      action: handleSignalsView,
      description: "Strategy signals",
    },
    {
      key: "5",
      action: handleAlertsView,
      description: "Alerts",
    },
    {
      key: "6",
      action: handleHeatmapView,
      description: "Gap heatmap (if ticker selected)",
    },
    {
      key: "g",
      action: handleScannerView,
      description: "Scanner: GAP mode",
    },
    {
      key: "d",
      action: handleToggleDilution,
      description: "Toggle dilution column",
    },
    {
      key: "?",
      action: handleHelpClick,
      description: "Show keyboard shortcuts",
    },
  ];

  // Render views based on currentView
  if (currentView === "dilution") {
    return (
      <TerminalLayout shortcuts={shortcuts}>
        <TerminalHeader
          isDarkMode={isDarkMode}
          onCancelClick={handleCancelWithConfirm}
          onNewClick={handleNewWatchlist}
          onBlancClick={handleBlancWithConfirm}
          onScannerClick={handleScannerView}
          onDilutionClick={handleDilutionView}
          onMoversClick={handleMoversView}
          onSignalsClick={handleSignalsView}
          onAlertsClick={handleAlertsView}
          onHeatmapClick={handleHeatmapView}
          onHelpClick={handleHelpClick}
          onThemeToggle={handleThemeToggle}
        />
        <DilutionView isDarkMode={isDarkMode} />
      </TerminalLayout>
    );
  }

  if (currentView === "heatmap") {
    return (
      <TerminalLayout shortcuts={shortcuts}>
        <TerminalHeader
          isDarkMode={isDarkMode}
          onCancelClick={handleCancelWithConfirm}
          onNewClick={handleNewWatchlist}
          onBlancClick={handleBlancWithConfirm}
          onScannerClick={handleScannerView}
          onDilutionClick={handleDilutionView}
          onMoversClick={handleMoversView}
          onSignalsClick={handleSignalsView}
          onAlertsClick={handleAlertsView}
          onHeatmapClick={handleHeatmapView}
          onHelpClick={handleHelpClick}
          onThemeToggle={handleThemeToggle}
        />
        <GapHeatmapView isDarkMode={isDarkMode} />
      </TerminalLayout>
    );
  }

  if (currentView === "signals") {
    return (
      <TerminalLayout shortcuts={shortcuts}>
        <TerminalHeader
          isDarkMode={isDarkMode}
          onCancelClick={handleCancelWithConfirm}
          onNewClick={handleNewWatchlist}
          onBlancClick={handleBlancWithConfirm}
          onScannerClick={handleScannerView}
          onDilutionClick={handleDilutionView}
          onMoversClick={handleMoversView}
          onSignalsClick={handleSignalsView}
          onAlertsClick={handleAlertsView}
          onHeatmapClick={handleHeatmapView}
          onHelpClick={handleHelpClick}
          onThemeToggle={handleThemeToggle}
        />
        <StrategySignalsView isDarkMode={isDarkMode} />
      </TerminalLayout>
    );
  }

  if (currentView === "alerts") {
    return (
      <TerminalLayout shortcuts={shortcuts}>
        <TerminalHeader
          isDarkMode={isDarkMode}
          onCancelClick={handleCancelWithConfirm}
          onNewClick={handleNewWatchlist}
          onBlancClick={handleBlancWithConfirm}
          onScannerClick={handleScannerView}
          onDilutionClick={handleDilutionView}
          onMoversClick={handleMoversView}
          onSignalsClick={handleSignalsView}
          onAlertsClick={handleAlertsView}
          onHeatmapClick={handleHeatmapView}
          onHelpClick={handleHelpClick}
          onThemeToggle={handleThemeToggle}
        />
        <AlertsView isDarkMode={isDarkMode} />
      </TerminalLayout>
    );
  }

  if (currentView === "news") {
    return (
      <TerminalLayout shortcuts={shortcuts}>
        <NewsView isDarkMode={isDarkMode} onBack={handleBackFromView} />
      </TerminalLayout>
    );
  }

  if (currentView === "movers") {
    return (
      <TerminalLayout shortcuts={shortcuts}>
        <TerminalHeader
          isDarkMode={isDarkMode}
          onCancelClick={handleCancelWithConfirm}
          onNewClick={handleNewWatchlist}
          onBlancClick={handleBlancWithConfirm}
          onScannerClick={handleScannerView}
          onDilutionClick={handleDilutionView}
          onMoversClick={handleMoversView}
          onSignalsClick={handleSignalsView}
          onAlertsClick={handleAlertsView}
          onHeatmapClick={handleHeatmapView}
          onHelpClick={handleHelpClick}
          onThemeToggle={handleThemeToggle}
        />
        <MarketMoversView
          isDarkMode={isDarkMode}
          onBack={handleBackFromView}
          marketData={data}
          onRefresh={refreshData}
          isLoading={isLoading}
        />
      </TerminalLayout>
    );
  }

  if (currentView === "volatility") {
    return (
      <TerminalLayout shortcuts={shortcuts}>
        <VolatilityView
          isDarkMode={isDarkMode}
          onBack={handleBackFromView}
          marketData={data}
          onRefresh={refreshData}
          isLoading={isLoading}
        />
      </TerminalLayout>
    );
  }

  if (currentView === "rmi") {
    return (
      <TerminalLayout shortcuts={shortcuts}>
        <RmiView />
      </TerminalLayout>
    );
  }

  // Default: Scanner view (or legacy market view)
  return (
    <TerminalLayout shortcuts={shortcuts}>
      <TerminalHeader
        isDarkMode={isDarkMode}
        onCancelClick={handleCancelWithConfirm}
        onNewClick={handleNewWatchlist}
        onBlancClick={handleBlancWithConfirm}
        onScannerClick={handleScannerView}
        onDilutionClick={handleDilutionView}
        onMoversClick={handleMoversView}
        onSignalsClick={handleSignalsView}
        onAlertsClick={handleAlertsView}
        onHeatmapClick={handleHeatmapView}
        onHelpClick={handleHelpClick}
        onThemeToggle={handleThemeToggle}
      />

      <TerminalFilterBar isDarkMode={isDarkMode} />

      <ScannerView isDarkMode={isDarkMode} />

      {/* Modals */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmAndCloseModal}
        title={confirmModalProps.title}
        message={confirmModalProps.message}
        isDarkMode={isDarkMode}
      />

      <Watchlist
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        isDarkMode={isDarkMode}
        marketIndices={allMarketIndices()}
        onSave={handleWatchlistSave}
      />

      <ShortcutsHelp
        shortcuts={shortcuts}
        isOpen={isShortcutsHelpOpen}
        onClose={() => setIsShortcutsHelpOpen(false)}
        isDarkMode={isDarkMode}
      />
    </TerminalLayout>
  );
}

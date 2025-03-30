/**
 * Utility to synchronize layout changes between components
 */

// Create a custom event to communicate layout changes
export const emitLayoutChange = (data) => {
  const event = new CustomEvent('layoutChange', { detail: data });
  document.dispatchEvent(event);
};

// Helper to add a layout change listener
export const addLayoutChangeListener = (callback) => {
  document.addEventListener('layoutChange', (e) => callback(e.detail));
  return () => document.removeEventListener('layoutChange', callback);
};

// Force a layout recalculation
export const forceLayoutRecalculation = () => {
  // Add no-transition class
  document.body.classList.add('no-transition');
  
  // Force a layout recalculation
  void document.body.offsetHeight;
  
  // Trigger a resize event
  window.dispatchEvent(new Event('resize'));
  
  // Remove the no-transition class after a short delay
  setTimeout(() => {
    document.body.classList.remove('no-transition');
  }, 50);
};

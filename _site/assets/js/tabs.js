// Tab navigation functionality
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('[role="tab"]');
  const panels = document.querySelectorAll('[role="tabpanel"]');

  // Handle keyboard navigation
  function switchTab(oldTab, newTab) {
    newTab.focus();
    newTab.setAttribute('aria-selected', 'true');
    oldTab.setAttribute('aria-selected', 'false');
    oldTab.focus();
    
    // Show the associated panel
    const newPanelId = newTab.getAttribute('aria-controls');
    const newPanel = document.getElementById(newPanelId);
    
    // Hide all panels
    panels.forEach(panel => {
      panel.hidden = true;
    });
    
    // Show the selected panel
    newPanel.hidden = false;
  }

  // Add keyboard event handlers
  tabs.forEach(tab => {
    tab.addEventListener('click', e => {
      const currentTab = e.currentTarget;
      
      // Deselect all tabs
      tabs.forEach(tab => {
        tab.setAttribute('aria-selected', 'false');
      });
      
      // Select clicked tab
      currentTab.setAttribute('aria-selected', 'true');
      
      // Show associated panel
      const panelId = currentTab.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      
      // Hide all panels
      panels.forEach(panel => {
        panel.hidden = true;
      });
      
      // Show selected panel
      panel.hidden = false;
    });

    tab.addEventListener('keydown', e => {
      const targetTab = e.currentTarget;
      const tabArray = Array.from(tabs);
      const index = tabArray.indexOf(targetTab);

      let newTab;
      
      // Move right
      if (e.keyCode === 39 || e.keyCode === 37) {
        if (e.keyCode === 39) {
          newTab = tabArray[index + 1] || tabArray[0];
        } else {
          newTab = tabArray[index - 1] || tabArray[tabArray.length - 1];
        }
        
        switchTab(targetTab, newTab);
      }
    });
  });

  // Show initial panel
  const activeTab = document.querySelector('[role="tab"][aria-selected="true"]');
  const activePanel = document.getElementById(activeTab.getAttribute('aria-controls'));
  activePanel.hidden = false;
});
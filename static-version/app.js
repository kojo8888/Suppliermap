// Supplier Map - Plain JS Version

(function() {
  'use strict';

  // Configuration
  var CONFIG = {
    center: [50, 10],  // Europe
    zoom: 4,
    dataUrl: 'data/suppliers.json'
  };

  // State
  var map;
  var clusterGroup;
  var allSuppliers = [];
  var markers = [];

  // Custom marker icons
  var supplierIcon = L.divIcon({
    className: 'custom-marker',
    html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36"><path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24c0-6.6-5.4-12-12-12z" fill="#2563eb"/><circle cx="12" cy="12" r="5" fill="#ffffff"/></svg>',
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36]
  });

  var subSupplierIcon = L.divIcon({
    className: 'custom-marker',
    html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36"><path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24c0-6.6-5.4-12-12-12z" fill="#ea580c"/><circle cx="12" cy="12" r="5" fill="#ffffff"/></svg>',
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36]
  });

  // Initialize map
  function initMap() {
    map = L.map('map').setView(CONFIG.center, CONFIG.zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    clusterGroup = L.markerClusterGroup({
      chunkedLoading: true
    });
    map.addLayer(clusterGroup);
  }

  // Create popup content
  function createPopup(supplier) {
    var badgeClass = supplier.type === 'supplier' ? 'supplier' : 'sub-supplier';
    var badgeText = supplier.type === 'supplier' ? 'Supplier' : 'Sub-supplier';

    return '<div>' +
      '<div class="popup-name">' + escapeHtml(supplier.name) + '</div>' +
      '<div class="popup-address">' + escapeHtml(supplier.address) + '</div>' +
      '<span class="popup-badge ' + badgeClass + '">' + badgeText + '</span>' +
      '</div>';
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Add markers to map
  function updateMarkers() {
    var showSuppliers = document.getElementById('filter-suppliers').checked;
    var showSubSuppliers = document.getElementById('filter-sub-suppliers').checked;

    clusterGroup.clearLayers();
    markers = [];

    allSuppliers.forEach(function(supplier) {
      if (supplier.type === 'supplier' && !showSuppliers) return;
      if (supplier.type === 'sub-supplier' && !showSubSuppliers) return;

      var icon = supplier.type === 'supplier' ? supplierIcon : subSupplierIcon;
      var marker = L.marker([supplier.lat, supplier.lng], { icon: icon });
      marker.bindPopup(createPopup(supplier));
      markers.push(marker);
    });

    clusterGroup.addLayers(markers);
  }

  // Load supplier data
  function loadData() {
    fetch(CONFIG.dataUrl)
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Failed to load data: ' + response.status);
        }
        return response.json();
      })
      .then(function(data) {
        allSuppliers = data;
        hideLoading();
        updateMarkers();
      })
      .catch(function(error) {
        showError(error.message);
      });
  }

  // UI helpers
  function hideLoading() {
    var el = document.getElementById('loading');
    if (el) el.style.display = 'none';
  }

  function showError(message) {
    var loadingEl = document.getElementById('loading');
    if (loadingEl) loadingEl.style.display = 'none';

    var mapEl = document.getElementById('map');
    var errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.innerHTML = '<h2>Error</h2><p>' + escapeHtml(message) + '</p>';
    mapEl.appendChild(errorDiv);
  }

  // Set up filter listeners
  function setupFilters() {
    document.getElementById('filter-suppliers').addEventListener('change', updateMarkers);
    document.getElementById('filter-sub-suppliers').addEventListener('change', updateMarkers);
  }

  // Initialize
  function init() {
    initMap();
    setupFilters();
    loadData();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

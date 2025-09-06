// src/utils/leafletSetup.js
// Bu faylni App.js yoki index.js da import qiling

import L from "leaflet";

// Leaflet CSS import (agar index.html da qo'shilmagan bo'lsa)
import "leaflet/dist/leaflet.css";

// Default icon URLs
const iconRetinaUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png";
const iconUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png";
const shadowUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png";

// Global Leaflet setup
export const setupLeaflet = () => {
  try {
    // Eski icon URL methodini o'chirish
    if (L.Icon.Default.prototype._getIconUrl) {
      delete L.Icon.Default.prototype._getIconUrl;
    }

    // Yangi icon URLs ni o'rnatish
    L.Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
    });

    console.log("✅ Leaflet setup completed successfully");
    console.log("🔗 Icon URLs:", { iconUrl, iconRetinaUrl, shadowUrl });

    return true;
  } catch (error) {
    console.error("❌ Leaflet setup failed:", error);
    return false;
  }
};

// Leaflet yuklanganligini tekshirish
export const checkLeafletLoaded = () => {
  if (typeof L === "undefined") {
    console.error("❌ Leaflet library is not loaded");
    return false;
  }

  if (!L.Icon || !L.Icon.Default) {
    console.error("❌ Leaflet Icon classes are not available");
    return false;
  }

  console.log("✅ Leaflet is properly loaded");
  return true;
};

// Automatic setup when file is imported
if (checkLeafletLoaded()) {
  setupLeaflet();
}

export { L };

export function convertLocations(data) {
  console.log("🗺️ Converting locations, input data:", data);

  // Ma'lumotlar mavjudligini tekshirish
  if (!data || !Array.isArray(data)) {
    console.warn("⚠️ Invalid data for conversion - not an array:", data);
    return [];
  }

  if (data.length === 0) {
    console.warn("⚠️ Empty data array for conversion");
    return [];
  }

  const converted = data
    .map((item, index) => {
      console.log(`🔍 Processing item ${index}:`, item);

      // Asosiy maydonlar mavjudligini tekshirish
      if (!item) {
        console.warn(`❌ Item ${index} is null or undefined`);
        return null;
      }

      if (!item.location) {
        console.warn(`❌ Item ${index} missing location:`, item);
        return null;
      }

      if (!item.location.lat || !item.location.long) {
        console.warn(`❌ Item ${index} missing lat/long:`, item.location);
        return null;
      }

      // Koordinatalarni parse qilish
      const lat = parseFloat(item.location.lat);
      const long = parseFloat(item.location.long);

      if (isNaN(lat) || isNaN(long)) {
        console.warn(`❌ Item ${index} invalid coordinates:`, {
          lat: item.location.lat,
          long: item.location.long,
          parsedLat: lat,
          parsedLong: long,
        });
        return null;
      }

      // Koordinatalar mantiqiy diapazonlarda ekanligini tekshirish
      if (lat < -90 || lat > 90 || long < -180 || long > 180) {
        console.warn(`❌ Item ${index} coordinates out of range:`, {
          lat,
          long,
        });
        return null;
      }

      // Status asosida rang va icon aniqlash
      let color = "#808080"; // Default rang
      let icon = "❓"; // Default icon

      switch (item.status) {
        case "red":
          color = "#FF512F";
          icon = "🏠";
          break;
        case "yellow":
          color = "#FFC837";
          icon = "🏡";
          break;
        case "green":
          color = "#24FE41";
          icon = "🏘️";
          break;
        case "blue":
        case "Being checked":
          color = "#42A5F5";
          icon = "🔍";
          break;
        default:
          console.warn(`⚠️ Item ${index} unknown status:`, item.status);
          color = "#808080";
          icon = "🏠";
      }

      const result = {
        coords: [lat, long],
        color: color,
        icon: icon,
        appartmentId: item._id,
        status: item.status,
        studentId: item.studentId || null,
      };

      console.log(`✅ Converted item ${index}:`, result);
      return result;
    })
    .filter(Boolean); // null qiymatlarni olib tashlash

  console.log("🎯 Final converted data:", converted);
  console.log(
    `📊 Converted ${converted.length} items from ${data.length} original items`
  );

  // Agar hech qanday marker convert bo'lmagan bo'lsa, test marker qo'shamiz
  if (converted.length === 0) {
    console.warn("⚠️ No valid markers found, adding test marker for Nukus");
    return [
      {
        coords: [42.46, 59.61], // Nukus koordinatalari
        color: "#42A5F5",
        icon: "🏠",
        appartmentId: "test-marker",
        status: "test",
        studentId: null,
      },
    ];
  }

  return converted;
}

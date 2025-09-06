export function convertLocations(data) {
  console.log("Converting locations, input data:", data);

  // Ma'lumotlar mavjudligini tekshirish
  if (!data || !Array.isArray(data)) {
    console.warn("Invalid data for conversion - not an array:", data);
    return [];
  }

  if (data.length === 0) {
    console.warn("Empty data array for conversion");
    return [];
  }

  const converted = data
    .map((item, index) => {
      console.log(`Processing item ${index}:`, item);

      // Asosiy maydonlar mavjudligini tekshirish
      if (!item) {
        console.warn(`Item ${index} is null or undefined`);
        return null;
      }

      if (!item.location) {
        console.warn(`Item ${index} missing location:`, item);
        return null;
      }

      if (!item.location.lat || !item.location.long) {
        console.warn(`Item ${index} missing lat/long:`, item.location);
        return null;
      }

      // Koordinatalarni parse qilish
      const lat = parseFloat(item.location.lat);
      const long = parseFloat(item.location.long);

      if (isNaN(lat) || isNaN(long)) {
        console.warn(`Item ${index} invalid coordinates:`, {
          lat: item.location.lat,
          long: item.location.long,
        });
        return null;
      }

      // Status asosida rang aniqlash
      let color = "#808080"; // Default rang
      switch (item.status) {
        case "red":
          color = "#FF512F";
          break;
        case "yellow":
          color = "#FFC837";
          break;
        case "green":
          color = "#24FE41";
          break;
        default:
          console.warn(`Item ${index} unknown status:`, item.status);
      }

      const result = {
        coords: [lat, long],
        color: color,
        icon: "👨‍🎓",
        appartmentId: item._id,
        status: item.status,
      };

      console.log(`Converted item ${index}:`, result);
      return result;
    })
    .filter(Boolean); // null qiymatlarni olib tashlash

  console.log("Final converted data:", converted);
  console.log(
    `Converted ${converted.length} items from ${data.length} original items`
  );

  return converted;
}

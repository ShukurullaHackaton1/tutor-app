export function convertLocations(data) {
  return data.map((item) => ({
    coords: [parseFloat(item.location.lat), parseFloat(item.location.long)],
    color:
      (item.status == "red" && "#FF512F") ||
      (item.status == "yellow" && "#FFC837") ||
      (item.status == "green" && "#24FE41"), // Rangni o'zgartirish mumkin
    icon: "👨‍🎓",
    appartmentId: item._id,
  }));
}

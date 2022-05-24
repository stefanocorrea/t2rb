export function convertRGBToHex(r, g, b) {
  return (
    "#" +
    ((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b))
      .toString(16)
      .slice(1)
  );
}

export function convertHexToName(hex) {
  let $name;
  switch (hex) {
    case "#FF0000":
      $name = "Red";
      break;
    default:
      $name = false;
  }

  return $name;
}

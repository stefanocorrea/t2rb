export function getMusicalKey(val) {
  if (!val) return false;
  switch (val.toUpperCase()) {
    case "12D":
      val = "F";
      break;
    case "12M":
      val = "Dm";
      break;
    case "1D":
      val = "C";
      break;
    case "1M":
      val = "Am";
      break;
    case "2D":
      val = "G";
      break;
    case "2M":
      val = "Em";
      break;
    case "3D":
      val = "D";
      break;
    case "3M":
      val = "Bm";
      break;
    case "4D":
      val = "A";
      break;
    case "4M":
      val = "F#m";
      break;
    case "5D":
      val = "E";
      break;
    case "5M":
      val = "C#m";
      break;
    case "6D":
      val = "B";
      break;
    case "6M":
      val = "G#m";
      break;
    case "7D":
      val = "F#";
      break;
    case "7M":
      val = "D#m";
      break;
    case "8D":
      val = "C#";
      break;
    case "8M":
      val = "A#m";
      break;
    case "9D":
      val = "G#";
      break;
    case "9M":
      val = "Fm";
      break;
    case "10D":
      val = "D#";
      break;
    case "10M":
      val = "Cm";
      break;
    case "11D":
      val = "A#";
      break;
    case "11M":
      val = "Gm";
      break;

    default:
      val = null;
  }
  return val;
}

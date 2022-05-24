export function getOpenKey(val) {
  if (!val) return null
  switch (val.toUpperCase()) {
    case 'F':
      val = '12d'
      break
    case 'DM':
      val = '12m'
      break
    case 'C':
      val = '1d'
      break
    case 'AM':
      val = '1m'
      break
    case 'G':
      val = '2d'
      break
    case 'EM':
      val = '2m'
      break
    case 'D':
      val = '3d'
      break
    case 'BM':
      val = '3m'
      break
    case 'A':
      val = '4d'
      break
    case 'F#M':
    case 'GBM':
      val = '4m'
      break
    case 'E':
      val = '5d'
      break
    case 'C#M':
    case 'DBM':
      val = '5m'
      break
    case 'B':
      val = '6d'
      break
    case 'G#M':
    case 'ABM':
      val = '6m'
      break
    case 'F#':
      val = '7d'
      break
    case 'D#M':
    case 'EBM':
      val = '7m'
      break
    case 'C#':
      val = '8d'
      break
    case 'A#M':
    case 'BDM':
      val = '8m'
      break
    case 'G#':
      val = '9d'
      break
    case 'FM':
      val = '9m'
      break
    case 'D#':
      val = '10d'
      break
    case 'CM':
      val = '10m'
      break
    case 'A#':
      val = '11d'
      break
    case 'GM':
      val = '11m'
      break

    default:
      val = null
  }
  return val
}

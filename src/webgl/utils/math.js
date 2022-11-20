
const toRad = Math.PI / 180

function sphericalToCartesian (r, t, p) {
  return {
    x: r * Math.sin(p) * Math.cos(t),
    y: r * Math.sin(p) * Math.sin(t),
    z: r * Math.cos(p)
  }
}

function clamp (n, min, max) {
  return Math.min(Math.max(n, min), max)
}

function distance (x1, y1, x2, y2) {
  const x = x2 - x1
  const y = y2 - y1
  return Math.abs(Math.sqrt(x*x + y*y))
}


export {
  toRad,
  sphericalToCartesian,
  clamp,
  distance
}

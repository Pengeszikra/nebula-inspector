export default ({loader}) =>
  loader
    .add([
      './images/twin-moons.png',
      './images/gun-pod.png',
      './images/nbi-sprite-sheet.png',
      './images/nb-texture-1.png',
      './images/nebula-splash.jpg',
      './images/nebula-splash-with-action.jpg',
    ])
    .add('nbi','./images/nbi-sprite-sheet-1.json')
    .add('explosion','./images/explosion.json')

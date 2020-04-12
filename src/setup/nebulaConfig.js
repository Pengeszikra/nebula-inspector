import nebulaAssetsLoading from "./nebulaAssetsLoading";

export const nebulaConfig = {
  pixiConfig : { width: 800, height: 600 },
  loaderFrom: nebulaAssetsLoading,
  getRoot: () => document.getElementById('pixi'),
  autoAdd: true
}
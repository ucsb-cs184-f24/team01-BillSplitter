export const loadAsync = jest.fn();
export const isLoaded = jest.fn().mockReturnValue(true);
export const unloadAsync = jest.fn();
export const FontDisplay = {
  AUTO: 'auto',
  BLOCK: 'block',
  SWAP: 'swap',
  FALLBACK: 'fallback',
  OPTIONAL: 'optional',
};
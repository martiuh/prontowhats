type IsDevEnv = {
  defined: boolean;
  value: any;
};
/**
 * Validate if dev exclusive env variables are available
 */
export function isDevEnv(VARIABLE: any): IsDevEnv {
  const defined = typeof VARIABLE !== 'undefined';
  const value = Boolean(VARIABLE);

  return {
    defined,
    value,
  };
}

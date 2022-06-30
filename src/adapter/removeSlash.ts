export const removeSlash = (urlToken: any) => {
  if (typeof urlToken !== 'string') {
    return urlToken;
  }
  const end = urlToken.slice(-1);
  if (end === '/') {
    return urlToken.slice(0, -1);
  }
  return urlToken;
};
export const userNameIsValid = (userName: any) => {
  if (typeof userName !== 'string') {
    return false;
  }
  if (userName.length < 1 || userName.length > 30) {
    return false;
  }
  return true;
};

export const passwordIdValid = (password: any) => {
  if (typeof password !== 'string') {
    return false;
  }
  if (!/[a-zA-Z0-9]{8,64}/.test(password)) {
    return false;
  }
  return true;
};

export const emailIsValid = (email: any) => {
  if (typeof email !== 'string') {
    return false;
  }

  const html5EmailRegExp =
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  const isValid = html5EmailRegExp.test(email);

  if (isValid) {
    return true;
  }

  return false;
};

export const urlTokenIsValid = (urlToken: any) => {
  if (typeof urlToken !== 'string') {
    return false;
  }

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(urlToken);

  if (isUUID) {
    return true;
  }
  
  return false;
}

const PARAMS_REGEX = /:([A-Za-z]+)/g;

export default (req, params = {}) => {
  const paramsMatch = req.rawPath.match(PARAMS_REGEX);

  if (paramsMatch && paramsMatch.length > 0) {
    for (let i = 0, len = paramsMatch.length; i < len; i++) {
      const name = paramsMatch[i];
      params[name.substr(1)] = req.getParameter(i);
    }
  }

  return params;
};
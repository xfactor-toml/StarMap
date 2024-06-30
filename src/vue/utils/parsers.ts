export function getQueryParam(param, url) {
    const urlParams = new URLSearchParams(url);
    return urlParams.get(param);
  }
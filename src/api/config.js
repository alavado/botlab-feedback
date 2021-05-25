export const API_ROOT = window.location.href.indexOf('dev') > 0
  ? 'https://api.dev.botlab.cl'
  : window.location.href.indexOf('qa') > 0
    ? 'https://api.qa.botlab.cl' :
      window.location.href.indexOf('localhost') > 0
        ? 'https://api.qa.botlab.cl'
        : 'https://api.botlab.cl'
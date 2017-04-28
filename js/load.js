'use strict';

window.ajax = (function () {
  function showError(text) {
    var error = document.createElement('div');
    error.style.background = 'white';
    error.style.position = 'absolute';
    error.padding = '20px';
    error.style.left = '100px';
    error.style.top = '100px';
    error.textContent = text;

    document.body.appendChild(error);
  }

  function load(url, contentLoadedHandler) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.send(); // (1)

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.status !== 200) {
        showError(xhr.status + ': ' + xhr.statusText);
      } else {
        contentLoadedHandler(JSON.parse(xhr.responseText));
      }
    };
  }

  return {
    'load': load
  };

})();

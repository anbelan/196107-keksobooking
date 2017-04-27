/**
 * Created by annabelan on 27.04.17.
 */
'use strict';

window.load = (function () {
  function showError(text) {
    var error = document.createElement('div');
    error.style.background = 'white';
    error.style.position = 'absolute';
    error.style.left = '100px';
    error.style.top = '100px';
    error.textContent = text;

    document.body.appendChild(error);
  }

  function load(url, onload) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.send(); // (1)

    xhr.onreadystatechange = function() { // (3)
      if (xhr.readyState != 4) return;

      if (xhr.status != 200) {
        showError(xhr.status + ': ' + xhr.statusText);
      } else {
        onload(JSON.parse(xhr.responseText));
      }
    }
  }

  return {
    'load': load
  };

})();

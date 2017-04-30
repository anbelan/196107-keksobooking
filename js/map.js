'use strict';

window.map = (function () {

  function fillMap(ads) {
    var pinElements = document.querySelectorAll('.pin:not(.pin__main)');
    for (var i = 0; i < pinElements.length; i++) {
      pinElements[i].remove();
    }
    var mapElement = document.querySelector('.tokyo__pin-map');
    var fragment = document.createDocumentFragment();
    for (i = 0; i < ads.length; i++) {
      ads[i].data = {
        number: i
      };
      var markerPin = window.data.substituteTemplate(window.card.getTemplate('marker.template'), ads[i]);
      var div = document.createElement('div');
      div.innerHTML = markerPin;
      var currentPin = div.childNodes[1];
      currentPin.advertismentData = ads[i];
      fragment.appendChild(currentPin);
      currentPin.addEventListener('click', function (pin) {
        return function () {
          if (!pin.dataset.hasOwnProperty('addNumber')) {
            return;  // do nothing
          }
          window.pin.makePinActive(pin);
          window.showCard.fillDialog(ads[pin.dataset.addNumber]);
        };
      }(currentPin));
      currentPin.addEventListener('focus', function (pin) {
        return function () {
          window.pin.makePinActive(pin);
        };
      }(currentPin));
      currentPin.addEventListener('keydown', function (pin) {
        return function (evt) {
          if (evt.keyCode === 13) {
            window.showCard.fillDialog(ads[pin.dataset.addNumber]);
          } else if (evt.keyCode === 27) {
            window.card.closeDialog();
          }
        };
      }(currentPin));
    }
    mapElement.appendChild(fragment);
  }

  fillMap(window.data.ad);

  window.ajax.load('https://intensive-javascript-server-kjgvxfepjl.now.sh/keksobooking/data', fillMap);

})();

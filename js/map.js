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
      var ENTER_KEY_NUMBER = 13;
      var ESC_KEY_NUMBER = 27;
      currentPin.addEventListener('keydown', function (pin) {
        return function (evt) {
          if (evt.keyCode === ENTER_KEY_NUMBER) {
            window.showCard.fillDialog(ads[pin.dataset.addNumber]);
          } else if (evt.keyCode === ESC_KEY_NUMBER) {
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

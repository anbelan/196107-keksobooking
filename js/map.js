'use strict';

window.map = (function () {

  function generatePin(advertisment, index) {
    advertisment.data = {
      number: index
    };
    var markerPin = window.data.substituteTemplate(window.card.getTemplate('marker.template'), advertisment);
    var div = document.createElement('div');
    div.innerHTML = markerPin;
    var currentPin = div.childNodes[1];
    currentPin.advertismentData = advertisment;
    currentPin.addEventListener('click', function (pin) {
      return function () {
        if (!pin.dataset.hasOwnProperty('addNumber')) {
          return;  // do nothing
        }
        window.pin.makePinActive(pin);
        window.showCard.fillDialog(advertisment);
      };
    }(currentPin));
    currentPin.addEventListener('focus', function (pin) {
      return function () {
        window.pin.makePinActive(pin);
      };
    }(currentPin));
    var ENTER_KEY_NUMBER = 13;
    var ESC_KEY_NUMBER = 27;
    currentPin.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEY_NUMBER) {
        window.showCard.fillDialog(advertisment);
      } else if (evt.keyCode === ESC_KEY_NUMBER) {
        window.card.closeDialog();
      }
    });
    return currentPin;
  }

  function fillMap(ads) {
    var pinElements = document.querySelectorAll('.pin:not(.pin__main)');
    for (var i = 0; i < pinElements.length; i++) {
      pinElements[i].remove();
    }
    var mapElement = document.querySelector('.tokyo__pin-map');
    var fragment = document.createDocumentFragment();
    var randomIndexes = [];
    var currentNumber;
    while (randomIndexes.length < 3) {
      currentNumber = window.data.generateRandomInt(0, ads.length - 1);
      if (randomIndexes.indexOf(currentNumber) === -1) {
        randomIndexes.push(currentNumber);
      }
    }
    var pinsToShow = window.pin.hidePins(ads
      .map(generatePin).map(function (pin) {
        fragment.appendChild(pin);
        return pin;
      }))
      .filter(function (pin, index) {
        return randomIndexes.indexOf(index) > -1;
      });
    window.pin.showPins(pinsToShow);
    mapElement.appendChild(fragment);
  }

  window.ajax.load('https://intensive-javascript-server-kjgvxfepjl.now.sh/keksobooking/data', fillMap);

})();

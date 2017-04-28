'use strict';

window.map = (function () {

  function fillMap(ads) {
    var pinElements = document.querySelectorAll('.pin:not(.pin__main)');
    for (var i = 0; i < pinElements.length; i++) {
      pinElements[i].remove();
    }
    var mapElement = document.querySelector('.tokyo__pin-map');
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < ads.length; i++) {
      ads[i].data = {
        number: i
      };
      var markerPin = data.substituteTemplate(card.getTemplate('marker.template'), ads[i]);
      var div = document.createElement('div');
      div.innerHTML = markerPin;
      var currentPin = div.childNodes[1];
      currentPin.advertismentData = ads[i];
      fragment.appendChild(currentPin);
      currentPin.addEventListener('click', function () {
        if (!this.dataset.addNumber) {
          return;
        }
        pin.makePinActive(this);
        showCard.fillDialog(ads[this.dataset.addNumber]);
      });
      currentPin.addEventListener('focus', function () {
        pin.makePinActive(this);
      });
      currentPin.addEventListener('keydown', function (evt) {
        if (evt.keyCode === 13) {
          showCard.fillDialog(ads[this.dataset.addNumber]);
        } else if (evt.keyCode === 27) {
          card.closeDialog();
        }
      });
    }
    mapElement.appendChild(fragment);
  };

  fillMap(data.ad);

  ajax.load('https://intensive-javascript-server-kjgvxfepjl.now.sh/keksobooking/data', fillMap);

})();

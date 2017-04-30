'use strict';

window.showCard = (function () {

  var DIALOG = document.querySelector('#offer-dialog');
  var LODGE_TEMPLATE = document.querySelector('#lodge-template').content;

  function fillDialog(advertisment) {
    var dialogPanelElements = LODGE_TEMPLATE.cloneNode(true);
    var dialogPanel = document.querySelector('.dialog__panel');
    dialogPanelElements.querySelector('.lodge__title').textContent = advertisment.offer.title;
    dialogPanelElements.querySelector('.lodge__address').textContent = advertisment.offer.address;
    dialogPanelElements.querySelector('.lodge__price').innerHTML = advertisment.offer.price + '&#x20bd;/ночь';
    dialogPanelElements.querySelector('.lodge__type').textContent = {
      'flat': 'Квартира',
      'bungalo': 'Бунгало',
      'house': 'Дом'
    }[advertisment.offer.type];
    dialogPanelElements.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + advertisment.offer.guests + ' гостей в ' + advertisment.offer.rooms + ' комнатах';
    dialogPanelElements.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + advertisment.offer.checkin + ', выезд до ' + advertisment.offer.checkout;
    var features = advertisment.offer.features.map(function (feature) {
      return '<span class="feature__image feature__image--' + feature + '"></span>';
    }).join('');
    dialogPanelElements.querySelector('.lodge__features').innerHTML = features;

    dialogPanelElements.querySelector('.lodge__description').textContent = advertisment.offer.description;

    document.querySelector('.dialog__title').children[0].setAttribute('src', advertisment.author.avatar);

    DIALOG.replaceChild(dialogPanelElements, dialogPanel);
    document.getElementById('offer-dialog').style.display = 'block';
  }

  return {
    'fillDialog': fillDialog
  };

})();

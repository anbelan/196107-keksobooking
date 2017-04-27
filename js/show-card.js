/**
 * Created by annabelan on 27.04.17.
 */
'use strict';

window.showCard = (function () {

  var dialog = document.querySelector('#offer-dialog');
  var lodgeTemplate = document.querySelector('#lodge-template').content;

  var fillDialog = function fillDialog(advertisment) {
    var dialogPanelElements = lodgeTemplate.cloneNode(true);
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
    var features = '';
    for (var i = 0; i < advertisment.offer.features.length; i++) {
      features = features + '<span class = "feature__image feature__image--' + advertisment.offer.features[i] + '"></span>';
    }
    dialogPanelElements.querySelector('.lodge__features').innerHTML = features;

    dialogPanelElements.querySelector('.lodge__description').textContent = advertisment.offer.description;

    document.querySelector('.dialog__title').children[0].setAttribute('src', advertisment.author.avatar);

    dialog.replaceChild(dialogPanelElements, dialogPanel);
    document.getElementById('offer-dialog').style.display = 'block';
  }

  return {
    'fillDialog': fillDialog
  };

})();

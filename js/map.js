'use strict';

// задание 1
function generateRandomInt(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateObject(avatarNumber, offerTitle) {
	var location = {
		x: generateRandomInt(300, 900),
		y: generateRandomInt(100, 500),
	}
	return {
	  'author': {
	    'avatar': 'img/avatars/user' + avatarNumber + '.png'
	  },

	  'offer': {
	    'title': offerTitle,
	    'address': location.x + ', ' + location.y,
	    'price': generateRandomInt(1000, 1000000),
	    'type': ['flat', 'house', 'bungalo'][generateRandomInt(0, 2)],
	    'rooms': generateRandomInt(1, 5),
	    'guests': generateRandomInt (1, 15),
	    'checkin': ['12:00', '13:00', '14:00'][generateRandomInt(0, 2)],
	    'checkout': ['12:00', '13:00', '14:00'][generateRandomInt(0, 2)],
	    'features': ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'].slice(generateRandomInt(0, 5)),
	    'description': '',
	    'photos': []
	  },

	  'location': {
	    'x': location.x,
	    'y': location.y
	  }
	}
}

var ad = [];
var avatarNumbers = [];
while(avatarNumbers.length < 8) {
	var temp = '0' + generateRandomInt(1, 8);
	if(avatarNumbers.indexOf(temp) == -1) {
		avatarNumbers.push(temp)
	}
}
var offerTitles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
while(offerTitles.length < 8) {
	var temp = offerTitles[generateRandomInt(0, offerTitles.length - 1)];
	if(offerTitles.indexOf(temp) == -1) {
		offerTitles.push(temp)
	}
}
for (var i = 0; i < 8; i++) {
	ad.push(generateObject(avatarNumbers[i], offerTitles[i]))
}
console.log(ad);
// задание 2, 3
var pin = [];
var marker = document.querySelector('.tokyo__pin-map');
var fragment = document.createDocumentFragment();
for (var i = 0; i < 8; i++) {
	var markerPin = document.createElement('div');
	markerPin.className = 'pin';
	markerPin.setAttribute ('style', 'left:' + (ad[i].location.x - 56 / 2) + 'px; top:' + (ad[i].location.y - 75) + 'px');
	markerPin.innerHTML = '<img src="' + ad[i].author.avatar + '" class="rounded" width="40" height="40">';
	marker.appendChild(markerPin);
	fragment.appendChild(markerPin);
	pin.push(fragment)
}

marker.appendChild(fragment);

// задание 4

var dialog = document.querySelector('#offer-dialog');

var dialogPanel = document.querySelector('.dialog__panel');
var lodgeTemplate = document.querySelector('#lodge-template').content;

var dialogPanelElements = lodgeTemplate.cloneNode(true);	
dialogPanelElements.querySelector('.lodge__title').textContent = ad[0].offer.title;
dialogPanelElements.querySelector('.lodge__address').textContent = ad[0].offer.address;
dialogPanelElements.querySelector('.lodge__price').innerHTML = ad[0].offer.price + '&#x20bd;/ночь';
dialogPanelElements.querySelector('.lodge__type').textContent = {'flat': 'Квартира', 'bungalo': 'Бунгало', 'house': 'Дом'}[ad[0].offer.type]; 
dialogPanelElements.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + ad[0].offer.guests + ' гостей в ' + ad[0].offer.rooms + ' комнатах';
dialogPanelElements.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + ad[0].offer.checkin + ', выезд до ' + ad[0].offer.checkout;
var features = '';
for (var i = 0; i < ad[i].offer.features.length; i++) {
	features = features + '<span class = "feature__image feature__image--' + ad[0].offer.features[i] + '"></span>';
}
dialogPanelElements.querySelector('.lodge__features').innerHTML = features;
		
dialogPanelElements.querySelector('.lodge__description').textContent = ad[0].offer.description;

document.querySelector('.dialog__title').children[0].setAttribute('src', ad[0].author.avatar);

dialog.replaceChild(dialogPanelElements, dialogPanel);

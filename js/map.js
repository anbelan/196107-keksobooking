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

function getTemplate(templateId) { 
  return document.getElementById(templateId).innerHTML 
}

function substituteTemplate(template, data) {
	var keys = Object.keys(data);
	for(var i = 0; i < keys.length; i++) {
		var attribute = data[keys[i]];
		var innerKeys = Object.keys(attribute);
		for(var j = 0; j < innerKeys.length; j++) {
			var value = attribute[innerKeys[j]];
			var placeholder = '{{' + keys[i] + '.' + innerKeys[j] + '}}';
			template = template.split(placeholder).join(value);
		}
	}
	return template;
}


// задание 2, 3
var marker = document.querySelector('.tokyo__pin-map');
var fragment = document.createDocumentFragment();

for (var i = 0; i < 8; i++) {
	ad[i].data = {
		number: i
	};
	var markerPin = substituteTemplate(getTemplate('marker.template'), ad[i]);
	var div = document.createElement('div');
	div.innerHTML = markerPin;
	var elements = div.childNodes;
	console.log(elements[1]);
	fragment.appendChild(elements[1]);
}

marker.appendChild(fragment);

function getTemplate(templateId) { 
  return document.getElementById(templateId).innerHTML 
}

// function substituteTemplate(template, data) { ... }

// задание 4

var dialog = document.querySelector('#offer-dialog');
var lodgeTemplate = document.querySelector('#lodge-template').content;

function fillDialog(advertisment) {
	var dialogPanelElements = lodgeTemplate.cloneNode(true);	
	var dialogPanel = document.querySelector('.dialog__panel');
	dialogPanelElements.querySelector('.lodge__title').textContent = advertisment.offer.title;
	dialogPanelElements.querySelector('.lodge__address').textContent = advertisment.offer.address;
	dialogPanelElements.querySelector('.lodge__price').innerHTML = advertisment.offer.price + '&#x20bd;/ночь';
	dialogPanelElements.querySelector('.lodge__type').textContent = {'flat': 'Квартира', 'bungalo': 'Бунгало', 'house': 'Дом'}[advertisment.offer.type]; 
	dialogPanelElements.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + advertisment.offer.guests + ' гостей в ' + advertisment.offer.rooms + ' комнатах';
	dialogPanelElements.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + advertisment.offer.checkin + ', выезд до ' + advertisment.offer.checkout;
	var features = '';
	for (var i = 0; i < ad[i].offer.features.length; i++) {
		features = features + '<span class = "feature__image feature__image--' + advertisment.offer.features[i] + '"></span>';
	}
	dialogPanelElements.querySelector('.lodge__features').innerHTML = features;
			
	dialogPanelElements.querySelector('.lodge__description').textContent = advertisment.offer.description;

	document.querySelector('.dialog__title').children[0].setAttribute('src', advertisment.author.avatar);

	dialog.replaceChild(dialogPanelElements, dialogPanel);
	document.getElementById('offer-dialog').style.display = 'block';
}

fillDialog(ad[0]);

// Задние #11

function deactivatePins(except) {
	var pinsActive = document.getElementsByClassName('pin--active');
		for(var j = 0; j < pinsActive.length; j++) {
			if(except != pinsActive[j]) {
				pinsActive[j].classList.remove('pin--active');
			}
		}
}

function makePinActive(pin) {
	deactivatePins(pin);
	pin.classList.add('pin--active');
}

function closeDialog() {
	document.getElementById('offer-dialog').style.display = 'none';
	deactivatePins(null);
}

var pins = document.getElementsByClassName('pin');
for(var i = 0; i < pins.length; i++) {
	var pin = pins[i];
	pin.addEventListener('click', function() {
		makePinActive(this);
		fillDialog(ad[this.dataset.addNumber]);
	});
	pin.addEventListener('focus', function() {
		makePinActive(this);
	});
	pin.addEventListener('keydown', function(evt) {
  		if (evt.keyCode === 13) {
    	fillDialog(ad[this.dataset.addNumber]);
  		} else if(evt.keyCode === 27) {
  			closeDialog();
  		}
	});
}

var dialogClose = document.querySelector('.dialog__close');
dialogClose.onclick = function() {
      closeDialog();
      return false;
    }
dialogClose.addEventListener('keydown', function(evt) {
  		if (evt.keyCode === 13) {
  			closeDialog();
  		}
});
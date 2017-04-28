'use strict';

window.data = (function () {

  function generateRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateObject(avatarNumber, offerTitle) {
    var location = {
      x: generateRandomInt(300, 900),
      y: generateRandomInt(100, 500)
    };
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
        'guests': generateRandomInt(1, 15),
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
    };
  }

  var NUMBER_OF_PINS = 3;

  function generateAds(quantity) {
    var avatarNumbers = [];
    while (avatarNumbers.length < quantity) {
      var temp = '0' + generateRandomInt(1, quantity);
      if (avatarNumbers.indexOf(temp) === -1) {
        avatarNumbers.push(temp);
      }
    }
    var offerTitles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
    while (offerTitles.length < quantity) {
      temp = offerTitles[generateRandomInt(0, offerTitles.length - 1)];
      if (offerTitles.indexOf(temp) === -1) {
        offerTitles.push(temp);
      }
    }
    var ad = [];
    for (var i = 0; i < quantity; i++) {
      ad.push(generateObject(avatarNumbers[i], offerTitles[i]));
    }
    return ad;
  }

  var ad = generateAds(NUMBER_OF_PINS);

  function substituteTemplate(template, data) {
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
      var attribute = data[keys[i]];
      var innerKeys = Object.keys(attribute);
      for (var j = 0; j < innerKeys.length; j++) {
        var value = attribute[innerKeys[j]];
        var placeholder = '{{' + keys[i] + '.' + innerKeys[j] + '}}';
        template = template.split(placeholder).join(value);
      }
    }
    return template;
  }

  return {
    'substituteTemplate': substituteTemplate,
    'ad': ad
  };

})();

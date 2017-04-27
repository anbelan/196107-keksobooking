'use strict';

// data.js

window.data = (function () {

  function generateRandomInt(min, max) {
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
    }
  }

  window.ad = [];
  var avatarNumbers = [];
  while (avatarNumbers.length < 8) {
    var temp = '0' + generateRandomInt(1, 8);
    if (avatarNumbers.indexOf(temp) == -1) {
      avatarNumbers.push(temp)
    }
  }
  var offerTitles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  while (offerTitles.length < 8) {
    var temp = offerTitles[generateRandomInt(0, offerTitles.length - 1)];
    if (offerTitles.indexOf(temp) == -1) {
      offerTitles.push(temp)
    }
  }
  for (var i = 0; i < 8; i++) {
    ad.push(generateObject(avatarNumbers[i], offerTitles[i]))
  }

  function getTemplate(templateId) {
    return document.getElementById(templateId).innerHTML
  }

  window.substituteTemplate = function substituteTemplate(template, data) {
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

})();

// load.js

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
  showError('Ошибка');

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

// map.js

window.map = (function () {

  // card.js

  window.card = (function () {

    var marker = document.querySelector('.tokyo__pin-map');

    window.getTemplate = function getTemplate(templateId) {
      return document.getElementById(templateId).innerHTML
    }

    function fillMap(ads) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < ads.length; i++) {
        console.log(ads[i]);
        ads[i].data = {
          number: i
        };
        var markerPin = substituteTemplate(getTemplate('marker.template'), ads[i]);
        var div = document.createElement('div');
        div.innerHTML = markerPin;
        var elements = div.childNodes;
        fragment.appendChild(elements[1]);
      }
      marker.appendChild(fragment);
    };

    load.load('https://intensive-javascript-server-kjgvxfepjl.now.sh/keksobooking/data', fillMap);

  })();

// show-card.js

  window.showCard = (function () {

    var dialog = document.querySelector('#offer-dialog');
    var lodgeTemplate = document.querySelector('#lodge-template').content;

    window.fillDialog = function fillDialog(advertisment) {
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

    function closeDialog() {
      document.getElementById('offer-dialog').style.display = 'none';
      deactivatePins(null);
    }

    var dialogClose = document.querySelector('.dialog__close');
    dialogClose.onclick = function () {
      closeDialog();
      return false;
    }
    dialogClose.addEventListener('keydown', function (evt) {
      if (evt.keyCode === 13) {
        closeDialog();
      }
    });

  })();

// pin.js

  window.pin = (function () {

    // Задние #11

    window.deactivatePins = function deactivatePins(except) {
      var pinsActive = document.getElementsByClassName('pin--active');
      for (var j = 0; j < pinsActive.length; j++) {
        if (except != pinsActive[j]) {
          pinsActive[j].classList.remove('pin--active');
        }
      }
    }

    function makePinActive(pin) {
      deactivatePins(pin);
      pin.classList.add('pin--active');
    }

    var pins = document.getElementsByClassName('pin');
    for (var i = 0; i < pins.length; i++) {
      var pin = pins[i];
      pin.addEventListener('click', function () {
        if (!this.dataset.addNumber) return;
        makePinActive(this);
        fillDialog(ad[this.dataset.addNumber]);
      });
      pin.addEventListener('focus', function () {
        makePinActive(this);
      });
      pin.addEventListener('keydown', function (evt) {
        if (evt.keyCode === 13) {
          fillDialog(ad[this.dataset.addNumber]);
        } else if (evt.keyCode === 27) {
          closeDialog();
        }
      });
    }

  var pinElement = document.querySelector('.tokyo__pin-map');
  var draggedItem = null;

  pinElement.addEventListener('dragstart', function (evt) {
    if (evt.target.tagName.toLowerCase() === 'img')
      draggedItem = evt.target;
    evt.dataTransfer.setData('text/plain', evt.target.alt);
  });
  var tokyoMapElement = document.querySelector('.tokyo');
  tokyoMapElement.addEventListener('dragover', function (evt) {
    evt.preventDefault();
    return false;
  });
  tokyoMapElement.addEventListener('drop', function (evt) {
    evt.target.appendChild(draggedItem);
  });
  tokyoMapElement.addEventListener('dragenter', function (evt) {
    evt.preventDefault();
  });
  tokyoMapElement.addEventListener('dragleave', function (evt) {
    evt.preventDefault();
  });

  var addressControl = document.getElementById('address');
  addressControl.readOnly = true;

  var pinHandle = document.getElementsByClassName('pin__main')[0];
  pinHandle.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startMove = {
      x: evt.clientX, // {{координата х}}
      y: evt.clientY // {{координата y}}
    }
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startMove.x - moveEvt.clientX, // {{координата х}}
        y: startMove.y - moveEvt.clientY // {{координата y}}
      }
      startMove = {
        x: moveEvt.clientX, // {{координата х}}
        y: moveEvt.clientY // {{координата y}}
      }
      pinHandle.style.top = (pinHandle.offsetTop - shift.y) + 'px';
      pinHandle.style.left = (pinHandle.offsetLeft - shift.x) + 'px';
    }

    function getPinArrowCoordinates(pinElement){
      return {
        x: pinElement.offsetLeft + Math.floor(pinElement.clientWidth / 2),
        y: pinElement.offsetTop + pinElement.clientHeight,
      }
    }

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      addressControl.value = substituteTemplate(getTemplate('create_ad_form.address'), {
        location: getPinArrowCoordinates(pinHandle)
      })

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  })

  })();

})();

// #12 валидация

// form.js

window.form = (function () {

  function getValue(domElement) {
    if (domElement.tagName === 'INPUT') {
      if (domElement.type !== 'radio')
        return domElement.value;
    } else if (domElement.tagName === 'SELECT') {
      return domElement.options[domElement.selectedIndex].value;
    }
    return null;
  }

  function setValue(control, value) {
    if (control.tagName == 'INPUT') {
      control.value = value;
    } else if (control.tagName == 'SELECT') {
      for (var i = 0; i < control.options.length; i++) {
        if (control.options[i].value == value) {
          control.selectedIndex = i;
          break;
        }
      }
    }
  }

  class FormValidator {
    constructor(formID) {
      this.form = document.getElementById(formID);
      this.validators = [];
      this.defaultValues = this.rememberDefaultValues(this.form);
    }

    rememberDefaultValues(form) {
      var inputs = form.getElementsByTagName('input');
      var values = {};
      for (var i = 0; i < inputs.length; i++) {
        values[inputs[i].id] = getValue(inputs[i]);
      }
      var selects = form.getElementsByTagName('select');
      for (var i = 0; i < selects.length; i++) {
        values[selects[i].id] = getValue(selects[i]);
      }
      return values
    }

    restoreDefaultValues(form, values) {
      var keys = Object.keys(values);
      for (let controlId of keys) {
        var control = document.getElementById(controlId);
        if (control) setValue(control, values[controlId]);
      }
    }

    ready() {
      var that = this;
      this.form.addEventListener('submit', function (event) {
        var isValid = true;
        for (var i = 0; i < that.validators.length; i++) {
          if (that.validators[i].isValid() === false) {
            isValid = false;
            that.mark(that.validators[i].getValidatedControl(), false);
          } else {
            that.mark(that.validators[i].getValidatedControl(), true);
          }
        }
        if (isValid == false) {
          event.preventDefault();
        } else {
          console.log('форма валидна, отправляем...');
          that.restoreDefaultValues(that.form, that.defaultValues);
          event.preventDefault();
        }
      })
      return this;
    }

    withValidators() {
      var that = this;
      for (var i = 0; i < arguments.length; i++)  this.validators.push(arguments[i]);
      return this;
    }

    mark(field, isValid) {
      if (isValid) {
        field.style.border = null;
      } else {
        field.style.border = '5px red solid';
      }
    }
  }

  class Validator {
    constructor(elementId) {
      this.validatedContolId = elementId;
      this.validatedContol = null;
      this.checkers = [];
    }

    getValidatedControl() {
      if (!this.validatedContol) {
        this.validatedContol = document.getElementById(this.validatedContolId);
      }
      return this.validatedContol;
    }

    setDefaultCheckers(...args) {
      this.setCheckers(args);
      return this;
    }

    setCheckers(checkers) {
      this.checkers = checkers;
    }

    isValid() {
      var value = getValue(this.getValidatedControl());
      for (let i = 0; i < this.checkers.length; i++) {
        if (this.checkers[i](value) == false) {
          return false;
        }
      }
      return true;
    }

    resetCheckersOn(elementId, getCheckersByValue) {
      var that = this;
      var domElement = document.getElementById(elementId);
      domElement.addEventListener('change', function () {
        var checkers = getCheckersByValue(getValue(domElement));
        that.setCheckers(checkers);
      })
    }
  }

  function requiredChecker(userInput) {
    if (userInput) {
      return true;
    } else {
      return false;
    }
  }

  function numberChecker(userInput) {
    return !isNaN(parseFloat(userInput)) && isFinite(userInput);
  }

  function lengthString(min, max) {
    return function (userInput) {
      if (userInput.length < min) {
        return false;
      }
      if (userInput.length > max) {
        return false;
      }
      return true;
    }
  }

  function numberRange(min, max) {
    return function (userInput) {
      var number = parseFloat(userInput);
      if (number < min) {
        return false;
      }
      if (number > max) {
        return false;
      }
      return true;
    }
  }

  let titleValidator = new Validator('title');
  titleValidator
    .setDefaultCheckers(requiredChecker, lengthString(30, 100));

  let priceValidator = new Validator('price');
  priceValidator
    .setDefaultCheckers(requiredChecker, numberChecker, numberRange(1000, 1000000))
    .resetCheckersOn('type', function (value) {
      if (value == 'Квартира') {
        return [requiredChecker, numberChecker, numberRange(1000, 1000000)];
      } else if (value == 'Лачуга') {
        return [requiredChecker, numberChecker, numberRange(0, 1000000)];
      } else if (value == 'Дворец') {
        return [requiredChecker, numberChecker, numberRange(10000, 1000000)];
      }
    });

  var formValidator = new FormValidator('create_ad_form');
  formValidator.withValidators(titleValidator, priceValidator);
  formValidator.ready();

// устанавливать значения при смене других значений

// время заезда время выезда

// 1
  class FieldCorrection {
    constructor(controlId) {
      this.controlId = controlId;
      this.watchedControls = {};
    }

    changeOn(controlId, setNewValueBy) {
      this.watchedControls[controlId] = setNewValueBy;
      return this;
    }

    ready() {
      this.watchedField = document.getElementById(this.controlId);
      var that = this;
      for (let controlId of Object.keys(this.watchedControls)) {
        var control = document.getElementById(controlId);
        document.getElementById(controlId).addEventListener('change', function () {
          var newValue = that.watchedControls[controlId](getValue(control), getValue(that));
          if (newValue === null) return;  // do not change
          setValue(that.watchedField, newValue)
        });
      }
    }
  }

  let timeoutCorrection = new FieldCorrection('timeout');
  timeoutCorrection
    .changeOn('time', function (value) {
      switch (value) {
        case 'После 12':
          return 'Выезд до 12';
        case 'После 13':
          return 'Выезд до 13';
        case 'После 14':
          return 'Выезд до 14';
      }
      return null;
    })
    .ready();

  let priceCorrection = new FieldCorrection('price');
  priceCorrection
    .changeOn('type', function (value, currentValue) {
      var currentPrice = parseFloat(currentValue);
      var minPrices = {
        'Квартира': 1000,
        'Лачуга': 0,
        'Дворец': 10000
      }
      if (minPrices.hasOwnProperty(value)) {
        if (currentPrice < minPrices[value]) {
          return minPrices[value];
        }
      }
      return null;
    })
    .ready();

  let capacityCorrection = new FieldCorrection('capacity');
  capacityCorrection
    .changeOn('room_number', function (value) {
      if (value === '1 комната') {
        return 'не для гостей';
      } else {
        return 'для 3 гостей';
      }
    })
    .ready();

})();

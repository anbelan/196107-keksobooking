'use strict';

window.pin = (function () {

  function deactivatePins(except) {
    var pinsActive = document.getElementsByClassName('pin--active');
    for (var j = 0; j < pinsActive.length; j++) {
      if (except !== pinsActive[j]) {
        pinsActive[j].classList.remove('pin--active');
      }
    }
  }

  function makePinActive(pin) {
    deactivatePins(pin);
    pin.classList.add('pin--active');
  }

  var addressControl = document.getElementById('address');
  addressControl.readOnly = true;

  var pinHandle = document.querySelector('.pin__main');
  pinHandle.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startMove = {
      x: evt.clientX,
      y: evt.clientY
    };
    var pinIsDraggedHandler = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startMove.x - moveEvt.clientX,
        y: startMove.y - moveEvt.clientY
      };
      startMove = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      pinHandle.style.top = (pinHandle.offsetTop - shift.y) + 'px';
      pinHandle.style.left = (pinHandle.offsetLeft - shift.x) + 'px';
    };

    function getPinArrowCoordinates(pinElement) {
      return {
        x: pinElement.offsetLeft + Math.floor(pinElement.clientWidth / 2),
        y: pinElement.offsetTop + pinElement.clientHeight,
      };
    }

    var pinDroppedHandler = function (upEvt) {
      upEvt.preventDefault();

      addressControl.value = window.data.substituteTemplate(window.card.getTemplate('create_ad_form.address'), {
        location: getPinArrowCoordinates(pinHandle)
      });

      document.removeEventListener('mousemove', pinIsDraggedHandler);
      document.removeEventListener('mouseup', pinDroppedHandler);
    };

    document.addEventListener('mousemove', pinIsDraggedHandler);
    document.addEventListener('mouseup', pinDroppedHandler);
  });

  var filterBlocks = document.getElementsByClassName('tokyo__filter');
  var featureBlocks = document.querySelectorAll('.tokyo__filter-set [name=feature]');
  var featureNames = [];

  for (i = 0; i < featureBlocks.length; i++) {
    featureNames.push(featureBlocks[i].value);
  }

  function hidePins(pins) {
    for (var i = 0; i < pins.length; i++) {
      pins[i].style.display = 'none';
    }
    return pins;
  }
  function showPins(pins) {
    for (var i = 0; i < pins.length; i++) {
      pins[i].style.display = 'block';
    }
    return pins;
  }

  function updateFilterObject() {
    var filterObject = {};
    var currentField;
    for (var i = 0; i < filterBlocks.length; i++) {
      var value = window.form.getValue(filterBlocks[i]);
      if (value === 'any') {
        continue;
      }
      currentField = filterBlocks[i];
      filterObject[currentField.name] = value;
    }
    for (i = 0; i < featureBlocks.length; i++) {
      currentField = featureBlocks[i];
      if (currentField.checked) {
        filterObject[currentField.value] = true;
      }
    }
    return filterObject;
  }

  function checkPinSatisfiesFilter(pinElement, filterObject) {
    var pinData = pinElement.advertismentData;

    if (filterObject.hasOwnProperty('housing_type')) {
      if (pinData.offer.type !== filterObject['housing_type']) {
        return false;
      }
    }

    if (filterObject.hasOwnProperty('housing_price')) {
      if (filterObject['housing_price'] === 'middle') {
        if (pinData.offer.price < 10000 || pinData.offer.price > 50000) {
          return false;
        }
      } else if (filterObject['housing_price'] === 'low') {
        if (pinData.offer.price >= 10000) {
          return false;
        }
      } else if (filterObject['housing_price'] === 'high') {
        if (pinData.offer.price <= 50000) {
          return false;
        }
      }
    }

    if (filterObject.hasOwnProperty('housing_room-number')) {
      if (pinData.offer.rooms !== parseInt(filterObject['housing_room-number'], 10)) {
        return false;
      }
    }

    if (filterObject.hasOwnProperty('housing_guests-number')) {
      if (pinData.offer.guests !== parseInt(filterObject['housing_guests-number'], 10)) {
        return false;
      }
    }

    for (var i = 0; i < featureNames.length; i++) {
      if (Boolean(filterObject[featureNames[i]]) && pinData.offer.features.indexOf(featureNames[i]) === -1) {
        return false;
      }
    }

    return true;
  }

  function filterChangedHandler() {
    var filterObject = updateFilterObject();
    var pinElements = document.querySelectorAll('.pin:not(.pin__main)');
    var pinsToShow = [];
    var pinsToHide = [];
    for (var i = 0; i < pinElements.length; i++) {
      if (checkPinSatisfiesFilter(pinElements[i], filterObject)) {
        pinsToShow.push(pinElements[i]);
      } else {
        pinsToHide.push(pinElements[i]);
      }
    }
    hidePins(pinsToHide);
    showPins(pinsToShow);
  }

  function debounce(f, ms) {
    var state = null;
    var COOLDOWN = 1;
    return function () {
      if (state === COOLDOWN) {
        return;
      }
      f(arguments);
      state = COOLDOWN;
      setTimeout(function () {
        state = null;
      }, ms);
    };
  }

  var currentField;
  for (var i = 0; i < filterBlocks.length; i++) {
    currentField = filterBlocks[i];
    currentField.addEventListener('change', debounce(filterChangedHandler, 500));
  }
  for (i = 0; i < featureBlocks.length; i++) {
    currentField = featureBlocks[i];
    currentField.addEventListener('change', debounce(filterChangedHandler, 500));
  }

  return {
    'makePinActive': makePinActive,
    'hidePins': hidePins,
    'showPins': showPins,
    'deactivatePins': deactivatePins
  };

})();

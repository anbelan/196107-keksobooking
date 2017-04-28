/**
 * Created by annabelan on 27.04.17.
 */
'use strict';

window.pin = (function () {

  function deactivatePins(except) {
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

      addressControl.value = data.substituteTemplate(card.getTemplate('create_ad_form.address'), {
        location: getPinArrowCoordinates(pinHandle)
      })

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  })

// фильтры

  var filterBlocks = document.getElementsByClassName('tokyo__filter');
  var featureBlocks = document.querySelectorAll('.tokyo__filter-set [name=feature]');
  var featureNames = [];

  for(var i = 0; i < featureBlocks.length; i++) {
    featureNames.push(featureBlocks[i].value);
  }

  function hidePins(pins) {
    for(var i = 0; i < pins.length; i++) {
      pins[i].style.display = 'none';
    }
  };
  function showPins(pins) {
    for (var i = 0; i < pins.length; i++) {
      pins[i].style.display = 'block';
    };
  }
  function updateFilterObject() {
    var filterObject = {};
    for(var i = 0; i < filterBlocks.length; i++) {
      var value = form.getValue(filterBlocks[i])
      if (value === 'any') {
        continue
      }
      var currentField = filterBlocks[i];
      filterObject[currentField.name] = value;
    }
    for(var i = 0; i < featureBlocks.length; i++) {
      var currentField = featureBlocks[i];
      if(currentField.checked === true) {
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
      } else if(filterObject['housing_price'] === 'low') {
        if (pinData.offer.price >= 10000) {
          return false;
        }
      } else if(filterObject['housing_price'] === 'high') {
        if (pinData.offer.price <= 50000) {
          return false;
        }
      }
    }

    if (filterObject.hasOwnProperty('housing_room-number')) {
      if (pinData.offer.rooms !== parseInt(filterObject['housing_room-number'])) {
        return false;
      }
    }

    if (filterObject.hasOwnProperty('housing_guests-number')) {
      if (pinData.offer.guests !== parseInt(filterObject['housing_guests-number'])) {
        return false;
      }
    }

    for(var i = 0; i < featureNames.length; i++) {
      if (filterObject[featureNames[i]] === true && pinData.offer.features.indexOf(featureNames[i]) === -1) {
        return false;
      }
    }

    return true;
  }

  function filterMap() {
    var filterObject = updateFilterObject();
    var pinElements = document.querySelectorAll('.pin:not(.pin__main)');
    var pinsToShow = [];
    var pinsToHide = [];
    for(var i = 0; i < pinElements.length; i++) {
      if(checkPinSatisfiesFilter(pinElements[i], filterObject) === true) {
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
    return function() {
      if (state) return;
      f.apply(this, arguments);
      state = COOLDOWN;
      setTimeout(function() { state = null }, ms);
    }
  }

  for(var i = 0; i < filterBlocks.length; i++) {
    var currentField = filterBlocks[i];
    currentField.addEventListener('change', debounce(filterMap, 500));
  }
  for(var i = 0; i < featureBlocks.length; i++) {
    var currentField = featureBlocks[i];
    currentField.addEventListener('change', debounce(filterMap, 500));
  }

  return {
    'makePinActive': makePinActive,
    'deactivatePins': deactivatePins
  };

})();

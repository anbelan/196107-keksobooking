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

      addressControl.value = data.substituteTemplate(card.getTemplate('create_ad_form.address'), {
        location: getPinArrowCoordinates(pinHandle)
      })

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  })

  return {
    'makePinActive': makePinActive,
    'deactivatePins': deactivatePins
  };

})();

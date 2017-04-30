'use strict';

window.card = (function () {

  function getTemplate(templateId) {
    return document.getElementById(templateId).innerHTML;
  }

  function closeDialog() {
    document.getElementById('offer-dialog').style.display = 'none';
    window.pin.deactivatePins(null);
  }

  var dialogClose = document.querySelector('.dialog__close');
  dialogClose.onclick = function () {
    closeDialog();
    return false;
  };
  var ENTER_KEY_NUMBER = 13;
  dialogClose.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEY_NUMBER) {
      closeDialog();
    }
  });

  return {
    'getTemplate': getTemplate,
    'closeDialog': closeDialog
  };

})();

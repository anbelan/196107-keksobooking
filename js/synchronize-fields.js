'use strict';

window.fields = (function () {

  function FieldCorrection(controlId) {
    this.controlId = controlId;
    this.watchedControls = {};

    this.changeOn = function (watchedControlId, setNewValueBy) {
      this.watchedControls[watchedControlId] = setNewValueBy;
      return this;
    };

    this.ready = function () {
      this.watchedField = document.getElementById(this.controlId);
      var that = this;
      var keys = Object.keys(this.watchedControls);
      for (var i = 0; i < keys.length; i++) {
        var watchedControlId = keys[i];
        var control = document.getElementById(watchedControlId);
        document.getElementById(watchedControlId).addEventListener('change', function () {
          var valueSetter = that.watchedControls[watchedControlId];
          var newValue = valueSetter(window.form.getValue(control), window.form.getValue(that.watchedField));
          if (newValue === null) {
            return;
          }  // do not change
          window.form.setValue(that.watchedField, newValue);
        });
      }
    };
  }

  var timeoutCorrection = new FieldCorrection('timeout');
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

  var priceCorrection = new FieldCorrection('price');
  priceCorrection
    .changeOn('type', function (value, currentValue) {
      var currentPrice = parseFloat(currentValue);
      var minPrices = {
        'Квартира': 1000,
        'Лачуга': 0,
        'Дворец': 10000
      };
      if (minPrices.hasOwnProperty(value)) {
        if (currentPrice < minPrices[value]) {
          return minPrices[value];
        }
      }
      return null;
    })
    .ready();

  var capacityCorrection = new FieldCorrection('capacity');
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

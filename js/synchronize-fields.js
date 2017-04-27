/**
 * Created by annabelan on 27.04.17.
 */
'use strict';

window.fields = (function () {

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
          var setNewValueBy = that.watchedControls[controlId];
          var newValue = setNewValueBy(form.getValue(control), form.getValue(that.watchedField));
          if (newValue === null) return;  // do not change
          form.setValue(that.watchedField, newValue)
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

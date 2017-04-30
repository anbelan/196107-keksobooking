'use strict';

window.fields = (function () {

  function FieldCorrection(controlId) {
    this.controlId = controlId;
    this.watchedControls = {};

    this.changeOn = function (watchedControlId, setNewValueBy) {
      this.watchedControls[watchedControlId] = setNewValueBy;
      return this;
    };

    this.__performChange = function (dependentControl, changedControl) {
      var valueGetter = this.watchedControls[changedControl.id];
      var currentValue = window.form.getValue(dependentControl);
      var newValue = valueGetter(window.form.getValue(changedControl), currentValue);
      if (newValue === null || newValue === currentValue) {
        return;
      }
      window.form.setValue(dependentControl, newValue);
    };

    this.ready = function () {
      this.watchedField = document.getElementById(this.controlId);
      var that = this;
      var keys = Object.keys(this.watchedControls);
      for (var i = 0; i < keys.length; i++) {
        var watchedControlId = keys[i];
        var control = document.getElementById(watchedControlId);
        control.addEventListener('change', function (currentControl) {
          return function () {
            that.__performChange(that.watchedField, currentControl);
          };
        }(control));
      }
      if (keys.length === 1) {
        this.__performChange(this.watchedField, document.getElementById(keys[0]));
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

  var timeCorrection = new FieldCorrection('time');
  timeCorrection
    .changeOn('timeout', function (value) {
      switch (value) {
        case 'Выезд до 12':
          return 'После 12';
        case 'Выезд до 13':
          return 'После 13';
        case 'Выезд до 14':
          return 'После 14';
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
      }
      return 'для 3 гостей';
    })
    .ready();

  var roomCorrection = new FieldCorrection('room_number');
  roomCorrection
    .changeOn('capacity', function (value) {
      if (value === 'не для гостей') {
        return '1 комната';
      }
      return null;
    })
    .ready();
})();

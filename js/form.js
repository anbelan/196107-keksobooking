'use strict';

window.form = (function () {

  function getValue(domElement) {
    if (domElement.tagName === 'INPUT') {
      if (domElement.type !== 'radio') {
        return domElement.value;
      }
    } else if (domElement.tagName === 'SELECT') {
      return domElement.options[domElement.selectedIndex].value;
    }
    return null;
  }

  function setValue(control, value) {
    if (control.tagName === 'INPUT') {
      control.value = value;
    } else if (control.tagName === 'SELECT') {
      for (var i = 0; i < control.options.length; i++) {
        if (control.options[i].value === value) {
          control.selectedIndex = i;
          break;
        }
      }
    }
  }

  function FormValidator(formID) {
    this.form = document.getElementById(formID);
    this.validators = [];

    this.rememberDefaultValues = function (form) {
      var inputs = this.form.getElementsByTagName('input');
      var values = {};
      for (var i = 0; i < inputs.length; i++) {
        values[inputs[i].id] = getValue(inputs[i]);
      }
      var selects = this.form.getElementsByTagName('select');
      for (i = 0; i < selects.length; i++) {
        values[selects[i].id] = getValue(selects[i]);
      }
      return values;
    };

    this.defaultValues = this.rememberDefaultValues(this.form);

    this.restoreDefaultValues = function (values) {
      var keys = Object.keys(values);
      for (var i = 0; i < keys.length; i++) {
        var control = document.getElementById(keys[i]);
        if (control !== null) {
          setValue(control, values[keys[i]]);
        }
      }
    };

    this.ready = function () {
      var that = this;
      this.form.addEventListener('submit', function (event) {
        var isValid = true;
        for (var i = 0; i < that.validators.length; i++) {
          if (!that.validators[i].isValid()) {
            isValid = false;
            that.mark(that.validators[i].getValidatedControl(), false);
          } else {
            that.mark(that.validators[i].getValidatedControl(), true);
          }
        }
        event.preventDefault();
        if (isValid) {
          that.restoreDefaultValues(that.defaultValues);
          // submit data...
        }
      });
      return this;
    };

    this.withValidators = function () {
      for (var i = 0; i < arguments.length; i++) {
        this.validators.push(arguments[i]);
      }
      return this;
    };

    this.mark = function (field, isValid) {
      if (isValid) {
        field.style.border = null;
      } else {
        field.style.border = '5px red solid';
      }
    };
  }

  function Validator(elementId) {
    this.validatedContolId = elementId;
    this.validatedContol = null;
    this.checkers = [];

    this.getValidatedControl = function () {
      if (this.validatedContol === null) {
        this.validatedContol = document.getElementById(this.validatedContolId);
      }
      return this.validatedContol;
    };

    this.setDefaultCheckers = function () {
      var checks = [];
      for (var i = 0; i < arguments.length; i++) {
        checks.push(arguments[i]);
      }
      this.setCheckers(checks);
      return this;
    };

    this.setCheckers = function (checkers) {
      this.checkers = checkers;
    };

    this.isValid = function () {
      var value = getValue(this.getValidatedControl());
      return this.checkers.every(function (validationFunc) {
        return validationFunc(value);
      });
    };

    this.resetCheckersOn = function (watchedElementId, getCheckersByValue) {
      var that = this;
      var domElement = document.getElementById(watchedElementId);
      domElement.addEventListener('change', function () {
        var checkers = getCheckersByValue(getValue(domElement));
        that.setCheckers(checkers);
      });
    };
  }

  function checkInputRequired(userInput) {
    return userInput !== '';
  }

  function checkInputIsNumeric(userInput) {
    return !isNaN(parseFloat(userInput)) && isFinite(userInput);
  }

  function checkInputLength(min, max) {
    return function (userInput) {
      if (userInput.length < min || userInput.length > max) {
        return false;
      }
      return true;
    };
  }

  function checkInputInRange(min, max) {
    return function (userInput) {
      var number = parseFloat(userInput);
      if (number < min || number > max) {
        return false;
      }
      return true;
    };
  }

  var titleValidator = new Validator('title');
  titleValidator
    .setDefaultCheckers(checkInputRequired, checkInputLength(30, 100));

  var priceValidator = new Validator('price');
  priceValidator
    .setDefaultCheckers(checkInputRequired, checkInputIsNumeric, checkInputInRange(1000, 1000000))
    .resetCheckersOn('type', function (value) {
      if (value === 'Квартира') {
        return [checkInputRequired, checkInputIsNumeric, checkInputInRange(1000, 1000000)];
      } else if (value === 'Лачуга') {
        return [checkInputRequired, checkInputIsNumeric, checkInputInRange(0, 1000000)];
      } else if (value === 'Дворец') {
        return [checkInputRequired, checkInputIsNumeric, checkInputInRange(10000, 1000000)];
      }
      return [];
    });

  var addressValidator = new Validator('address');
  addressValidator
    .setDefaultCheckers(checkInputRequired);

  var formValidator = new FormValidator('create_ad_form');
  formValidator.withValidators(titleValidator, priceValidator, addressValidator);
  formValidator.ready();

  return {
    'getValue': getValue,
    'setValue': setValue
  };

})();

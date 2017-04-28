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

    restoreDefaultValues(values) {
      var keys = Object.keys(values);
      for (let controlId of keys) {
        var control = document.getElementById(controlId);
        if (control) {
          setValue(control, values[controlId]);
        }
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
          that.restoreDefaultValues(that.defaultValues);
          event.preventDefault();
        }
      })
      return this;
    }

    withValidators() {
      for (var i = 0; i < arguments.length; i++) {
        this.validators.push(arguments[i])
      }
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

  function checkInputRequired(userInput) {
    if (userInput) {
      return true;
    } else {
      return false;
    }
  }

  function checkInputIsNumeric(userInput) {
    return !isNaN(parseFloat(userInput)) && isFinite(userInput);
  }

  function checkInputLength(min, max) {
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

  function checkInputInRange(min, max) {
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
    .setDefaultCheckers(checkInputRequired, checkInputLength(30, 100));

  let priceValidator = new Validator('price');
  priceValidator
    .setDefaultCheckers(checkInputRequired, checkInputIsNumeric, checkInputInRange(1000, 1000000))
    .resetCheckersOn('type', function (value) {
      if (value == 'Квартира') {
        return [checkInputRequired, checkInputIsNumeric, checkInputInRange(1000, 1000000)];
      } else if (value == 'Лачуга') {
        return [checkInputRequired, checkInputIsNumeric, checkInputInRange(0, 1000000)];
      } else if (value == 'Дворец') {
        return [checkInputRequired, checkInputIsNumeric, checkInputInRange(10000, 1000000)];
      }
    });

  var formValidator = new FormValidator('create_ad_form');
  formValidator.withValidators(titleValidator, priceValidator);
  formValidator.ready();

  return {
    'getValue': getValue,
    'setValue': setValue
  }

})();

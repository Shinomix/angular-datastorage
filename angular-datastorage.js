(function() {
    'use strict';

    angular
        .module('datastorage', [])
        .service('DataStorage', DataStorageFunction);


    function DataStorageFunction() {

        var _settings = {
            type: 'localStorage'
        };

        var _storageTypeConfig = {
            'localStorage': _localStorageCall,
            'sessionStorage': _sessionStorageCall
        };

        function _localStorageCall() {
            return localStorage;
        }

        function _sessionStorageCall() {
            return sessionStorage;
        }

        function setStorageType(newType) {
            if (newType === undefined || typeof newType !== 'string') {
                return null;
            }

            if (_storageTypeConfig.newType === undefined) {
                return null;
            }

            _settings.type = newType;
            return true;
        }

        function SET(key, value, expirationDate) {
            var toRegister = {
                value: '',
                expiration: ''
            };

            if (key === undefined || typeof key !== 'string') {
                return false;
            }

            if (typeof value === 'object') {
                toRegister.value = JSON.stringify(value);
            }
            else if (typeof value !== 'string') {
                toRegister.value = value.toString();
            }
            else {
                toRegister.value = value;
            }

            if (expirationDate !== undefined) {
                if (expirationDate instanceof Date) {
                    toRegister.expiration = expirationDate.toString();
                }
                if (!isNaN(Date.parse(expirationDate))) {
                    toRegister.expiration = expirationDate;
                }
            }

            toRegister = JSON.stringify(toRegister);
            _storageTypeConfig[_settings.type]().setItem(key, toRegister);
            return true;
        }

        function GET(key) {
            var returnObject = _storageTypeConfig[_settings.type]().getItem(key);
            returnObject = JSON.parse(returnObject);

            if (returnObject.expiration !== '') {
                var dateReturnObject = new Date(returnObject.expiration);
                var currentTime = new Date();
                if (currentTime - dateReturnObject < 0) {
                    return returnObject.value;
                }
                else {
                    REMOVE(key);
                    return null;
                }
            }

            return returnObject.value;
        }

        function REMOVE(key) {
            if (GET(key) !== undefined) {
                _storageTypeConfig[_settings.type]().removeItem(key);
                return true;
            }
            return null;
        }

        function CLEAR() {
            _storageTypeConfig[_settings.type]().clear();
        }

        function UPDATE(key, value, expirationDate) {
            var currentValue;

            if ((currentValue = GET(key)) !== undefined) {
                if (currentValue.expiration !== '') {
                    var dateCurrentValue = new Date(currentValue.expiration);
                    var currentTime = new Date();
                    REMOVE(key);
                    if (dateCurrentValue - currentTime < 0) {
                        return null;
                    }
                    else {
                        if (SET(key, value, expirationDate) === null) {
                            return null;
                        }
                    }
                    return true;
                }
                if (!angular.match(currentValue.value, value)) {
                    REMOVE(key);
                    if (SET(key, value) === null) {
                        return null;
                    }
                    return true;
                }
            }
            return null;
        }

        function SET_MULTIPLE() {
            for (var i = 0 ; i < arguments.length ; i++) {
                var toAdd = arguments[i];
                if (toAdd.key === undefined || toAdd.value === undefined) {
                    continue;
                }
                if (toAdd.expirationDate) {
                    if (SET(toAdd.key, toAdd.value, toAdd.expirationDate) === null) {
                        return null;
                    }
                }
                else {
                    if (SET(toAdd.key, toAdd.value) === null) {
                        return null;
                    }
                }
            }
            return true;
        }

        var DataStorageService = {
            setStorageType: setStorageType,

            set: SET,
            get: GET,
            remove: REMOVE,
            clear: CLEAR,
            update: UPDATE,
            setMultiple: SET_MULTIPLE
        };

        return DataStorageService;
    }
})();

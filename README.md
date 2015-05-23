#angular-datastorage
> Simple configurable storage service using localStorage or sessionStorage key/value system. Include multiple objects setter and expiration timestamp management

## Getting started
To start using the storage service, simply copy it in your actual AngularJS project and include
`angular-datastorage` in your main module.

### Configuration methods
angular-datastorage exposes one config methods over its service `DataStorage`:
```
DataStorage.setStorageType(<string>newType)
```
Used to choose storage system used in the service ('localStorage' or 'sessionStorage'). Default set on localStorage.


### Getter/Setter methods
angular-datastorage has one universal getter and two setter methods :
```
DataStorage.get(<string>key)
DataStorage.set(<string>key, <string|object>value, [<string|Date>expirationDate])
DataStorage.setMultiple({key: <string>myKey, value: <string|object>myValue}, [...])
```

1. Get method work with the key. Return the value if found else return `null`. If an expirationDate exists and is expired, will return `null`.
2. Set method accept any type for the value, it will be encapsulated in a JSON object. expirationDate can be a string timestamp or a Date variable. Return `true` if execution went right else return `null`.
3. setMultiple accept 0 to n parameters. Only thing is that objects need to be encapsulated in a key/value/[expirationDate] object to be set. If setter fails on one of the parameters, stop the execution and return `null`. Else return `true` at the end.


### Utility methods
angular-datastorage also has complementary methods to update, remove and clear stored data :
```
DataStorage.update(<string>key, <string|object>value, [<string|Date>expirationDate])
DataStorage.remove(<string>key)
DataStorage.clear()
```

1. Update method modify value and/or expirationDate of a specific key. Return `true` in case of success else `null`. If expirationDate expired for the key, will call the `remove` method and return `null`.
2. Remove delete the entry at the key specified and return `true`. Return `null` if the entry doesn't exist.
3. Clear method wipe the whole storage.



## To do or improve
1. Abstract calls to the primary methods (setItem, etc.) to be able to extend the service to any key/value storage system
2. Create a deleteMultiple method to delete n objects stored
3. Include the possibility to bind a logger through an optional object and provide explicit messages

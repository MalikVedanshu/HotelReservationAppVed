# HotelReservationAppVed
## Interview round

###  1. include the key value pair of {"proxy": "ipv4/localhost:5000"} in client/package.json

###  2. Server folder has ignored config folder which holds secret keys for database etc.

> Please install config package and follow this folder structure:
```
 'npm i config --save'
```
        add 2 files (in config folder): 1. config/default.json   2. config/production.json

        include the following data in both json files and edit values.

```javascript
{
    "myIP": "",
    "dbConnectUrl": "",
    "emailkeys": {
        "host": "",
        "auth": {
            "user": "",    
            "pass": "”
        },
        "port": “”
    },
    "jwt_secret_key": "",
    "crypt_secret_key": ""
}
```
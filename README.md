# HotelReservationAppVed
Interview round

Server folder has ignored config folder which holds secret keys for database etc.

Please install config package and follow this folder structure:

'npm i config --save'

make 2 files (in config folder): 1. config/default.json   2. config/production.json

input your values accordingly example: 

{
    "dbConnectUrl": "",
    "emailkeys": {
        "host": "",
        "auth": {
            "user": "",    
            "pass": ""
        },
        "port": ""
    }
}
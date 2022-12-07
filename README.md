# CNCS

https://user-images.githubusercontent.com/56789504/206169905-b529855e-e1c2-47d6-843e-187e6063a411.PNG

https://user-images.githubusercontent.com/56789504/206169950-985a8e5d-bea9-4bcc-9f22-b6c9aeac037c.PNG

casual-nocode-serviceは簡単な計算式をスクラッチ形式で作成できるWebアプリです。
四則演算及びifが使用でき、セーブ機能を使用してDB上に保存が可能です。また、DB上からロードが可能です。


[![Backend](https://github.com/weldsk/casual-nocode-service/actions/workflows/backend.yml/badge.svg)](https://github.com/weldsk/casual-nocode-service/actions/workflows/backend.yml)
[![Frontend](https://github.com/weldsk/casual-nocode-service/actions/workflows/Frontend.yml/badge.svg)](https://github.com/weldsk/casual-nocode-service/actions/workflows/Frontend.yml)

## Environment Variables

Set the following environment variables.

| Name                      | Type      | Description                             |
| ------------------------- | --------- | --------------------------------------- |
| SERVER_DB_LOCAL           | bool(0,1) | Use SQLite                              |
| SERVER_DBPATH             | string    | Database address (MySQL or MariaDB)     |
| SERVER_DBUSER             | string    | Username to access the database         |
| SERVER_DBPASS             | string    | Password to access the database         |
| SERVER_STORAGEPATH        | string    | Storage filepath                        |
| REACT_APP_API_URL         | string    | API address of the backend side         |
| REACT_APP_PRIVATE_API_URL | string    | Private API address on the backend side |

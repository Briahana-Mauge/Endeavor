# Capstone Project App (a full-stack web app)

<!-- *italicized description* -->

### **Developers: ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA**


### _Table of Contents_
+ [Technologies Implemented](#technologies-implemented)
+ [Setup](#setup)


<!-- ![screencap]() -->

## Instructional Team
+ **LEAD Instructor:** [Alejandro Franco -- ( @alejo4373 )](https://github.com/alejo4373)
+ **IA:** [Jung Rae Jang -- ( @jungraejang )](https://github.com/jungraejang)
+ **IA:** [Wynter Reid -- ( @wynterreid )](https://github.com/wynterreid)
+ **Program Manager:** [Dessa Shepherd](https://www.linkedin.com/in/dessa-shepherd-7a55b374/)

## Technologies Implemented
+ PostgreSQL 12.1
+ Express.js 4.16.1
+ React 16.13.1
+ React Bootstrap 1.0.0
+ Pg-promise 10.4.4
+ Axios 0.19.2
+ Multer 1.4.2
+ Multer-s3 2.9.0
+ Node.js 12.5.0
+ JavaScript ES6+
+ HTML5
+ CSS3

## Setup
+ To run this project, instantiate and seed the database with PostgreSQL:
  ```
  $ cd backend/db
  $ psql -f capstone_project_db.sql
  ```
+ Second, install the server locally using npm:
  ```
  $ cd ..
  $ npm install
  $ npm start
  ```
+ In another terminal instance install the frontend locally using npm:
  ```
  $ cd ../frontend
  $ npm install
  $ npm start
  ```
+ The site app will be found at: http://localhost:3008/

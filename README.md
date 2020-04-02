# Capstone Project App (a full-stack web app)

<!-- *italicized description* -->

### **Developers: ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA**


### _Table of Contents_
+ [Technologies Implemented](#technologies-implemented)
+ [Setup](#setup)
+ [Server Endpoints](#server-endpoints)


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
+ To run this project, using PostgreSQL and npm, install the seeded database and server:
  ```
  $ cd backend
  $ npm run quick_install
  ```
+ Then in a second terminal instance install the frontend locally using npm:
  ```
  $ cd ../frontend
  $ npm run quick_install
  ```
+ The site app will be found at: http://localhost:3008/

---

## Developers' Notes

### **Server Endpoints**
- **Fellows**

  | Method | Endpoint                   | Description                | Body Data |
  | ------ | -------------------------- | -------------------------- | --------- |
  | GET    | `/fellows/`                | Get all fellows            | n/a       |
  | GET    | `/fellows/id/:id`          | Get single fellow by id    | n/a       |
  | GET    | `/fellows/email/:email`    | Get single fellow by email | n/a       |

<!-- - **Users**

  | Method | Endpoint     | Description           | Body Data                |
  | ------ | ------------ | --------------------- | ------------------------ |
  | GET    | `/users`     | Get all users         | n/a                      |
  | GET    | `/users/:id` | Get single user by id | n/a                      |
  | POST   | `/users/`    | Add new user          | `username`, `avatarUrl`  | -->
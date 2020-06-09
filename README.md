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
+ Node-Sass (SCSS) 4.13.1
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
+ The app site will be found at: http://localhost:3008/

---

## Developers' Notes

### **Database Schema**
![Database Schema](/docs/DatabaseSchema.png)

### **Server Endpoints**
- **Auth**
  | Method | Endpoint                 | Description                  | Query Parameters | Body Data |
  | ------ | ------------------------ | ---------------------------- | ---------------- | --------- |
  | GET    | `/api/auth/is_logged`    | Check if a user is logged in | n/a              | n/a       |
  | POST   | `/api/auth/login`        | Login a user                 | n/a              | email, password       |
  | POST   | `/api/auth/:role/signup` | Sign up new user             | n/a              | Please refer to user's profile, minus picture|
  | PUT    | `/api/auth/:id`          | Update user information      | n/a              | Please refer to user's profile|


- **Users**
  | Method | Endpoint               | Description                    | Query Parameters | Body Data |
  | ------ | ---------------------- | ------------------------------ | ---------------- | --------- |
  | POST   | `/api/users/:role/add` | Create new pre-registered user | n/a              | email, password                        |
  | PATCH  | `/api/users/:id`       | Update user's password         | n/a              | password, newPassword, confirmPassword |
  | DELETE | `/api/users/:id`       | Delete user                    | n/a              | n/a                                    |


- **Volunteers**
  | Method | Endpoint                      | Description                           | Query Parameters                     | Body Data |
  | ------ | ----------------------------- | ------------------------------------- | ------------------------------------ | --------- |
  | GET    | `/api/volunteers/id/:id`      | Get volunteer by id                   | n/a                                  | n/a       |
  | GET    | `/api/volunteers/slug/:slug`  | Get volunteer by slug                 | n/a                                  | n/a       |
  | GET    | `/api/volunteers/all`         | Get all volunteer (with filters)      | v_email, name, skill, company, title | n/a       |
  | GET    | `/api/volunteers/new`         | Get all unconfirmed volunteers        | n/a                                  | n/a       |
  | PATCH  | `/api/volunteers/confirm/:id` | Confirm a new (unconfirmed) volunteer | n/a                                  | n/a       |


- **Fellows**
  | Method | Endpoint              | Description                    | Query Parameters     | Body Data |
  | ------ | --------------------- | ------------------------------ | -------------------- | --------- |
  | GET    | `/api/fellows/`       | Get all fellows (with filters) | name, cohort, mentor | n/a       |
  | GET    | `/api/fellows/id/:id` | Get single fellow by id        | n/a                  | n/a       |


- **Skills**
  | Method | Endpoint               | Description                | Query Parameters  | Body Data |
  | ------ | ---------------------- | -------------------------- | ----------------- | --------- |
  | GET    | `/api/skills/`         | Get all skills             | n/a               | n/a       |
  | POST   | `/api/skills/add/`     | Add single skill           | n/a               | skill     |
  | PUT    | `/api/skills/edit/:id` | Rename single skill by id  | n/a               | skill     |
  | DELETE | `/api/skills/del/:id`  | Delete single skill by id  | n/a               | n/a       |


- **Cohorts**
  | Method | Endpoint                | Description                 | Query Parameters | Body Data |
  | ------ | ----------------------- | --------------------------- | ---------------- | --------- |
  | GET    | `/api/cohorts/`         | Get all cohorts             | n/a              | n/a       |
  | POST   | `/api/cohorts/add/`     | Add single cohort           | n/a              | cohort    |
  | PUT    | `/api/cohorts/edit/:id` | Rename single cohort by id  | n/a              | cohort    |
  | DELETE | `/api/cohorts/del/:id`  | Delete single cohort by id  | n/a              | n/a       |


- **Events**
  | Method | Endpoint                      | Description                           | Query Parameters                     | Body Data |
  | ------ | ----------------------------- | ------------------------------------- | ------------------------------------ | --------- |
  | GET    | `/api/events/all/:role`   | Get all events by user role (with filters) | n/a                                  | n/a       |
  | GET    | `/api/events/event/:id`   | Get event by id                   | n/a                                  | n/a       |
  | GET    | `/api/events/slug/:slug`  | Get event by slug                 | n/a                                  | n/a       |
  | GET    | `/api/events/all`         | Get all event (with filters)      | v_email, name, skill, company, title | n/a       |
  | GET    | `/api/events/new`         | Get all unconfirmed events        | n/a                                  | n/a       |
  | PATCH  | `/api/events/confirm/:id` | Confirm a new (unconfirmed) event | n/a                                  | n/a       |
  | DELETE | `/api/events/:id` | Delete event by id | n/a                                  | n/a       |
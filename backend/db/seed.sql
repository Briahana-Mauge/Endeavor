-- DROP DATABASE IF EXISTS endeavor_db;
-- CREATE DATABASE endeavor_db;

-- \c endeavor_db

DROP TABLE IF EXISTS event_fellows;
DROP TABLE IF EXISTS event_volunteers;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS mentor_pairs;
DROP TABLE IF EXISTS volunteer_skills;
DROP TABLE IF EXISTS fellows;
DROP TABLE IF EXISTS volunteers;
DROP TABLE IF EXISTS administration;
DROP TABLE IF EXISTS users_data;
DROP TABLE IF EXISTS cohorts;
DROP TABLE IF EXISTS skills;

CREATE TABLE skills
(
    skill_id SERIAL PRIMARY KEY,
    skill VARCHAR (100) NOT NULL,
    deleted DATE DEFAULT NULL
);

CREATE TABLE cohorts
(
    cohort_id SERIAL PRIMARY KEY,
    cohort VARCHAR (10) UNIQUE NOT NULL,
    deleted DATE DEFAULT NULL
);

CREATE TABLE users_data
(
    user_email VARCHAR (50) PRIMARY KEY,
    password VARCHAR NOT NULL,
    role VARCHAR (10) NOT NULL,
    deleted DATE DEFAULT NULL
);

CREATE TABLE administration
(
    a_id SERIAL PRIMARY KEY,
    a_first_name VARCHAR (30) NOT NULL,
    a_last_name VARCHAR (30) NOT NULL,
    a_email VARCHAR (50) UNIQUE NOT NULL REFERENCES users_data(user_email) ON UPDATE CASCADE,
    a_picture VARCHAR,
    admin BOOLEAN NOT NULL DEFAULT FALSE,
    e_grid BOOLEAN NOT NULL DEFAULT TRUE,
    v_grid BOOLEAN NOT NULL DEFAULT TRUE,
    deleted DATE DEFAULT NULL
);

CREATE INDEX idx_admin 
ON administration(a_email, a_first_name, a_last_name);

CREATE TABLE volunteers
(
    v_id SERIAL PRIMARY KEY,
    v_slug VARCHAR (30) UNIQUE NOT NULL,
    v_first_name VARCHAR (30) NOT NULL,
    v_last_name VARCHAR (30) NOT NULL,
    v_email VARCHAR (50) UNIQUE NOT NULL REFERENCES users_data(user_email) ON UPDATE CASCADE,
    confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    v_picture VARCHAR,
    company VARCHAR (50) NOT NULL,
    parsed_company VARCHAR (50) NOT NULL,
    title VARCHAR (50) NOT NULL,
    v_bio VARCHAR NOT NULL DEFAULT '',
    v_linkedin VARCHAR (150) NOT NULL DEFAULT '',
    mentoring BOOLEAN NOT NULL DEFAULT FALSE,
    office_hours BOOLEAN NOT NULL DEFAULT FALSE,
    tech_mock_interview BOOLEAN NOT NULL DEFAULT FALSE,
    behavioral_mock_interview BOOLEAN NOT NULL DEFAULT FALSE,
    professional_skills_coach BOOLEAN NOT NULL DEFAULT FALSE,
    hosting_site_visit BOOLEAN NOT NULL DEFAULT FALSE,
    industry_speaker BOOLEAN NOT NULL DEFAULT FALSE,
    signup_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_DATE,
    public_profile BOOLEAN NOT NULL DEFAULT FALSE,
    inactive_date DATE,
    e_grid BOOLEAN NOT NULL DEFAULT TRUE,
    v_grid BOOLEAN NOT NULL DEFAULT TRUE,
    deleted DATE DEFAULT NULL
);

CREATE INDEX idx_volunteer 
ON volunteers(v_slug, v_email, v_first_name, v_last_name);

CREATE TABLE fellows
(
    f_id SERIAL PRIMARY KEY,
    f_first_name VARCHAR (30) NOT NULL,
    f_last_name VARCHAR (30) NOT NULL,
    f_email VARCHAR (50) UNIQUE NOT NULL REFERENCES users_data(user_email) ON UPDATE CASCADE,
    f_picture VARCHAR,
    f_bio VARCHAR NOT NULL DEFAULT '',
    f_linkedin VARCHAR (150) NOT NULL DEFAULT '',
    f_github VARCHAR (150) NOT NULL DEFAULT '',
    cohort_id INT NOT NULL REFERENCES cohorts(cohort_id),
    want_mentor BOOLEAN NOT NULL DEFAULT FALSE,
    e_grid BOOLEAN NOT NULL DEFAULT TRUE,
    v_grid BOOLEAN NOT NULL DEFAULT TRUE,
    deleted DATE DEFAULT NULL
);

CREATE INDEX idx_fellow 
ON fellows(f_email, f_first_name, f_last_name);

CREATE TABLE volunteer_skills
(
    vs_id SERIAL PRIMARY KEY,
    volunteer_id INT NOT NULL REFERENCES volunteers(v_id),
    skill_id INT NOT NULL REFERENCES skills(skill_id),
    deleted DATE DEFAULT NULL
);

CREATE TABLE mentor_pairs
(
    m_id SERIAL PRIMARY KEY,
    mentor INT NOT NULL REFERENCES volunteers(v_id),
    mentee INT NOT NULL REFERENCES fellows(f_id),
    starting_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_DATE,
    deleted DATE DEFAULT NULL
);

CREATE TABLE events
(
    event_id SERIAL PRIMARY KEY,
    event_start TIMESTAMPTZ NOT NULL,
    event_end TIMESTAMPTZ NOT NULL,
    topic VARCHAR (100) NOT NULL,
    description VARCHAR NOT NULL,
    staff_description VARCHAR,
    attendees INT NOT NULL REFERENCES cohorts(cohort_id),
    location VARCHAR (200) NOT NULL,
    instructor VARCHAR (100) NOT NULL,
    number_of_volunteers INT NOT NULL,
    g_calendar_id VARCHAR NOT NULL DEFAULT '',
    materials_url VARCHAR NOT NULL DEFAULT '',
    important BOOLEAN NOT NULL DEFAULT FALSE,
    deleted DATE DEFAULT NULL
);

CREATE TABLE event_volunteers
(
    ev_id SERIAL PRIMARY KEY,
    eventv_id INT NOT NULL REFERENCES events(event_id),
    volunteer_id INT NOT NULL REFERENCES volunteers(v_id),
    confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    volunteered_time INT NOT NULL DEFAULT 0,
    deleted DATE DEFAULT NULL,
    UNIQUE (eventv_id, volunteer_id)
);

CREATE TABLE event_fellows
(
    ef_id SERIAL PRIMARY KEY,
    eventf_id INT NOT NULL REFERENCES events(event_id),
    fellow_id INT NOT NULL REFERENCES fellows(f_id),
    deleted DATE DEFAULT NULL,
    UNIQUE (eventf_id, fellow_id)
);



-- SEEDING DATABASE

INSERT INTO skills
    (skill)
VALUES
    ('Javascript'),
    ('React'),
    ('React Native'),
    ('Angular'),
    ('Ruby on Rails'),
    ('Django'),
    ('Flask'),
    ('Java'),
    ('Swift'),
    ('Objective-C'),
    -- 10
    ('Python'),
    ('R'),
    ('Scala'),
    ('HTML'),
    ('CSS'),
    -- 15
    ('Professional Communication'),
    ('Personal Narrative, and Pop Pitches'),
    ('Written Communication'),
    ('Resumes, LinkedIn, and Cover Letters'),
    ('Project Management: Roles, Tools, and Best Practices'),
    ('Product Design, UX, and Prototyping'),
    ('Company Research'),
    ('Negotiations'),
    ('Talking About Tech Projects in Interviews'),
    ('Personal Finance');
-- 25


INSERT INTO cohorts
    (cohort)
VALUES
    ('General'),
    ('Candidates'),
    ('4.0'),
    ('4.1'),
    ('4.2'),
    -- 5
    ('4.3'),
    ('4.4'),
    ('5.0'),
    ('5.1'),
    ('5.2'),
    -- 10
    ('5.3'),
    ('5.4'),
    ('6.0'),
    ('6.1'),
    ('6.2'),
    -- 15
    ('6.3'),
    ('6.4');


INSERT INTO users_data
    (user_email, password, role)
VALUES
    ('admin@gmail.com', '$2b$12$BnlkuACZiHUs8h0TLWejv.NaSyBXQGNWnczdYt8KrdDEDV9VHQ4/O', 'admin'),
    ('alexis@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'admin'),

    ('alejo@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'staff'),
    ('dessa@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'staff'),

    ('dlopez@gmail.com', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'volunteer'),
    ('chall@gmail.com', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'volunteer'),
    ('jsimmons@gmail.com', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'volunteer'),
    -- 5
    ('cbarnes@gmail.com', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'volunteer'),
    ('pyoung@gmail.com', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'volunteer'),
    ('jevans@gmail.com', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'volunteer'),
    ('bsimpson@gmail.com', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'volunteer'),
    ('jparker@gmail.com', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'volunteer'),
    -- 10
    ('kwood@gmail.com', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'volunteer'),
    ('tpotter@gmail.com', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'volunteer'),

    ('aransagarcia@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('briahanamauge@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('brianytaveras@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    -- 15
    ('chukwukaokonkwoaguolu@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('dantaeflowers@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('douglasmackrell@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('gisellesanchez113@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('hupaulcamacho@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    -- 20
    ('jeneshnapit@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('johanneenama@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('jonathanfagan@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('josephpasaoa@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('kadijahwilson@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    -- 25
    ('kameronmontague@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('kathypuma@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('maliqtaylor@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('michaelamparo@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('owenjones@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    -- 30
    ('peterfiorentino@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('sandracardona@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('savitamadray@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('sergiocohensalama@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('sherrarkhan@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    -- 35
    ('suzetteislam@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('vonielbrown@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('aminebensalem@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow');


INSERT INTO administration
    (a_first_name, a_last_name, a_email, admin, a_picture)
VALUES
    ('Admin', 'Admin', 'admin@gmail.com', TRUE, 'https://www.beeandsee.com/6034-thickbox_default/coin-bank-dragon-ball-son-goku.jpg'),
    ('Alexis', 'Medina', 'alexis@pursuit.org', TRUE, 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1574704243786-BX80S9268MJHH1YNVEDR/ke17ZwdGBToddI8pDm48kLla4wX38-v8Fis1wk5Jefh7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QHyNOqBUUEtDDsRWrJLTmUK_IB3X7lRAWenxoBFomxbtsK0y7i603aSBwQBKdcbXoIq09V76Z6QF1Qqm1TVoI/Alexis+New+Headshot.jpg'),
    ('Alejo', 'Franco', 'alejo@pursuit.org', FALSE, 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1583293665303-RQTXY201ZQ9KZ2NE7I0X/ke17ZwdGBToddI8pDm48kHlUt2zFvP_bq9q3yP49zuN7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1UY6XFlJzv2BC2rQ_JMq2ONe5g1u_diTB3iF1ZqEFR6yZu8fsP79Qd-PI-QaBGoYB5Q/_MG_9133.jpg'),
    ('Dessa', 'Shepherd', 'dessa@pursuit.org', FALSE, 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1561575416265-YWVOY1RMUS4FQXSA4I6U/ke17ZwdGBToddI8pDm48kFO8_1WaoBAZQNaKyVGaij57gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1UW31wJTzbfHbkbJt9z-Z2T4abBcTdn8_pDvVLOVd-9dj4AE22lpcLzlaiGAl25fo5g/Dessa+Shepherd.jpg');


INSERT INTO volunteers
    (
        v_first_name,
        v_last_name,
        v_slug,
        v_email,
        v_picture,
        company,
        parsed_company,
        title,
        mentoring,
        office_hours,
        tech_mock_interview,
        behavioral_mock_interview,
        professional_skills_coach,
        hosting_site_visit,
        industry_speaker,
        public_profile,
        confirmed,
        v_linkedin, 
        signup_date
    )
VALUES
    ('Daniel', 'Lopez', 'dlopez', 'dlopez@gmail.com', 'https://pursuit-volunteer-management.s3.us-east-2.amazonaws.com/DanielLopez.jpg', 'Capital One', 'capitalone', 'Software Engineer', TRUE, TRUE, FALSE, FALSE, TRUE, FALSE, FALSE, TRUE, TRUE, 'https://www.linkedin.com/in/daniellopez/','2019-09-01'),
    ('Christina', 'Hall', 'chall', 'chall@gmail.com', 'https://pursuit-volunteer-management.s3.us-east-2.amazonaws.com/ChristinaHall.jpg', 'Capital One', 'capitalone', 'Mobile Software Engineer', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 'https://www.linkedin.com/in/','2019-10-01'),
    ('Judith', 'Simmons', 'jsimmon', 'jsimmons@gmail.com', 'https://pursuit-volunteer-management.s3.us-east-2.amazonaws.com/JudithSimmons.jpg', 'WayFair', 'wayfair', 'Software Engineer', TRUE, TRUE, TRUE, FALSE, TRUE, FALSE, FALSE, TRUE, TRUE, 'https://www.linkedin.com/in/','2019-11-01'),
    ('Catherine', 'Barnes', 'cbarnes', 'cbarnes@gmail.com', 'https://pursuit-volunteer-management.s3.us-east-2.amazonaws.com/CatherineBarnes.jpg', 'JustWorks', 'justworks', 'Software Engineer', FALSE, TRUE, TRUE, TRUE, FALSE, FALSE, TRUE, FALSE, TRUE, 'https://www.linkedin.com/in/','2019-09-01'),
    ('Pamela', 'Young', 'pyoung', 'pyoung@gmail.com', 'https://pursuit-volunteer-management.s3.us-east-2.amazonaws.com/PamelaYoung.jpg', 'JPMorganChase', 'jpmorganchase', 'Hiring Manager', FALSE, FALSE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 'https://www.linkedin.com/in/','2019-12-01'),
    -- 5
    ('John', 'Evans', 'jevans', 'jevans@gmail.com', 'https://pursuit-volunteer-management.s3.us-east-2.amazonaws.com/JohnEvans.jpg', 'Google', 'google', 'Tech Lead', TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, 'https://www.linkedin.com/in/','2019-07-01'),
    ('Bonnie', 'Simpson', 'bsimpson', 'bsimpson@gmail.com', 'https://pursuit-volunteer-management.s3.us-east-2.amazonaws.com/BonnieSimpson.jpg', 'The New York Times', 'thenewyorktimes', 'CEO', FALSE, FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, TRUE, TRUE, 'https://www.linkedin.com/in/','2019-09-01'),
    ('Joseph', 'Parker', 'jparker', 'jparker@gmail.com', 'https://pursuit-volunteer-management.s3.us-east-2.amazonaws.com/JosephParker.jpg', 'Spotify', 'spotify', 'Web Designer', TRUE, TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, FALSE, FALSE, 'https://www.linkedin.com/in/', CURRENT_DATE),
    ('Kenneth', 'Wood', 'kwood', 'kwood@gmail.com', 'https://pursuit-volunteer-management.s3.us-east-2.amazonaws.com/KennethWood.jpg', 'Google', 'google', 'HR', FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, TRUE, TRUE, FALSE, 'https://www.linkedin.com/in/', CURRENT_DATE),
    ('Thomas', 'Potter', 'tpotter', 'tpotter@gmail.com', 'https://pursuit-volunteer-management.s3.us-east-2.amazonaws.com/ThomasPotter.jpg', 'Google', 'google', 'Senior Software Engineer', TRUE, TRUE, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE, TRUE, 'https://www.linkedin.com/in/','2019-09-01');
-- 10


INSERT INTO fellows
    (
        f_first_name,
        f_last_name,
        f_email,
        f_picture,
        f_linkedin,
        f_github,
        cohort_id,
        want_mentor
    )
VALUES
    ('Aransa', 'Garcia', 'aransagarcia@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560974610981-PJP90DAZNR3C1DZE0EBO/ke17ZwdGBToddI8pDm48kLleLmcV7dS-MhzRju3uYcAUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8GRo6ASst2s6pLvNAu_PZdJpTNKK-J6l-465-clrtIQN2C738sdo7R0r9ae59x0EXbF9tpEDMWAdAbtkx_bKx38/IMG_1941+%281%29+-+Aransa+G.JPG?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 15, FALSE),
    ('Briahana', 'Maugé', 'briahanamauge@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560530253840-73KT4DGDCWF6FLHGW3HX/ke17ZwdGBToddI8pDm48kMtiXMEMZ8ID8MVhA-T_Qc9Zw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PIfy9uRsqnknGrsPwiW8VdnsJxMq6FvgYbxptNsO-6IOIKMshLAGzx4R3EDFOm1kBS/Briahana+Mauge+-+Briahana+Mauge.jpeg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 15, TRUE),
    ('Briany', 'Taveras', 'brianytaveras@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560530285740-A2DHNKBEKMZ7IB8POAYL/ke17ZwdGBToddI8pDm48kGalivP0gwHmntCMYYZVzBh7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0plef_PmwB6-3GP4qDbCUv92Du-NGmLJS6rLFW6lohgQsEYPYfZxA8yfoVIIuDP8kQ/brianytaveras+-+Briany+Taveras.jpg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 15, FALSE),
    ('Chukwuka', 'Okonkwoaguolu', 'chukwukaokonkwoaguolu@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560530942056-VZY5K6CYC315H3CU9S0X/ke17ZwdGBToddI8pDm48kErutB0DQfKy7xVMt5yUScx7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1UWADxDi8vTpikZlym2K_V5YHZw9wSaZy_GIvFii2Jx41rGX9FoDs3WeWy9fjPO04vA/Chuck_OkonkwoAguolu+-+Chuck+aguolu.jpg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 15, FALSE),
    ('Dantae', 'Flowers', 'dantaeflowers@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560530979291-X9I360C7R31F7JETAYA6/ke17ZwdGBToddI8pDm48kLK3I0Z43aBzb4w_UM_qHfN7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1UdQoFEQLeDyX73sQsVArkbUGuSBuG9P2GFHvSOhXJ3qhZ5819XDE-T-fE_EmFUjQwQ/20190602_184443+-+Dantae+Flowers.jpg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 15, FALSE),
    -- 5
    ('Douglas', 'Mackrell', 'douglasmackrell@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560531385717-F0JD62XFT2H18DA2KPFT/ke17ZwdGBToddI8pDm48kLxnK526YWAH1qleWz-y7AFZw-zPPgdn4jUwVcJE1ZvWEtT5uBSRWt4vQZAgTJucoTqqXjS3CfNDSuuf31e0tVH33scGBZjC30S7EYewNF5iKKwhonf2ThqWWOBkLKnojuqYeU1KwPvsAK7Tx5ND4WE/Douglas+MacKrell+-+Douglas+MacKrell.jpg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 15, FALSE),
    ('Giselle', 'Sanchez', 'gisellesanchez113@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560873032585-MPI074P0WCM8D6JX3QOZ/ke17ZwdGBToddI8pDm48kLxnK526YWAH1qleWz-y7AFZw-zPPgdn4jUwVcJE1ZvWEtT5uBSRWt4vQZAgTJucoTqqXjS3CfNDSuuf31e0tVH33scGBZjC30S7EYewNF5iKKwhonf2ThqWWOBkLKnojuqYeU1KwPvsAK7Tx5ND4WE/GiselleSanchez+-+Giselle+Sanchez.JPG?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 15, FALSE),
    ('Hupaul', 'Camacho', 'hupaulcamacho@pursuit.org', 'https://pursuit-volunteer-management.s3.us-east-2.amazonaws.com/1591544279539-HupaulCamacho.JPG', 'https://www.linkedin.com/', 'https://github.com/', 15, FALSE),
    ('Jenesh', 'Napit', 'jeneshnapit@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560531476754-DYU1618LN22D93PV4RBP/ke17ZwdGBToddI8pDm48kDu19ZQ_w9wAMJI6dbWnlCR7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QHyNOqBUUEtDDsRWrJLTmmV5_8-bAHr7cY_ioNsJS_61TwOmkAvvlADGd1IlbhMogFKngaLShotgJgXNsogyy/Jenesh+Napit+-+J+N.jpg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 15, FALSE),
    ('Johanne', 'Enama', 'johanneenama@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560531683715-FRXW9LO1PJ1RW0AKXQXX/ke17ZwdGBToddI8pDm48kEbpNpz_g84ww2Q11MA-atpZw-zPPgdn4jUwVcJE1ZvWEtT5uBSRWt4vQZAgTJucoTqqXjS3CfNDSuuf31e0tVFBtEgj52mM8uXJqXwNJ9DglJgC4wo-TZ2620CX9P9wUp1zDMfxjoXGDCxwz3Y9Vxg/IMG_0653+-+Johanne+Enama.JPG?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 15, FALSE),
    -- 10
    ('Jonathan', 'Fagan', 'jonathanfagan@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560531716112-F0EUEVBHACM86HNYG46Y/ke17ZwdGBToddI8pDm48kNvfEZRbwokPF2q5mMkb1Nh7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1UdPvmgaeWlm56t9ZuepLa55e6Ou0uLXHCxlVMnrwj7FrfMr1ALBGPwRYe3hA7r_F-g/400F4467-4112-489D-8B4B-8677057579A2+-+Jonathan+Fagan.jpeg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 15, FALSE),
    ('Joseph', 'Pasaoa', 'josephpasaoa@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560531611710-G2ZYMX7XVVYNDVXJJ1EP/ke17ZwdGBToddI8pDm48kMh3mVmBaCAeGwqCLG3iONRZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PIarJWwnumkapRz_nmTYj1dpaH2rx--_BA62nv3IYPJxMKMshLAGzx4R3EDFOm1kBS/Joseph+Pasaoa+-+Joseph+Pasaoa.jpg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 15, TRUE),
    ('Kadijah', 'Wilson', 'kadijahwilson@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560531743351-8IX3VB0DTBABUCE32XZT/ke17ZwdGBToddI8pDm48kLxnK526YWAH1qleWz-y7AFZw-zPPgdn4jUwVcJE1ZvWEtT5uBSRWt4vQZAgTJucoTqqXjS3CfNDSuuf31e0tVH33scGBZjC30S7EYewNF5iKKwhonf2ThqWWOBkLKnojuqYeU1KwPvsAK7Tx5ND4WE/Kadijah+Wilson+-+Kadijah+Wilson.jpg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 15, FALSE),
    ('Kameron', 'Montague', 'kameronmontague@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560531871462-OC3ZXCU63874VCDKTC96/ke17ZwdGBToddI8pDm48kD6h-vx4-FgEfJblrbYfV8N7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QHyNOqBUUEtDDsRWrJLTmujyyI7Frso6MRdplGTbhDkcnOna2UXrFZnIvXKJZ1oY6m8RtTbEUH8lrGuEN6ChB/20190603_075737+-+Kameron+Montague.jpg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 16, FALSE),
    ('Kathy', 'Puma', 'kathypuma@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560531955349-84RWQIOGMW8ATJBW7Y7N/ke17ZwdGBToddI8pDm48kJ0udFXALvwRTY2nqxSwmGZ7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QHyNOqBUUEtDDsRWrJLTmD3GJgI7_jN764QbmlaUTk_05Sl85_BCpZqR9YU6evPqDWdj5sB1TMq9gpLfZRgCW/KathyPuma+-+Kathy+Puma.JPG?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 16, FALSE),
    -- 15
    ('Maliq', 'Taylor', 'maliqtaylor@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560872957963-VAEEFXTKACECK91ORZ1J/ke17ZwdGBToddI8pDm48kMG0E-tUfUxlWwQnnagUgmlZw-zPPgdn4jUwVcJE1ZvWhcwhEtWJXoshNdA9f1qD7Xj1nVWs2aaTtWBneO2WM-uNp3MZLdlvMDnwUM19q3mRhWFjwSjHHdMViu5WjoAASg/thumbnail_IMG_3077+-+Malik+Taylor.jpg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 16, FALSE),
    ('Michael', 'Amparo', 'michaelamparo@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560531982425-WWQG4XDEXECKZ2OR5UQ7/ke17ZwdGBToddI8pDm48kMP-y0ulEMSpv5gX1QhW0clZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpwidEfjveN8J3Sz3N_e-OGLGIq4HVrEGtszKD9lLLpeOpVO5tXjPCMkls8IvG2Ko2E/Michael+Amparo+-+Michael+Amparo.jpeg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 16, FALSE),
    ('Owen', 'Jones', 'owenjones@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560532118380-XK9TH50TZCKNXKYLRRAD/ke17ZwdGBToddI8pDm48kLqfNUGDg3QRi74Yamko8iJZw-zPPgdn4jUwVcJE1ZvWEtT5uBSRWt4vQZAgTJucoTqqXjS3CfNDSuuf31e0tVGzJfqEA1LHv3wwoAJhJYc_UjkTq_5sUsJomuW6NrY3Jd1lH3P2bFZvTItROhWrBJ0/Owen_Jones+-+Owen+Jones.PNG?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 16, FALSE),
    ('Peter', 'Fiorentino', 'peterfiorentino@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560532171622-Y0NRJ1P8LNWXQTM9NETF/ke17ZwdGBToddI8pDm48kDNKJkkHfcQ1Ka9tYyPB1EpZw-zPPgdn4jUwVcJE1ZvWEtT5uBSRWt4vQZAgTJucoTqqXjS3CfNDSuuf31e0tVFaezuRw0Goi25qydjJw8p9fGaAFNcxQSKtYMZQUT-G_WQ6l2WM7tn7mqHTODzkmeM/0+-+Peter+Fiorentino.png?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 16, FALSE),
    ('Sandra', 'Cardona', 'sandracardona@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560532385998-UQGRH8RG4XOPP8JQ7PND/ke17ZwdGBToddI8pDm48kL-PDEV0kc4nkv6ZO74dbct7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1UfdVC79UZfxPkMeg9HFyXpQQifYSi4HMBv5Z68sTGDeU_XaCZ2eR_PUwOvzfpR6u4g/FullSizeR1+-+Elisandra+Cardona.jpg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 16, FALSE),
    -- 20
    ('Savita', 'Madray', 'savitamadray@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560532398348-01ND81699RNEAO9ZH3DJ/ke17ZwdGBToddI8pDm48kKYvdQumIDj9qG9OlL8COhx7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QHyNOqBUUEtDDsRWrJLTmQyViSO8WVy1F2YAzXWvEVMDBYS3Udm7hP-QZUVwor4BA4obUG8hEJXVUIqmpbYxa/image-asset.jpeg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 17, FALSE),
    ('Sergio', 'Cohen Salama', 'sergiocohensalama@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560532406144-GEHJ6E9Y5G37VNXJ79Y3/ke17ZwdGBToddI8pDm48kCp2RdAXEQdFxZnjIuF2wjFZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpyiYDEmVWOoBuBv4mqCrTnhkkiFnqTkVzUDNGgRrOBdhUXgq7zkCJpM6xaIWraL4GU/Sergio+Cohen-Salama+-+Sergio+Cohen+Salama.JPG?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 17, FALSE),
    ('Sherrar', 'Khan', 'sherrarkhan@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560872782658-GEX1B4ERPLVMXZRIAMGV/ke17ZwdGBToddI8pDm48kFfxr8v8XLMrFSuxnICQvbNZw-zPPgdn4jUwVcJE1ZvWEtT5uBSRWt4vQZAgTJucoTqqXjS3CfNDSuuf31e0tVE0P2lywwjo358iJ-eaGZd-qJqGqu4BIGg77SPZQsf1OouREhlBnM3BHiO9U5XZb6E/image-asset.jpeg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 17, FALSE),
    ('Suzette', 'Islam', 'suzetteislam@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560532619099-B2IJX5S7UAC9OXRPOBJJ/ke17ZwdGBToddI8pDm48kHFnmntegnVXpN4y4ldn3ixZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpxco7Gi2cI2YfBk8ZWdc_m6Xcr86dXh8TsiE3NyioNRZj9sD37Ved1vsRvl2h0UxBw/21106008_10155719062433750_5374603742919262310_n+-+Suzette+Islam.jpg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 17, FALSE),
    ('Voniel', 'Brown', 'vonielbrown@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560532080500-JM8Q6W23CHMMO3V16UY3/ke17ZwdGBToddI8pDm48kJbosy0LGK_KqcAZRQ_Qph1Zw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpzowLjssSnFpmmA9R97e_dXIFE6pyBEPVtt1QRhHppUHFVIdzCuVAmPBGAxTKnN90Q/Voniel+Brown+-+Von+Brown.png?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 17, FALSE),
    -- 25
    ('Amine', 'Bensalem', 'aminebensalem@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560530145270-P86FODAN0DEP75WV44TT/ke17ZwdGBToddI8pDm48kCMOzc4GiK3dsNqiUCo6wrh7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QHyNOqBUUEtDDsRWrJLTmLLxGPZs9cXJqW7PQ94qJw_PXe0-aBO9Nk8dpGJ5ZKQqQP0CxanRMUAlhQx1QfmRy/Amine+Bensalem+-+Amine+Bensalem.JPG?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 17, TRUE);


INSERT INTO volunteer_skills
    (volunteer_id, skill_id)
VALUES
    (1, 1),
    (1, 2),
    (1, 21),
    (2, 3),
    (2, 5),
    -- 5
    (2, 9),
    (3, 1),
    (3, 2),
    (3, 4),
    (4, 3),
    -- 10
    (4, 9),
    (5, 16),
    (5, 17),
    (5, 18),
    (5, 19),
    -- 15
    (5, 22),
    (5, 23),
    (6, 1),
    (6, 2),
    (6, 4),
    -- 20
    (6, 8),
    (6, 10),
    (6, 20),
    (6, 24),
    (7, 16),
    -- 25
    (7, 17),
    (7, 18),
    (7, 23),
    (7, 25),
    (8, 14),
    -- 30
    (8, 15),
    (8, 21),
    (9, 16),
    (9, 18),
    (9, 19),
    -- 35
    (10, 1),
    (10, 2),
    (10, 4),
    (10, 8),
    (10, 10),
    -- 40
    (10, 20),
    (10, 24);


INSERT INTO mentor_pairs
    (mentor, mentee, starting_date)
VALUES
    (1, 1, '2019-09-01'),
    (3, 3, '2019-09-10'),
    (6, 5, '2019-09-20'),
    (8, 7, '2019-09-30'),
    (8, 9, '2019-10-01'),
    -- 5
    (10, 11, '2019-10-10'),
    (1, 13, '2019-10-20'),
    (3, 15, '2019-10-30'),
    (6, 17, '2019-11-01'),
    (8, 19, '2019-11-10'),
    -- 10
    (8, 21, '2019-11-20'),
    (10, 23, '2019-11-30');


INSERT INTO events
    (
        event_start,
        event_end,
        topic,
        description,
        attendees,
        location,
        instructor,
        number_of_volunteers,
        important
    )
VALUES

    -- PAST ================
    (   CURRENT_DATE - INTERVAL '4 days' + TIME '10:00-04', --'2020-06-21 10:00-04', 
        CURRENT_DATE - INTERVAL '3 days' + TIME '20:00-04', --'2020-06-22 20:00-04',
        'Hackathon 6.4',
        'Fellows showcase apps that address important real-world problems: staying informed about COVID-19, supporting reopening restaurants, surfacing online reviews about discriminatory businesses, or just finding new music to listen to while you''re stuck at home.',
        15, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101',
        'Dessa Shepherd', 10, TRUE  ),

    (   CURRENT_DATE - INTERVAL '10 days' + TIME '00:00-04', --'2020-06-15 00:00-04',
        CURRENT_DATE - INTERVAL '10 days' + TIME '23:59-04', --'2020-06-15 23:59-04',
        'Capstone Demo Day',
        'We are pleased to invite you to experience the products built by our Pursuit Core Full Stack Web developers. In just a year, New York''s finest new web developers have completed an intensive technical curriculum — mastering the fundamentals of Web development while sharpening their product development skills. Our developers represent the newest engineering talent in NYC tech. Come celebrate their achievements and the growth of a diverse and inclusive tech community in New York City.',
        15, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101',
        'Dessa Shepherd', 10, TRUE  ),

    (   CURRENT_DATE - INTERVAL '17 days' + TIME '13:00-04', --'2020-06-08 13:00-04',
        CURRENT_DATE - INTERVAL '17 days' + TIME '15:00-04', --'2020-06-08 15:00-04',
        'Google Remote Onsite',
        'Take some time getting to know some Google Engineers for an inside look at what it’s like to work at Google!',
        3, 'Zoom: https://zoom.us/my/alejos',
        'Alexis Medina', 5, FALSE  ),

    (   CURRENT_DATE - INTERVAL '22 days' + TIME '13:00-04', --'2020-06-03 13:00-04',
        CURRENT_DATE - INTERVAL '22 days' + TIME '13:00-04', --'2020-06-03 13:45-04',
        'Let''s Do Remote Lunch!',
        'Spend your WFH lunch break with 6-10 of our Fellows! Chat about anything! Get to know our Fellows and share your path to tech. We''ll share a list of possible topics as well. We''ll have 3 "Lunch Rooms" over Zoom each day so please choose more than 1 day in case dates get filled up. I''ll reach back out to confirm your date.',
        1,'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101',
        'Jessica Shyu', 6, FALSE   ),

    (   CURRENT_DATE - INTERVAL '29 days' + TIME '0:00-04', --'2020-05-26 00:00-04',
        CURRENT_DATE - INTERVAL '27 days' + TIME '23:59-04', --'2020-05-28 23:59-04',
        'Staff Prep for Capstone',
        'Faculty all-hands-on-deck roundtable regarding Capstone in 2020. Discussion and breakout rooms to help facilitate open dialogue and brainstorming. Virtual doughnuts will also be served.',
        1, 'Zoom: https://zoom.us/my/alejos',
        'David and Jukay', 8, FALSE ),

    (   CURRENT_DATE - INTERVAL '1 month' + TIME '00:00-04', --'2020-05-25 00:00-04',
        CURRENT_DATE - INTERVAL '1 month' + TIME '23:59-04', --'2020-05-25 23:59-04',
        '6.1 Capstone Tech Showcase',
        'A technical showcase of iOS ingenuity! We are pleased to invite you to experience the products built by our Pursuit Core iOS developers.',
        15, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101',
        'Dessa Shepherd', 10, TRUE  ),

    (   CURRENT_DATE - INTERVAL '1 month' - INTERVAL '12 days' + TIME '10:00-04', --'2020-05-13 10:00-04',
        CURRENT_DATE - INTERVAL '1 month' - INTERVAL '12 days' + TIME '10:45-04', --'2020-05-13 10:45-04',
        'Let''s Do Remote Breakfast!',
        'Spend your WFH lunch break with 6-10 of our Fellows! Chat about anything! Get to know our Fellows and share your path to tech. We''ll share a list of possible topics as well. We''ll have 3 "Lunch Rooms" over Zoom each day so please choose more than 1 day in case dates get filled up. I''ll reach back out to confirm your date.',
        1, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101',
        'Jessica Shyu', 6, FALSE  ),

    (   CURRENT_DATE - INTERVAL '1 month' - INTERVAL '12 days' + TIME '09:00-04', --'2020-05-13 09:00-04',
        CURRENT_DATE - INTERVAL '1 month' - INTERVAL '12 days' + TIME '17:30-04', --'2020-05-13 17:30-04',
        'Conduct Virtual Behavioral Interviews',
        'Volunteers will conduct two 45-minute 1:1 behavioral interviews using a question bank and an interviewing guide. Afterwards, you''ll provide us with feedback through an evaluation form. We are looking for hiring managers or anyone who conducts interviews regularly.',
        15, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101',
        'Dessa Shepherd', 10, TRUE  ),

    (   CURRENT_DATE - INTERVAL '2 month' - INTERVAL '3 days' + TIME '13:00-04', --'2020-04-22 13:00-04',
        CURRENT_DATE - INTERVAL '2 month' - INTERVAL '3 days' + TIME '13:45-04', --'2020-04-22 13:45-04',
        'Let''s Do Remote Lunch!',
        'Spend your WFH lunch break with 6-10 of our Fellows! Chat about anything! Get to know our Fellows and share your path to tech. We''ll share a list of possible topics as well. We''ll have 3 "Lunch Rooms" over Zoom each day so please choose more than 1 day in case dates get filled up. I''ll reach back out to confirm your date.',
        1, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101',
        'Jessica Shyu', 6, FALSE  ),

    (   CURRENT_DATE - INTERVAL '2 month' - INTERVAL '21 days' + TIME '13:00-04', --'2020-04-04 13:00-04',
        CURRENT_DATE - INTERVAL '2 month' - INTERVAL '21 days' + TIME '13:45-04', --'2020-04-04 13:45-04',
        'Let''s Do Remote Lunch!',
        'Spend your WFH lunch break with 6-10 of our Fellows! Chat about anything! Get to know our Fellows and share your path to tech. We''ll share a list of possible topics as well. We''ll have 3 "Lunch Rooms" over Zoom each day so please choose more than 1 day in case dates get filled up. I''ll reach back out to confirm your date.',
        1, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101',
        'Jessica Shyu', 6, FALSE  ),

    (   CURRENT_DATE - INTERVAL '2 month' - INTERVAL '23 days' + TIME '17:30-04', --'2020-04-02 17:30-04',
        CURRENT_DATE - INTERVAL '2 month' - INTERVAL '23 days' + TIME '19:30-04', --'2020-04-02 19:30-04',
        'Code Review on Hackathon Projects',
        'Join a group of 4 Fellows on April 2nd at 5:30pm to review their Hackathon projects. You''ll provide feedback to help them to help improve and implement new features. We''ll review the rubric you''ll use to evaluate the projects and then you''ll work with the groups remotely until 7:30pm. A week later, you''ll find time with the group to follow-up and review their final products. Volunteers must know Javascript, React, Node.js, PostgresSQL and Express. We are looking for 6 Volunteers.',
        15, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101',
        'Alejandro Franco', 6, TRUE ),

    (   CURRENT_DATE - INTERVAL '3 month' - INTERVAL '13 days' + TIME '13:00-04', --'2020-03-12 13:00-04',
        CURRENT_DATE - INTERVAL '3 month' - INTERVAL '13 days' + TIME '13:45-04', --'2020-03-12 13:45-04',
        'Let''s Do Remote Lunch!',
        'Spend your WFH lunch break with 6-10 of our Fellows! Chat about anything! Get to know our Fellows and share your path to tech. We''ll share a list of possible topics as well. We''ll have 3 "Lunch Rooms" over Zoom each day so please choose more than 1 day in case dates get filled up. I''ll reach back out to confirm your date.',
        1, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101',
        'Jessica Shyu', 6, FALSE  ),

    (   CURRENT_DATE - INTERVAL '4 month' - INTERVAL '3 days' + TIME '13:00-04', --'2020-02-22 13:00-04',
        CURRENT_DATE - INTERVAL '4 month' - INTERVAL '3 days' + TIME '13:45-04', --'2020-02-22 13:45-04',
        'Let''s Do Remote Lunch!',
        'Spend your WFH lunch break with 6-10 of our Fellows! Chat about anything! Get to know our Fellows and share your path to tech. We''ll share a list of possible topics as well. We''ll have 3 "Lunch Rooms" over Zoom each day so please choose more than 1 day in case dates get filled up. I''ll reach back out to confirm your date.',
        1, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101',
        'Jessica Shyu', 6, FALSE  ),

    (   CURRENT_DATE - INTERVAL '4 month' - INTERVAL '12 days' + TIME '15:00-04', --'2020-02-13 15:00-04',
        CURRENT_DATE - INTERVAL '4 month' - INTERVAL '12 days' + TIME '15:45-04', --'2020-02-13 15:45-04',
        'Let''s Do Remote Lunch!',
        'Spend your WFH lunch break with 6-10 of our Fellows! Chat about anything! Get to know our Fellows and share your path to tech. We''ll share a list of possible topics as well. We''ll have 3 "Lunch Rooms" over Zoom each day so please choose more than 1 day in case dates get filled up. I''ll reach back out to confirm your date.',
        1, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101',
        'Jessica Shyu', 6, FALSE  ),

    (   CURRENT_DATE - INTERVAL '5 month' - INTERVAL '14 days' + TIME '09:00-04', --'2020-01-11 09:00-04',
        CURRENT_DATE - INTERVAL '5 month' - INTERVAL '14 days' + TIME '17:30-04', --'2020-01-11 17:30-04',
        'Conduct Virtual Technical Interviews',
        'Volunteers will conduct two 45-minute 1:1 technical interviews using a question bank and an interviewing guide. Afterwards, you''ll provide us with feedback through an evaluation form.Interviews will take place virtually over Google Hangouts and repl. We are looking for hiring managers or anyone who conducts interviews regularly.',
        15, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101',
        'Dessa Shepherd', 20, TRUE  ),

    (   CURRENT_DATE - INTERVAL '7 month' - INTERVAL '9 days' + TIME '10:00-04', --'2019-11-16 10:00-04',
        CURRENT_DATE - INTERVAL '7 month' - INTERVAL '9 days' + TIME '13:00-04', --'2019-11-16 13:00-04',
        '6.2: Professional Skills: Diversity & Inclusion in Tech Workshop',
        'Join us to learn about diversity and inclusion in the workplace and how to foster it.',
        2, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101',
        'Dessa Shepherd', 5, FALSE  ),

    (   CURRENT_DATE - INTERVAL '8 month' - INTERVAL '1 days' + TIME '17:45-04', --'2019-10-24 17:45-04',
        CURRENT_DATE - INTERVAL '8 month' - INTERVAL '1 days' + TIME '20:00-04', --'2019-10-24 20:00-04',
        'Nomad Health Site Visit',
        'Excited to have you join us for the Nomad Health Site Visit!',
        1, '335 Madison Ave 5th Floor, New York, NY 10017',
        'Alexis Medina', 5, FALSE   ),

    (   CURRENT_DATE - INTERVAL '10 month' - INTERVAL '17 days' + TIME '19:00-04', --'2019-08-08 19:00-04',
        CURRENT_DATE - INTERVAL '10 month' - INTERVAL '17 days' + TIME '20:30-04', --'2019-08-08 20:30-04',
        'Industry Fluency: Career Pathways with Dion Ridley',
        'I''m excited to invite you to your first Industry Fluency event - a tech talk with Dion Ridley!',
        1, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101',
        'Jessica Shyu', 5, FALSE   ),

    (   CURRENT_DATE - INTERVAL '1 year' - INTERVAL '2 days' + TIME '10:00-04', --'2019-06-23 10:00-04',
        CURRENT_DATE - INTERVAL '11 month' - INTERVAL '25 days' + TIME '18:00-04', --'2019-06-30 18:00-04',
        '6.2 Welcome Week',
        'Let’s Welcome our new group of full-stack fellows to their first week at Pursuit.',
        14, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101',
        'Jessica Shyu', 20, TRUE  ),


    -- ONGOING  ============
    (   CURRENT_DATE - INTERVAL '2 month' - INTERVAL '3 days' + TIME '10:00-04', --'2020-03-22 10:00-04',
        CURRENT_DATE + INTERVAL '28 days' + TIME '20:00-04', --'2020-06-29 20:00-04',
        '6.2 Capstone-Building Period',
        'Each year at the close of our technical curriculum, Pursuit Fellows work in teams to build fully-functional apps that they present at our annual Demo Days. This is a critical milestone in their journeys to become professional software developers: Fellows have the opportunity to work in teams while honing their design and presentation skills. Fellows will have a portfolio-worthy project they can show off to potential employers. Industry volunteers provide weekly and on-hand mentorship through this entire period.',
        15, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101',
        'Alejandro Franco', 25, TRUE   ),


    -- FUTURE ==============
    (   CURRENT_DATE + INTERVAL '2 days' + TIME '13:00-04', --'2020-07-01 13:00-04',
        CURRENT_DATE + INTERVAL '2 days' + TIME '13:45-04', --'2020-07-01 13:45-04',
        'Let''s Do Remote Lunch!',
        'Spend your WFH lunch break with 6-10 of our Fellows! Chat about anything! Get to know our Fellows and share your path to tech. We''ll share a list of possible topics as well. We''ll have 3 "Lunch Rooms" over Zoom each day so please choose more than 1 day in case dates get filled up. I''ll reach back out to confirm your date.',
        1, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101',
        'Jessica Shyu', 6, FALSE  ),

    (   CURRENT_DATE + INTERVAL '4 days' + TIME '10:00-04',
        CURRENT_DATE + INTERVAL '4 days' + TIME '10:45-04',
        'Let''s Do Remote Breakfast!',
        'Spend a WFH breakfast break with 6-10 of our Fellows! Chat about anything! Get to know our Fellows and share your path to tech. We''ll share a list of possible topics as well. We''ll have 3 "Breakfast Rooms" over Zoom each day so please choose more than 1 day in case dates get filled up. I''ll reach back out to confirm your date.',
        1, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101',
        'Jessica Shyu', 6, FALSE  ),

    (   CURRENT_DATE + INTERVAL '11 days' + TIME '10:00-04', --'2020-07-13 10:00-04',
        CURRENT_DATE + INTERVAL '11 days' + TIME '15:00-04', --'2020-07-13 15:00-04',
        'Pursuit + ACME DTC Host the 6.2 FullStack Web Technical Showcase',
        'After several intensive months of training, Pursuit’s 6.2 FullStack Web fellows have spent the past 8 weeks working with volunteer mentors to build their capstone projects - original and innovative web applications from ideation to deployment. The Technical Showcase is an opportunity for Fellows to present their projects to industry professionals and receive technical feedback on their projects and pitches.  We are thrilled to partner with Clorox DTC on this event to celebrate the accomplishments of the 6.2 FullStack Web Fellows and further our shared goal of creating access to opportunity for everyone.  Join us to celebrate!',
        10, 'Zoom: https://zoom.us/my/alejos',
        'Dessa Shepherd', 10, TRUE  );

        
INSERT INTO event_volunteers
    (eventv_id, volunteer_id, confirmed, volunteered_time)
VALUES
    (1, 1, TRUE, 8),
    (1, 2, TRUE, 8),
    (1, 10, TRUE, 8),
    (1, 6, TRUE, 8),
    (2, 2, TRUE, 2),
    (2, 3, TRUE, 3),
    (3, 1, TRUE, 1),
    (4, 2, FALSE, 0),
    (4, 3, FALSE, 0),
    (4, 6, TRUE, 4),    -- 10
    (5, 4, FALSE, 0),
    (5, 5, FALSE, 0),
    (5, 6, TRUE, 4),
    (5, 7, FALSE, 0),
    (6, 8, FALSE, 0),
    (6, 9, FALSE, 0),
    (6, 6, TRUE, 5),
    (7, 10, FALSE, 0),
    (8, 10, TRUE, 2),
    (8, 6, TRUE, 2),    -- 20
    (8, 3, FALSE, 0),
    (9, 4, FALSE, 0),
    (9, 5, FALSE, 0),
    (10, 6, TRUE, 5),
    (11, 6, TRUE, 3),
    (12, 6, TRUE, 2),
    (13, 6, TRUE, 2),
    (14, 6, TRUE, 3),
    (15, 6, TRUE, 4),
    (16, 6, TRUE, 6),
    (17, 6, TRUE, 3),   -- 30
    (18, 6, TRUE, 5),
    (19, 6, TRUE, 3),
    (20, 6, TRUE, 8),
    (20, 10, TRUE, 7),
    (20, 1, TRUE, 5),
    (20, 2, TRUE, 12),
    (21, 9, TRUE, 1),
    (21, 10, TRUE, 1),
    (21, 3, TRUE, 1),
    (22, 6, TRUE, 1), -- 40
    (22, 4, TRUE, 1),
    (22, 1, TRUE, 1),
    (23, 7, TRUE, 5),
    (23, 10, TRUE, 5),
    (23, 9, TRUE, 5);


INSERT INTO event_fellows
    (eventf_id, fellow_id)
VALUES
    (1, 1),
    (1, 2),
    (1, 10),
    (2, 2),
    (2, 3), -- 5
    (3, 1),
    (4, 2),
    (4, 3),
    (5, 4),
    (5, 5), -- 10
    (5, 6),
    (5, 7),
    (6, 8),
    (6, 9),
    (7, 10), -- 15
    (8, 3),
    (9, 4),
    (9, 5);

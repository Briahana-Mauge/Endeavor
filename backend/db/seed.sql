DROP DATABASE IF EXISTS capstone_project_db;
CREATE DATABASE capstone_project_db;

\c capstone_project_db

DROP TABLE IF EXISTS volunteers_hours;
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

CREATE TABLE skills (
    skill_id SERIAL PRIMARY KEY,
    skill VARCHAR (100) NOT NULL,
    parsed_skill VARCHAR (100) UNIQUE NOT NULL,
    deleted DATE DEFAULT NULL
);

CREATE TABLE cohorts (
    cohort_id SERIAL PRIMARY KEY,
    cohort VARCHAR (10) UNIQUE NOT NULL,
    deleted DATE DEFAULT NULL
);

CREATE TABLE users_data (
    user_email VARCHAR (50) PRIMARY KEY,
    password VARCHAR,
    role VARCHAR (10) NOT NULL,
    deleted DATE DEFAULT NULL
);

CREATE TABLE administration (
    a_id SERIAL PRIMARY KEY,
    a_first_name VARCHAR (30) NOT NULL,
    a_last_name VARCHAR (30) NOT NULL,
    a_email VARCHAR (50) UNIQUE NOT NULL REFERENCES users_data(user_email) ON UPDATE CASCADE,
    admin BOOLEAN NOT NULL DEFAULT FALSE,
    deleted DATE DEFAULT NULL
);

CREATE TABLE volunteers (
    v_id SERIAL PRIMARY KEY,
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
    tech_mock_interview  BOOLEAN NOT NULL DEFAULT FALSE,
    behavioral_mock_interview BOOLEAN NOT NULL DEFAULT FALSE,
    professional_skills_coach BOOLEAN NOT NULL DEFAULT FALSE,
    hosting_site_visit BOOLEAN NOT NULL DEFAULT FALSE,
    industry_speaker BOOLEAN NOT NULL DEFAULT FALSE,
    signup_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_DATE,
    public_profile BOOLEAN NOT NULL DEFAULT FALSE,
    inactive_date DATE,
    deleted DATE DEFAULT NULL
);

CREATE TABLE fellows (
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
    deleted DATE DEFAULT NULL
);

CREATE TABLE volunteer_skills (
    vs_id SERIAL PRIMARY KEY,
    volunteer_id INT NOT NULL REFERENCES volunteers(v_id),
    skill_id INT NOT NULL REFERENCES skills(skill_id),
    deleted DATE DEFAULT NULL
);

CREATE TABLE mentor_pairs (
    m_id SERIAL PRIMARY KEY,
    mentor INT NOT NULL REFERENCES volunteers(v_id),
    mentee INT NOT NULL REFERENCES fellows(f_id),
    m_active BOOLEAN NOT NULL DEFAULT TRUE,
    starting_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_DATE,
    deleted DATE DEFAULT NULL
);

CREATE TABLE events (
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

CREATE TABLE event_volunteers (
    ev_id SERIAL PRIMARY KEY,
    eventv_id INT NOT NULL REFERENCES events(event_id),
    volunteer_id INT NOT NULL REFERENCES volunteers(v_id),
    confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    volunteered_time INT NOT NULL DEFAULT 0,
    deleted DATE DEFAULT NULL,
    UNIQUE (eventv_id, volunteer_id)
);

CREATE TABLE event_fellows (
    ef_id SERIAL PRIMARY KEY,
    eventf_id INT NOT NULL REFERENCES events(event_id),
    fellow_id INT NOT NULL REFERENCES fellows(f_id),
    deleted DATE DEFAULT NULL,
    UNIQUE (eventf_id, fellow_id)
);

CREATE TABLE volunteers_hours (
    vh_id SERIAL PRIMARY KEY,
    volunteer_id INT NOT NULL REFERENCES volunteers(v_id),
    banked_time INT NOT NULL DEFAULT 0,
    planned_time INT NOT NULL DEFAULT 0,
    deleted DATE DEFAULT NULL
);


-- SEEDING DATABASE

INSERT INTO skills (skill, parsed_skill) VALUES 
    ('Javascript', 'javascript'),
    ('React', 'react'),
    ('React Native', 'reactnative'),
    ('Angular', 'angular'),
    ('Ruby on Rails', 'rubyonrails'),
    ('Django', 'django'),
    ('Flask', 'Flask'),
    ('Java', 'java'),
    ('Swift', 'swift'),
    ('Objective-C', 'objectivec'),    -- 10
    ('Python', 'python'),
    ('R', 'r'),
    ('Scala', 'scala'),
    ('HTML', 'html'),
    ('CSS', 'scc'),    -- 15
    ('Professional Communication', 'professionalcommunication'),
    ('Personal Narrative, and Pop Pitches', 'personalnarrativeandpoppitches'),
    ('Written Communication', 'writtencommunication'),
    ('Resumes, LinkedIn, and Cover Letters', 'resumeslinkedinandcoverletters'),
    ('Project Management: Roles, Tools, and Best Practices', 'projectmanagementrolestoolsandbestpractices'),
    ('Product Design, UX, and Prototyping', 'productdesignuxandprototyping'),
    ('Company Research', 'companyresearch'),
    ('Negotiations', 'negotiations'),
    ('Talking About Tech Projects in Interviews', 'talkingabouttechprojectsininterviews'),
    ('Personal Finance', 'personalfinance');   -- 25


INSERT INTO cohorts (cohort) VALUES
    ('General'),
    ('Candidates'),
    ('4.0'),
    ('4.1'),
    ('4.2'),    -- 5
    ('4.3'),
    ('4.4'),
    ('5.0'),
    ('5.1'),
    ('5.2'),    -- 10
    ('5.3'),
    ('5.4'),
    ('6.0'),
    ('6.1'),
    ('6.2'),    -- 15
    ('6.3'),
    ('6.4');


INSERT INTO users_data (user_email, password, role) VALUES
    ('admin@superpower.dev', '$2b$12$BnlkuACZiHUs8h0TLWejv.NaSyBXQGNWnczdYt8KrdDEDV9VHQ4/O', 'admin'),
    ('alexis@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'admin'),

    ('alejo@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'staff'),
    ('dessa@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'staff'),
    
    ('dlopez@gmail.com', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'volunteer'),
    ('chall@gmail.com', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'volunteer'),
    ('jsimmons@gmail.com', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'volunteer'),    -- 5
    ('cbarnes@gmail.com', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'volunteer'),
    ('pyoung@gmail.com', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'volunteer'),
    ('jevans@gmail.com', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'volunteer'),
    ('bsimpson@gmail.com', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'volunteer'),
    ('jparker@gmail.com', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'volunteer'),     -- 10
    ('kwood@gmail.com', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'volunteer'),
    ('tpotter@gmail.com', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'volunteer'),
    
    ('aransagarcia@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('briahanamauge@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('brianytaveras@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),    -- 15
    ('chukwukaokonkwoaguolu@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('dantaeflowers@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('douglasmackrell@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('gisellesanchez113@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('hupaulcamacho@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),    -- 20
    ('jeneshnapit@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('johanneenama@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('jonathanfagan@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('josephpasaoa@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('kadijahwilson@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),    -- 25
    ('kameronmontague@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('kathypuma@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('maliqtaylor@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('michaelamparo@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('owenjones@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),    -- 30
    ('peterfiorentino@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('sandracardona@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('savitamadray@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('sergiocohensalama@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('sherrarkhan@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),  -- 35
    ('suzetteislam@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('voneilbrown@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('aminebensalem@pursuit.org', '$2b$12$raSIhSMs84t9i75CsFdE5.L66Cqt5Ew.cbwuPW1M5VXM2rR.Xwh0W', 'fellow'),
    ('karenmorisset@pursuit.org', NULL, 'fellow');


INSERT INTO administration (a_first_name, a_last_name, a_email, admin) VALUES
    ('Admin', 'Admin', 'admin@superpower.dev', TRUE),
    ('Alexis', 'Medina', 'alexis@pursuit.org', TRUE),
    ('Alejo', 'Franco', 'alejo@pursuit.org', FALSE),
    ('Dessa', 'Shepherd', 'dessa@pursuit.org', FALSE);


INSERT INTO volunteers 
    (
        v_first_name, 
        v_last_name, 
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
        public_profile
    )
    VALUES 
    ('Daniel', 'Lopez', 'dlopez@gmail.com', 'https://pursuit-volunteer-management.s3.us-east-2.amazonaws.com/Daniel+Lopez.jpg', 'Capital One', 'capitalone', 'Software Engineer', TRUE, TRUE, FALSE, FALSE, TRUE, FALSE, FALSE, TRUE),
    ('Christina', 'Hall', 'chall@gmail.com', 'https://pursuit-volunteer-management.s3.us-east-2.amazonaws.com/Christina+Hall.jpg', 'Google', 'google', 'HR', FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, TRUE, TRUE),
    ('Judith', 'Simmons', 'jsimmons@gmail.com', 'https://pursuit-volunteer-management.s3.us-east-2.amazonaws.com/Judith+Simmons.jpeg', 'WayFaire', 'wayfaire', 'Software Engineer', TRUE, TRUE, TRUE, FALSE, TRUE, FALSE, FALSE, TRUE),
    ('Catherine', 'Barnes', 'cbarnes@gmail.com', 'https://pursuit-volunteer-management.s3.us-east-2.amazonaws.com/Catherine+Barnes.jpg', 'JustWorks', 'justworks', 'Software Engineer', FALSE, TRUE, TRUE, TRUE, FALSE, FALSE, TRUE, TRUE),
    ('Pamela', 'Young', 'pyoung@gmail.com', 'https://pursuit-volunteer-management.s3.us-east-2.amazonaws.com/Pamela+Young.png', 'JPMorganChase', 'pjmorganchase', 'Hiring Manager', FALSE, FALSE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE),    -- 5
    ('John', 'Evans', 'jevans@gmail.com', 'https://pursuit-volunteer-management.s3.us-east-2.amazonaws.com/John+Evans.jpg', 'Google', 'google', 'Tech Lead', TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE),
    ('Bonnie', 'Simpson', 'bsimpson@gmail.com', 'https://pursuit-volunteer-management.s3.us-east-2.amazonaws.com/Bonnie+Simpson.jpeg', 'The New York Times', 'thenewyorktimes', 'CEO', FALSE, FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, TRUE),
    ('Joseph', 'Parker', 'jparker@gmail.com', 'https://pursuit-volunteer-management.s3.us-east-2.amazonaws.com/Joseph+Parker.jpg', 'Spotify', 'spotify', 'Web Designer', TRUE, TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, TRUE),
    ('Kenneth', 'Wood', 'kwood@gmail.com', 'https://pursuit-volunteer-management.s3.us-east-2.amazonaws.com/Kenneth+Wood.jpeg', 'Capital One', 'capitalone', 'Mobile Software Engineer', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE),
    ('Thomas', 'Potter', 'tpotter@gmail.com', 'https://pursuit-volunteer-management.s3.us-east-2.amazonaws.com/Thomas+Potter.jpg', 'Google', 'google', 'Senior Software Engineer', TRUE, TRUE, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE);   -- 10


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
        ('Dantae', 'Flowers', 'dantaeflowers@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560530979291-X9I360C7R31F7JETAYA6/ke17ZwdGBToddI8pDm48kLK3I0Z43aBzb4w_UM_qHfN7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1UdQoFEQLeDyX73sQsVArkbUGuSBuG9P2GFHvSOhXJ3qhZ5819XDE-T-fE_EmFUjQwQ/20190602_184443+-+Dantae+Flowers.jpg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 15, FALSE),     -- 5
        ('Douglas', 'Mackrell', 'douglasmackrell@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560531385717-F0JD62XFT2H18DA2KPFT/ke17ZwdGBToddI8pDm48kLxnK526YWAH1qleWz-y7AFZw-zPPgdn4jUwVcJE1ZvWEtT5uBSRWt4vQZAgTJucoTqqXjS3CfNDSuuf31e0tVH33scGBZjC30S7EYewNF5iKKwhonf2ThqWWOBkLKnojuqYeU1KwPvsAK7Tx5ND4WE/Douglas+MacKrell+-+Douglas+MacKrell.jpg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 15, FALSE),
        ('Giselle', 'Sanchez', 'gisellesanchez113@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560873032585-MPI074P0WCM8D6JX3QOZ/ke17ZwdGBToddI8pDm48kLxnK526YWAH1qleWz-y7AFZw-zPPgdn4jUwVcJE1ZvWEtT5uBSRWt4vQZAgTJucoTqqXjS3CfNDSuuf31e0tVH33scGBZjC30S7EYewNF5iKKwhonf2ThqWWOBkLKnojuqYeU1KwPvsAK7Tx5ND4WE/GiselleSanchez+-+Giselle+Sanchez.JPG?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 15, FALSE),
        ('Hupaul', 'Hamacho', 'hupaulcamacho@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560531427320-O9FOSJJB5Y1DC10A8U3X/ke17ZwdGBToddI8pDm48kIyvoTDOqK6tuLbY8s33gHl7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1UTzjvHSAOXjnTxN2sJb-n4pP61BYfWtluh1bxbCEA7ounr1xKjsq_-rO8kOgOtwYvw/Hupaul_Camacho+-+Hupaul+Camacho.jpg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 15, FALSE),
        ('Jenesh', 'Napit', 'jeneshnapit@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560531476754-DYU1618LN22D93PV4RBP/ke17ZwdGBToddI8pDm48kDu19ZQ_w9wAMJI6dbWnlCR7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QHyNOqBUUEtDDsRWrJLTmmV5_8-bAHr7cY_ioNsJS_61TwOmkAvvlADGd1IlbhMogFKngaLShotgJgXNsogyy/Jenesh+Napit+-+J+N.jpg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 15, FALSE),
        ('Johanne', 'Enama', 'johanneenama@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560531683715-FRXW9LO1PJ1RW0AKXQXX/ke17ZwdGBToddI8pDm48kEbpNpz_g84ww2Q11MA-atpZw-zPPgdn4jUwVcJE1ZvWEtT5uBSRWt4vQZAgTJucoTqqXjS3CfNDSuuf31e0tVFBtEgj52mM8uXJqXwNJ9DglJgC4wo-TZ2620CX9P9wUp1zDMfxjoXGDCxwz3Y9Vxg/IMG_0653+-+Johanne+Enama.JPG?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 15, FALSE),      -- 10
        ('Jonathan', 'Fagan', 'jonathanfagan@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560531716112-F0EUEVBHACM86HNYG46Y/ke17ZwdGBToddI8pDm48kNvfEZRbwokPF2q5mMkb1Nh7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1UdPvmgaeWlm56t9ZuepLa55e6Ou0uLXHCxlVMnrwj7FrfMr1ALBGPwRYe3hA7r_F-g/400F4467-4112-489D-8B4B-8677057579A2+-+Jonathan+Fagan.jpeg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 15, FALSE),
        ('Joseph', 'Pasaoa', 'josephpasaoa@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560531611710-G2ZYMX7XVVYNDVXJJ1EP/ke17ZwdGBToddI8pDm48kMh3mVmBaCAeGwqCLG3iONRZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PIarJWwnumkapRz_nmTYj1dpaH2rx--_BA62nv3IYPJxMKMshLAGzx4R3EDFOm1kBS/Joseph+Pasaoa+-+Joseph+Pasaoa.jpg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 15, TRUE),
        ('Kadijah', 'Wilson', 'kadijahwilson@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560531743351-8IX3VB0DTBABUCE32XZT/ke17ZwdGBToddI8pDm48kLxnK526YWAH1qleWz-y7AFZw-zPPgdn4jUwVcJE1ZvWEtT5uBSRWt4vQZAgTJucoTqqXjS3CfNDSuuf31e0tVH33scGBZjC30S7EYewNF5iKKwhonf2ThqWWOBkLKnojuqYeU1KwPvsAK7Tx5ND4WE/Kadijah+Wilson+-+Kadijah+Wilson.jpg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 15, FALSE),
        ('Kameron', 'Montague', 'kameronmontague@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560531871462-OC3ZXCU63874VCDKTC96/ke17ZwdGBToddI8pDm48kD6h-vx4-FgEfJblrbYfV8N7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QHyNOqBUUEtDDsRWrJLTmujyyI7Frso6MRdplGTbhDkcnOna2UXrFZnIvXKJZ1oY6m8RtTbEUH8lrGuEN6ChB/20190603_075737+-+Kameron+Montague.jpg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 16, FALSE),
        ('Kathy', 'Puma', 'kathypuma@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560531955349-84RWQIOGMW8ATJBW7Y7N/ke17ZwdGBToddI8pDm48kJ0udFXALvwRTY2nqxSwmGZ7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QHyNOqBUUEtDDsRWrJLTmD3GJgI7_jN764QbmlaUTk_05Sl85_BCpZqR9YU6evPqDWdj5sB1TMq9gpLfZRgCW/KathyPuma+-+Kathy+Puma.JPG?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 16, FALSE),        -- 15
        ('Maliq', 'Taylor', 'maliqtaylor@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560872957963-VAEEFXTKACECK91ORZ1J/ke17ZwdGBToddI8pDm48kMG0E-tUfUxlWwQnnagUgmlZw-zPPgdn4jUwVcJE1ZvWhcwhEtWJXoshNdA9f1qD7Xj1nVWs2aaTtWBneO2WM-uNp3MZLdlvMDnwUM19q3mRhWFjwSjHHdMViu5WjoAASg/thumbnail_IMG_3077+-+Malik+Taylor.jpg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 16, FALSE),
        ('Michael', 'Amparo', 'michaelamparo@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560531982425-WWQG4XDEXECKZ2OR5UQ7/ke17ZwdGBToddI8pDm48kMP-y0ulEMSpv5gX1QhW0clZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpwidEfjveN8J3Sz3N_e-OGLGIq4HVrEGtszKD9lLLpeOpVO5tXjPCMkls8IvG2Ko2E/Michael+Amparo+-+Michael+Amparo.jpeg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 16, FALSE),
        ('Owen', 'Jones', 'owenjones@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560532118380-XK9TH50TZCKNXKYLRRAD/ke17ZwdGBToddI8pDm48kLqfNUGDg3QRi74Yamko8iJZw-zPPgdn4jUwVcJE1ZvWEtT5uBSRWt4vQZAgTJucoTqqXjS3CfNDSuuf31e0tVGzJfqEA1LHv3wwoAJhJYc_UjkTq_5sUsJomuW6NrY3Jd1lH3P2bFZvTItROhWrBJ0/Owen_Jones+-+Owen+Jones.PNG?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 16, FALSE),
        ('Peter', 'Fiorentino', 'peterfiorentino@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560532171622-Y0NRJ1P8LNWXQTM9NETF/ke17ZwdGBToddI8pDm48kDNKJkkHfcQ1Ka9tYyPB1EpZw-zPPgdn4jUwVcJE1ZvWEtT5uBSRWt4vQZAgTJucoTqqXjS3CfNDSuuf31e0tVFaezuRw0Goi25qydjJw8p9fGaAFNcxQSKtYMZQUT-G_WQ6l2WM7tn7mqHTODzkmeM/0+-+Peter+Fiorentino.png?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 16, FALSE),
        ('Sandra', 'Cardona', 'sandracardona@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560532385998-UQGRH8RG4XOPP8JQ7PND/ke17ZwdGBToddI8pDm48kL-PDEV0kc4nkv6ZO74dbct7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1UfdVC79UZfxPkMeg9HFyXpQQifYSi4HMBv5Z68sTGDeU_XaCZ2eR_PUwOvzfpR6u4g/FullSizeR1+-+Elisandra+Cardona.jpg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 16, FALSE),       -- 20
        ('Savita', 'Madray', 'savitamadray@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560532398348-01ND81699RNEAO9ZH3DJ/ke17ZwdGBToddI8pDm48kKYvdQumIDj9qG9OlL8COhx7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QHyNOqBUUEtDDsRWrJLTmQyViSO8WVy1F2YAzXWvEVMDBYS3Udm7hP-QZUVwor4BA4obUG8hEJXVUIqmpbYxa/image-asset.jpeg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 17, FALSE),
        ('Sergio', 'Cohen Salama', 'sergiocohensalama@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560532406144-GEHJ6E9Y5G37VNXJ79Y3/ke17ZwdGBToddI8pDm48kCp2RdAXEQdFxZnjIuF2wjFZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpyiYDEmVWOoBuBv4mqCrTnhkkiFnqTkVzUDNGgRrOBdhUXgq7zkCJpM6xaIWraL4GU/Sergio+Cohen-Salama+-+Sergio+Cohen+Salama.JPG?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 17, FALSE),
        ('Sherrar', 'Khan', 'sherrarkhan@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560872782658-GEX1B4ERPLVMXZRIAMGV/ke17ZwdGBToddI8pDm48kFfxr8v8XLMrFSuxnICQvbNZw-zPPgdn4jUwVcJE1ZvWEtT5uBSRWt4vQZAgTJucoTqqXjS3CfNDSuuf31e0tVE0P2lywwjo358iJ-eaGZd-qJqGqu4BIGg77SPZQsf1OouREhlBnM3BHiO9U5XZb6E/image-asset.jpeg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 17, FALSE),
        ('Suzette', 'Islam', 'suzetteislam@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560532619099-B2IJX5S7UAC9OXRPOBJJ/ke17ZwdGBToddI8pDm48kHFnmntegnVXpN4y4ldn3ixZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpxco7Gi2cI2YfBk8ZWdc_m6Xcr86dXh8TsiE3NyioNRZj9sD37Ved1vsRvl2h0UxBw/21106008_10155719062433750_5374603742919262310_n+-+Suzette+Islam.jpg?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 17, FALSE),
        ('Voneil', 'Brown', 'voneilbrown@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560532080500-JM8Q6W23CHMMO3V16UY3/ke17ZwdGBToddI8pDm48kJbosy0LGK_KqcAZRQ_Qph1Zw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpzowLjssSnFpmmA9R97e_dXIFE6pyBEPVtt1QRhHppUHFVIdzCuVAmPBGAxTKnN90Q/Voniel+Brown+-+Von+Brown.png?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 17, FALSE),        -- 25
        ('Amine', 'Bensalem', 'aminebensalem@pursuit.org', 'https://images.squarespace-cdn.com/content/v1/5b50ebb7e749401857e16f2f/1560530145270-P86FODAN0DEP75WV44TT/ke17ZwdGBToddI8pDm48kCMOzc4GiK3dsNqiUCo6wrh7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QHyNOqBUUEtDDsRWrJLTmLLxGPZs9cXJqW7PQ94qJw_PXe0-aBO9Nk8dpGJ5ZKQqQP0CxanRMUAlhQx1QfmRy/Amine+Bensalem+-+Amine+Bensalem.JPG?format=500w', 'https://www.linkedin.com/', 'https://github.com/', 17, TRUE);
    

INSERT INTO volunteer_skills (volunteer_id, skill_id) VALUES
    (1, 1),
    (1, 2),
    (1, 21),
    (2, 16),
    (2, 18),    -- 5
    (2, 19),
    (3, 1),
    (3, 2),
    (3, 4),
    (4, 3),     -- 10
    (4, 9),
    (5, 16),
    (5, 17),
    (5, 18),
    (5, 19),    -- 15
    (5, 22),
    (5, 23),
    (6, 1),
    (6, 2),
    (6, 4),     -- 20
    (6, 8),
    (6, 10),
    (6, 20),
    (6, 24),
    (7, 16),    -- 25
    (7, 17),
    (7, 18),
    (7, 23),
    (7, 25),
    (8, 14),    -- 30
    (8, 15),
    (8, 21),
    (9, 3),
    (9, 5),
    (9, 9),     -- 35
    (10, 1),
    (10, 2),
    (10, 4),
    (10, 8),
    (10, 10),   -- 40
    (10, 20),
    (10, 24);


INSERT INTO mentor_pairs (mentor, mentee, starting_date) VALUES
    (1, 1, '2019-09-01'),
    (3, 3, '2019-09-10'),
    (6, 5, '2019-09-20'),
    (8, 7, '2019-09-30'),
    (8, 9, '2019-10-01'),   -- 5
    (10, 11, '2019-10-10'),
    (1, 13, '2019-10-20'),
    (3, 15, '2019-10-30'),
    (6, 17, '2019-11-01'),
    (8, 19, '2019-11-10'),  -- 10
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
    ('2020-03-22 10:00-04', '2020-06-22 20:00-04', 'BE A CAPSTONE TECHNICAL MENTOR', 
    'Each year at the close of our technical curriculum, Pursuit Fellows work in teams to build fully-functional apps that they present at our annual Demo Days. This is a critical milestone in their journeys to become professional software developers: Fellows have the opportunity to work in teams while honing their design and presentation skills. Fellows will have a portfolio-worthy project they can show off to potential employers', 
    15, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101', 'Alejandro Franco', 9, TRUE),

    ('2020-04-29 13:00-04', '2020-04-29 13:45-04', 'Let''s Do Remote Lunch!', 
    'Spend your WFH lunch break with 6 of our Fellows! Chat about anything! Get to know our Fellows and share your path to tech. We''ll share a list of possible topics as well. We''ll have 3 "Lunch Rooms" over Zoom each day so please choose more than 1 day in case dates get filled up. I''ll reach back out to confirm your date.', 
    1, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101', 'Jessica Shyu', 20, FALSE),

    ('2020-05-12 13:00-04', '2020-05-12 13:45-04', 'Let''s Do Remote Lunch!', 
    'Spend your WFH lunch break with 6 of our Fellows! Chat about anything! Get to know our Fellows and share your path to tech. We''ll share a list of possible topics as well. We''ll have 3 "Lunch Rooms" over Zoom each day so please choose more than 1 day in case dates get filled up. I''ll reach back out to confirm your date.', 
    1, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101', 'Jessica Shyu', 20, FALSE),

    ('2020-05-22 13:00-04', '2020-05-22 13:45-04', 'Let''s Do Remote Lunch!', 
    'Spend your WFH lunch break with 6 of our Fellows! Chat about anything! Get to know our Fellows and share your path to tech. We''ll share a list of possible topics as well. We''ll have 3 "Lunch Rooms" over Zoom each day so please choose more than 1 day in case dates get filled up. I''ll reach back out to confirm your date.', 
    1, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101', 'Jessica Shyu', 20, FALSE),

    ('2020-02-22 13:00-04', '2020-02-22 13:45-04', 'Let''s Do Remote Lunch!', 
    'Spend your WFH lunch break with 6 of our Fellows! Chat about anything! Get to know our Fellows and share your path to tech. We''ll share a list of possible topics as well. We''ll have 3 "Lunch Rooms" over Zoom each day so please choose more than 1 day in case dates get filled up. I''ll reach back out to confirm your date.', 
    1, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101', 'Jessica Shyu', 20, FALSE),   -- -- -- 5

    ('2020-02-29 13:00-04', '2020-02-29 13:45-04', 'Let''s Do Remote Lunch!', 
    'Spend your WFH lunch break with 6 of our Fellows! Chat about anything! Get to know our Fellows and share your path to tech. We''ll share a list of possible topics as well. We''ll have 3 "Lunch Rooms" over Zoom each day so please choose more than 1 day in case dates get filled up. I''ll reach back out to confirm your date.', 
    1, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101', 'Jessica Shyu', 20, FALSE),

    ('2020-03-12 13:00-04', '2020-03-12 13:45-04', 'Let''s Do Remote Lunch!', 
    'Spend your WFH lunch break with 6 of our Fellows! Chat about anything! Get to know our Fellows and share your path to tech. We''ll share a list of possible topics as well. We''ll have 3 "Lunch Rooms" over Zoom each day so please choose more than 1 day in case dates get filled up. I''ll reach back out to confirm your date.', 
    1, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101', 'Jessica Shyu', 20, FALSE),

    ('2020-03-22 13:00-04', '2020-03-22 13:45-04', 'Let''s Do Remote Lunch!', 
    'Spend your WFH lunch break with 6 of our Fellows! Chat about anything! Get to know our Fellows and share your path to tech. We''ll share a list of possible topics as well. We''ll have 3 "Lunch Rooms" over Zoom each day so please choose more than 1 day in case dates get filled up. I''ll reach back out to confirm your date.', 
    1, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101', 'Jessica Shyu', 20, FALSE),

    ('2020-04-22 13:00-04', '2020-04-22 13:45-04', 'Let''s Do Remote Lunch!', 
    'Spend your WFH lunch break with 6 of our Fellows! Chat about anything! Get to know our Fellows and share your path to tech. We''ll share a list of possible topics as well. We''ll have 3 "Lunch Rooms" over Zoom each day so please choose more than 1 day in case dates get filled up. I''ll reach back out to confirm your date.', 
    1, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101', 'Jessica Shyu', 20, FALSE),

    ('2020-04-02 17:30-04', '2020-04-02 19:30-04', 'Code Review on Hackathon Projects', 
    'Join a group of 4 Fellows on April 2nd at 5:30pm to review their Hackathon projects.You''ll provide feedback to help them to help improve and implement new features. We''ll review the rubric you''ll use to evaluate the projects and then you''ll work with the groups remotely until 7:30pm. A week later, you''ll find time with the group to follow-up and review their final products. Volunteers must know Javascript, React, Node.js, PostgresSQL and Express. We are looking for 6 Volunteers.', 
    15, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101', 'Alejandro Franco', 6, TRUE),   -- -- -- 10

    ('2020-05-21 18:00-04', '2020-05-21 20:00-04', 'Conduct Virtual Behavioral Interviews', 
    'Volunteers will conduct two 45-minute 1:1 behavioral interviews using a sample job description and an interviewing guide, Afterwards, you''ll provide us with feedback through an evaluation form.Interviews will take place virtually over Google Hangouts. We are looking for hiring managers or anyone who conducts interviews regularly. Engineers or tech-adjacent roles are a plus!', 
    15, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101', 'Dessa Shepherd', 10, TRUE),

    ('2020-05-21 18:00-04', '2020-05-21 20:00-04', 'Conduct Virtual Technical Interviews', 
    'Volunteers will conduct two 45-minute 1:1 technical interviews using a question bank and an interviewing guide, Afterwards, you''ll provide us with feedback through an evaluation form.Interviews will take place virtually over Google Hangouts and repl. We are looking for hiring managers or anyone who conducts interviews regularly.', 
    15, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101', 'Dessa Shepherd', 10, TRUE),

    ('2020-04-28 18:00-04', '2020-04-28 20:00-04', 'Conduct Virtual Behavioral Interviews', 
    'Volunteers will conduct two 45-minute 1:1 behavioral interviews using a sample job description and an interviewing guide, Afterwards, you''ll provide us with feedback through an evaluation form.Interviews will take place virtually over Google Hangouts. We are looking for hiring managers or anyone who conducts interviews regularly. Engineers or tech-adjacent roles are a plus!', 
    15, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101', 'Dessa Shepherd', 10, TRUE),

    ('2020-04-28 18:00-04', '2020-04-28 20:00-04', 'Conduct Virtual Technical Interviews', 
    'Volunteers will conduct two 45-minute 1:1 technical interviews using a question bank and an interviewing guide, Afterwards, you''ll provide us with feedback through an evaluation form.Interviews will take place virtually over Google Hangouts and repl. We are looking for hiring managers or anyone who conducts interviews regularly.', 
    15, 'Pursuit HQ: 47-10 Austell Place, 2nd Fl Long Island City, NY 11101', 'Dessa Shepherd', 10, TRUE);
    

INSERT INTO event_volunteers (eventv_id, volunteer_id, confirmed, volunteered_time) VALUES 
    (1, 1, TRUE, 2),
    (1, 2, TRUE, 3),
    (1, 10, TRUE, 1),
    (2, 2, TRUE, 2),
    (2, 3, TRUE, 3),   -- 5
    (3, 1, TRUE, 1),
    (4, 2, FALSE, 0),
    (4, 3, FALSE, 0),
    (5, 4, FALSE, 0),
    (5, 5, FALSE, 0),  -- 10
    (5, 6, FALSE, 0),
    (5, 7, FALSE, 0),
    (6, 8, FALSE, 0),
    (6, 9, FALSE, 0),
    (7, 10, FALSE, 0), -- 15
    (8, 3, FALSE, 0),
    (9, 4, FALSE, 0),
    (9, 5, FALSE, 0);

INSERT INTO event_fellows (eventf_id, fellow_id) VALUES
    (1, 1),
    (1, 2),
    (1, 10),
    (2, 2),
    (2, 3),     -- 5
    (3, 1),
    (4, 2),
    (4, 3),
    (5, 4),
    (5, 5),     -- 10
    (5, 6),
    (5, 7),
    (6, 8),
    (6, 9),
    (7, 10),    -- 15
    (8, 3),
    (9, 4),
    (9, 5);

INSERT INTO volunteers_hours (volunteer_id, banked_time, planned_time) VALUES
    (1, 20, 4),
    (2, 45, 2),
    (3, 23, 3),
    (4, 7, 5),
    (5, 65, 0),     -- 5
    (6, 78, 0),
    (7, 3, 5),
    (8, 44, 7),
    (9, 34, 1),
    (10, 88, 0);    -- 10

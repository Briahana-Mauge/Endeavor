DROP DATABASE IF EXISTS capstone_project_db;
CREATE DATABASE capstone_project_db;

\c capstone_project_db

DROP TABLE IF EXISTS volunteers_hours;
DROP TABLE IF EXISTS fellows_emails;
DROP TABLE IF EXISTS event_volunteers;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS mentor_pairs;
DROP TABLE IF EXISTS fellows;
DROP TABLE IF EXISTS volunteers;
DROP TABLE IF EXISTS administration;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS skills;

CREATE TABLE skills (
    skill_id SERIAL PRIMARY KEY,
    skill VARCHAR (100) NOT NULL
);

CREATE TABLE classes (
    class_id SERIAL PRIMARY KEY,
    class VARCHAR (10) NOT NULL
);

CREATE TABLE administration (
    a_id SERIAL PRIMARY KEY,
    a_first_name VARCHAR (30) NOT NULL,
    a_last_name VARCHAR (30) NOT NULL,
    a_email VARCHAR (30) NOT NULL,
    a_password VARCHAR NOT NULL
);

CREATE TABLE volunteers (
    v_id SERIAL PRIMARY KEY,
    v_first_name VARCHAR (30) NOT NULL,
    v_last_name VARCHAR (30) NOT NULL,
    v_email VARCHAR (30) NOT NULL,
    v_password VARCHAR NOT NULL,
    confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    v_picture VARCHAR,
    company VARCHAR (50) NOT NULL,
    title VARCHAR (50) NOT NULL,
    v_bio VARCHAR,
    v_linkedin VARCHAR (150),
    mentoring BOOLEAN NOT NULL DEFAULT FALSE,
    office_hours BOOLEAN NOT NULL DEFAULT FALSE,
    tech_mock_interview  BOOLEAN NOT NULL DEFAULT FALSE,
    behavioal_mock_interview BOOLEAN NOT NULL DEFAULT FALSE,
    professional_skills_coach BOOLEAN NOT NULL DEFAULT FALSE,
    hosting_site_visit BOOLEAN NOT NULL DEFAULT FALSE,
    industry_speaker BOOLEAN NOT NULL DEFAULT FALSE,
    signup_date DATE NOT NULL DEFAULT CURRENT_DATE,
    nactive_date DATE
);

CREATE TABLE volunteer_skills (
    vs_id SERIAL PRIMARY KEY,
    volunteer_id INT REFERENCES volunteers(v_id),
    skill_id INT REFERENCES skills(skill_id)
);

CREATE TABLE fellows (
    f_id SERIAL PRIMARY KEY,
    f_first_name VARCHAR (30) NOT NULL,
    f_last_name VARCHAR (30) NOT NULL,
    f_email VARCHAR (30) NOT NULL,
    f_password VARCHAR NOT NULL,
    f_picture VARCHAR,
    f_bio VARCHAR,
    f_linkedin VARCHAR (150),
    f_github VARCHAR (150),
    cohort INT REFERENCES classes(class_id),
    want_mentor BOOLEAN NOT NULL DEFAULT FALSE 
);

CREATE TABLE mentor_pairs (
    m_id SERIAL PRIMARY KEY,
    mentor INT REFERENCES volunteers(v_id),
    mentee INT REFERENCES fellows(f_id),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    starting_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    event_date DATE NOT NULL,
    topic VARCHAR (100) NOT NULL,
    description VARCHAR NOT NULL,
    attendees INT REFERENCES classes(class_id),
    location VARCHAR (200) NOT NULL,
    instructor VARCHAR (100) NOT NULL,
    number_of_volunteers INT NOT NULL,
    g_calendar_id VARCHAR,
    materials_url VARCHAR
);

CREATE TABLE event_volunteers (
    e_v_id SERIAL PRIMARY KEY,
    event_id INT REFERENCES events(event_id),
    volunteer_id INT REFERENCES volunteers(v_id),
    confirmed BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE fellows_emails (
    email VARCHAR (30) PRIMARY KEY
);

CREATE TABLE volunteers_hours (
    vh_id SERIAL PRIMARY KEY,
    volunteer_id INT REFERENCES volunteers(v_id),
    banked_time INT NOT NULL DEFAULT 0,
    planned_time INT NOT NULL DEFAULT 0
);

-- SEEDING DATABASE
INSERT INTO skills (skill) VALUES 
    ('Javascript'),
    ('React'),
    ('React Native'),
    ('Angular'),
    ('Rubi on Rails'),
    ('Django'),
    ('Flasl'),
    ('Java'),
    ('Swift'),
    ('Objective-C'),
    ('Python'),
    ('R'),
    ('Scala'),
    ('HTML'),
    ('CSS'),
    ('Professional Communication'),
    ('Personal Narrative and Pop Pitches'),
    ('Written Communication'),
    ('Resumes, LinkedIn and Cover letters'),
    ('Project Management - Roles, tools and Best Practices'),
    ('Product Design, UX + Prototyping'),
    ('Company research'),
    ('Negotiations'),
    ('Talking About Tech Projects in Interviews'),
    ('Personal Finance');
    
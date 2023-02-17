-- Seeing as we will be testing out this script alot we can destroy the db before creating everything again
DROP DATABASE IF EXISTS phoenix;

-- Create the db
CREATE DATABASE phoenix;

-- Move into the db
\c phoenix

-- Create our table if it doesn't already exist
CREATE TABLE IF NOT EXISTS answers_photos
(
    id SERIAL,
    answer_id integer,
    url TEXT
);

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL,
  product_id INTEGER,
  body TEXT,
  date_written TIMESTAMP,
  asker_name TEXT,
  asker_email TEXT,
  reported BOOLEAN,
  helpful INTEGER
);

CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY,
  question_id INTEGER,
  date_written TIMESTAMP,
  answerer_name TEXT,
  answerer_email TEXT,
  reported BOOLEAN,
  helpful INTEGER
);

-- Changes the owner of the table to postgres which is the default when installing postgres
ALTER TABLE answers_photos
    OWNER to postgres;
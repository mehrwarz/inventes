DROP TABLE users;
create TABLE users (
    id serial not null primary key,
    password varchar(64) not null,
    email varchar(15),
    password 
    name
    first_name
    last_name
    phone_number
    profile_picture
    status
    created_at
    updated_at
    verification_code
    role
);

INSERT INTO users (
    username, password, remember
) values(
    'test@example.com',
    'password',
    true
);




DROP TABLE verification_token;
CREATE TABLE verification_token
(
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,
 
  PRIMARY KEY (identifier, token)
);
 
-- DROP TABLE accounts;
CREATE TABLE accounts
(
  id SERIAL,
  "userId" INTEGER NOT NULL,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT,
 
  PRIMARY KEY (id)
);
 
DROP TABLE sessions;
CREATE TABLE sessions
(
  id SERIAL,
  "userId" INTEGER NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL,
 
  PRIMARY KEY (id)
);
 

 
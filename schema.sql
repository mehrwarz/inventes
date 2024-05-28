DROP TABLE users;
create TABLE users (
    id serial not null primary key,
    username varchar(50) not null,
    password varchar(64) not null,
    remember boolean default false,
    status boolean default true
);

INSERT INTO users (
    username, password, remember
) values(
    'test@example.com',
    'password',
    true
)
create table post
(
    id      integer not null
        constraint post_pk
            primary key autoincrement,
    subject text not null,
    content text not null
);

CREATE TABLE category (
                          id          INTEGER NOT NULL
                              CONSTRAINT category_pk PRIMARY KEY AUTOINCREMENT,
                          name        TEXT NOT NULL,
                          description TEXT
);
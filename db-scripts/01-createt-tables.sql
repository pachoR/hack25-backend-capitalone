create table if not exists users (
   client_id   varchar(255),
   purchase_id varchar(255),
   invest_id   varchar(255),
   exec_status int
);

create table if not exists user_rules (
   id            serial primary key,
   client_id     varchar(255),
   description   text,
   min_threshold float,
   max_threshold float,
   percentage    float
);
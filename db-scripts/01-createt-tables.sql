CREATE TYPE exec_status_enum AS ENUM ('ON_GOING', 'EXEC', 'KILLED');
CREATE TYPE transaction_type_enum AS ENUM ('TRANSFER', 'PURCHASE');

CREATE TABLE IF NOT EXISTS users (
   client_id        varchar(255),
   purchase_id      varchar(255),
   invest_id        varchar(255),
   exec_status      exec_status_enum,
   transaction_type transaction_type_enum
);

create table if not exists user_rules (
   id            serial primary key,
   client_id     varchar(255),
   description   text,
   min_threshold float,
   max_threshold float,
   percentage    float
);
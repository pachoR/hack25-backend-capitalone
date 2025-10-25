create table if not exists users (
   client_id   varchar(255),
   purchase_id varchar(255),
   invest_id   varchar(255)
);

create table if not exists user_rules (
   cliend_id     varchar(255),
   min_threshold float,
   max_threshold float,
   percentage    float
)
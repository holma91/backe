/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql(`
    create table token (
      id serial primary key,
      address varchar(42) not null unique,
      name varchar,
      symbol varchar,
      decimals integer not null,
      coingecko_id varchar
    );
    
    create table token_snapshot (
      id serial primary key,
      address varchar(42) not null REFERENCES token(address) ON DELETE CASCADE,
      price_in_usd numeric,
      market_cap_in_usd numeric,
      volume_in_usd numeric,
      snapshot_timestamp timestamp,
      unique(address, snapshot_timestamp)
    );

    create table category (
      id serial primary key,
      coingecko_id varchar(200) unique,
      coingecko_name varchar(200)
    );

    create table token_category (
      id serial primary key,
      token varchar(42) not null REFERENCES token(address) ON DELETE CASCADE,
      category_id varchar(200) not null REFERENCES category(coingecko_id) ON DELETE CASCADE,
      unique(token, category_id)
    )
    `);
};

exports.down = (pgm) => {
    pgm.sql(`
      drop table token_category;
      drop table category;
      drop table token_snapshot;
      drop table token;
    `);
};

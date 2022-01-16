/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql(`
      create table exchange (
        id serial primary key,
        address varchar(42) not null unique,
        account_type varchar(3) not null,
        label varchar
      );
    `);
};

exports.down = (pgm) => {
    pgm.sql(`
      drop table exchange;
    `);
};

/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql(`
      create table account (
        id serial primary key,
        address varchar(42) not null unique
      );
    `);
};

exports.down = (pgm) => {
    pgm.sql(`
      drop table account;
    `);
};

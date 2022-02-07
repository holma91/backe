/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql(`
        create table bridge (
            id serial primary key,
            address varchar(42) not null unique,
            label varchar
        );
    `);
};

exports.down = (pgm) => {
    pgm.sql(`
      drop table bridge;
    `);
};

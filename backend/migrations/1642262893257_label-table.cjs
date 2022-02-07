/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql(`
      create table label (
        id serial primary key,
        label_id varchar not null unique
      );
    `);
};

exports.down = (pgm) => {
    pgm.sql(`
      drop table label;
    `);
};

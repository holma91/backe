/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql(`
      create table account_label (
          address varchar(42) not null references account(address) ON DELETE CASCADE,
          label_id varchar not null
      ); 
    `);
};

exports.down = (pgm) => {
    pgm.sql(`
      drop table account_label;
    `);
};

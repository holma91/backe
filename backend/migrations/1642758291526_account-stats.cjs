/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql(`
        create table account_stats (
            id serial primary key,
            address varchar references account(address) on delete cascade,
            start_value_usd numeric,
            start_value_eth numeric,
            end_value_usd numeric,
            end_value_eth numeric,
            profit_usd numeric,
            profit_eth numeric,
            against_usd numeric,
            against_eth numeric,
            tx_count numeric,
            year varchar(4),
            chain varchar not null,
            unique(address, year)
        );
    `);
    // change to unique(address, year, chain)
};

exports.down = (pgm) => {
    pgm.sql(`
      drop table account_stats;
    `);
};

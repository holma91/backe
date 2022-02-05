/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql(`
    create table account_snapshot (
        id serial primary key,
        address varchar(42) references account(address) on delete cascade,
        account_value_usd numeric,
        account_value_eth numeric,
        profit_usd numeric,
        profit_eth numeric,
        inflow_value_usd numeric,
        inflow_value_eth numeric,
        outflow_value_usd numeric,
        outflow_value_eth numeric,
        snapshot_timestamp timestamp
    );
    `);
};

exports.down = (pgm) => {
    pgm.sql(`
      drop table account_snapshot;
    `);
};

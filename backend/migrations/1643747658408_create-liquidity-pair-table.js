/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql(`
        create table liquidity_pair (
            id serial primary key,
            chain varchar,
            dex varchar,
            pair_address varchar(42),
            token0_address varchar(42),
            token0_name varchar,
            token0_symbol varchar,
            token0_decimals varchar,
            token1_address varchar(42),
            token1_name varchar,
            token1_symbol varchar,
            token1_decimals varchar,
            unique(chain, pair_address)
        );
    `);
};

exports.down = (pgm) => {
    pgm.sql(`
        drop table liquidity_pair;
    `);
};

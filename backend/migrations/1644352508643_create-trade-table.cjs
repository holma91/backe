/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql(`
        create type trade_choice as enum ('buy', 'sell');
        create table trade (
            id serial primary key,
            chain varchar,
            sender_address varchar(42) references account(address),
            pair_address varchar(42),
            token_address varchar(42),
            token_symbol varchar,
            token_price numeric,
            amount numeric,
            on_coingecko boolean,
            trade_timestamp timestamp,
            trade_order trade_choice,
            foreign key (chain, pair_address) references liquidity_pair(chain, pair_address)
        );
    `);
};

exports.down = (pgm) => {
    pgm.sql(`
        drop table trade;
        drop type trade_choice;
    `);
};

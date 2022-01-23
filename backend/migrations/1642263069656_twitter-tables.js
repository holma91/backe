/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql(`
        create table twitter_account (
            id serial primary key,
            username varchar(200) not null unique,
            twitter_id varchar(200) not null unique,
            rank integer
        );

        create table twitter_connection (
            id serial primary key,
            follower_id varchar(200) not null REFERENCES twitter_account(twitter_id) ON DELETE CASCADE,
            followee_id varchar(200) not null REFERENCES twitter_account(twitter_id) ON DELETE CASCADE
        );

        create table ticker_mention (
            id serial primary key,
            username varchar(200) not null REFERENCES twitter_account(username) ON DELETE CASCADE,
            ticker varchar(20),
            tweet_timestamp timestamp
        );

    `);
};

exports.down = (pgm) => {
    pgm.sql(`
        drop table ticker_mention;
        drop table twitter_connection;
        drop table twitter_account;
    `);
};

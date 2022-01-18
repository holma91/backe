import { APIKEY_BSCSCAN, APIKEY_FTMSCAN } from '../env.js';
import ethers from 'ethers';
import fetch from 'node-fetch';
import { MessageEmbed, WebhookClient } from 'discord.js';
import { config } from '../discord/config.js';

const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';

export const uniV2Factory = ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'];
export const uniV3Factory = [
    'event PoolCreated(address token0, address token1, uint24 fee, int24 tickSpacing, address pool)',
];
export const uniV2Pair = [
    'event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)',
];

const getTokenMetadata = async (tokenAddress, account) => {
    let token = {
        address: tokenAddress,
    };

    const tokenInfoABI = [
        'function name() view returns (string)',
        'function symbol() view returns (string)',
        'function decimals() public view returns (uint8)',
    ];

    let success = false;
    let count = 0;

    while (!success) {
        try {
            count++;
            let contract = new ethers.Contract(token.address, tokenInfoABI, account);
            token.name = await contract.name();
            token.symbol = await contract.symbol();
            token.decimals = await contract.decimals();
            token.deployerAddress = contract.address;
            success = true;
        } catch (e) {
            // console.log(e);
            //console.log(`couldn't find token info for token with address ${tokenAddress} on try ${count}`);
            sleep(1000);
            if (count > 10) break;
        }
    }

    return token;
};

const getPairLiquidity = async (token0Decimals, token1Decimals, addressPair, account) => {
    const pairContract = new ethers.Contract(
        addressPair,
        [
            'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
        ],
        account
    );

    let success = false;
    let count = 0;
    let reserves;

    while (!success) {
        try {
            count++;
            reserves = await pairContract.getReserves();
            success = true;
        } catch (e) {
            //console.log(`couldn't find info for pair with address ${addressPair} on try ${count}`);
            sleep(1000);
            if (count > 10) break;
        }
    }

    // console.log('RESERVES', reserves);

    let liq0 = ethers.utils.formatUnits(reserves['reserve0'], token0Decimals);
    let liq1 = ethers.utils.formatUnits(reserves['reserve1'], token1Decimals);

    return { liq0, liq1 };
};

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const displayPair = (token0, token1, addressPair, chain, dex, knownTokens) => {
    let liquidity = 0;
    let liquidityUSD = 0;
    let addressNewToken = '';
    let symbolNewToken = '';
    let symbolOldToken = '';
    let nameNewToken = '';

    let knownAddresses = Object.values(knownTokens).map((token) => token.address.toLowerCase());

    try {
        if (knownAddresses.includes(token0.address.toLowerCase())) {
            liquidity = parseFloat(token0.liq);
            liquidityUSD = parseFloat(liquidity) * knownTokens[token0.symbol]['inUSD'];
            symbolOldToken = token0.symbol;
            addressNewToken = token1.address;
            symbolNewToken = token1.symbol;
            nameNewToken = token1.name;
        } else if (knownAddresses.includes(token1.address.toLowerCase())) {
            liquidity = parseFloat(token1.liq);
            liquidityUSD = parseFloat(liquidity) * knownTokens[token1.symbol]['inUSD'];
            symbolOldToken = token1.symbol;
            addressNewToken = token0.address;
            symbolNewToken = token0.symbol;
            nameNewToken = token0.name;
        } else {
            // none of the addresses in the pair are known... liq is basically 0?
            // do nothing
        }
    } catch (e) {
        console.log(`token0: ${token0.address}`);
        console.log(`token1: ${token1.address}`);
        console.error(e);
    }

    let color = '';
    if (liquidityUSD >= 5000.0) {
        color = FgGreen;
    } else if (liquidityUSD >= 1000.0) {
        color = FgYellow;
    } else {
        color = FgRed;
    }

    console.log(color, `${color}`);
    console.log(
        `${symbolOldToken}/${symbolNewToken}\n${nameNewToken}\nliq (${symbolOldToken}, USD): ${liquidity.toFixed(
            2
        )}, $${liquidityUSD.toFixed(2)}\n${symbolNewToken} address: ${addressNewToken}\npair: ${addressPair}\n${dex}\n`
    );

    sendDiscordMessage(
        symbolOldToken,
        symbolNewToken,
        nameNewToken,
        liquidity,
        liquidityUSD,
        addressNewToken,
        addressPair,
        chain,
        dex
    );
};

const sendDiscordMessage = (
    symbolOldToken,
    symbolNewToken,
    nameNewToken,
    liquidity,
    liquidityUSD,
    addressNewToken,
    addressPair,
    chain,
    dex
) => {
    let webhookClient = '';

    const hook = getHookInfo(chain, dex);

    let color = '';
    if (liquidityUSD >= 5000.0) {
        color = '#00ff00';
        webhookClient = new WebhookClient({
            url: hook.greenUrl,
        });
    } else if (liquidityUSD >= 1000.0) {
        color = '#ffff00';
        webhookClient = new WebhookClient({
            url: hook.yellowUrl,
        });
    } else {
        color = '#ff0000';
        webhookClient = new WebhookClient({
            url: hook.redUrl,
        });
    }

    const embed = new MessageEmbed()
        .setColor(color)
        .setTitle(`${symbolOldToken}/${symbolNewToken}`)
        .setURL(hook.dexUrl)
        .setAuthor({ name: `${chain}-BOT`, iconURL: hook.img, url: 'https://discord.js.org' })
        .addFields(
            {
                name: 'Pair information',
                value: `${symbolOldToken}/${symbolNewToken}, ${addressPair}, ${hook.explorerUrl}${addressPair}`,
            },
            {
                name: 'Token information',
                value: `${nameNewToken} (${symbolNewToken}), ${addressNewToken}, ${hook.explorerUrl}${addressNewToken}`,
            },
            {
                name: 'Liquidity information',
                value: `liquidity (${symbolOldToken}, USD): ${liquidity.toFixed(2)}, $${liquidityUSD.toFixed(2)}`,
            }
        )
        .setTimestamp();

    webhookClient.send({
        username: 'liquidity pair bot',
        avatarURL: 'https://i.imgur.com/AfFp7pu.png',
        embeds: [embed],
    });

    if (notificationWorthy(liquidityUSD, chain)) {
        let webhookNotificationClient = new WebhookClient({ url: config.newPairHookUrl });
        webhookNotificationClient.send({
            username: 'liquidity pair bot',
            avatarURL: 'https://i.imgur.com/AfFp7pu.png',
            embeds: [embed],
        });
    }
};

const notificationWorthy = (liquidityUSD, chain) => {
    // do research here to determine
    let worthy = false;
    switch (chain) {
        case 'BSC': {
            if (liquidityUSD >= 50000) {
                worthy = true;
            }
            break;
        }
        case 'ETH': {
            if (liquidityUSD >= 50000) {
                worthy = true;
            }
            break;
        }
        case 'FTM': {
            if (liquidityUSD >= 10000) {
                worthy = true;
            }
            break;
        }
        case 'AURORA': {
            if (liquidityUSD >= 5000) {
                worthy = true;
            }
            break;
        }
        case 'FUSE': {
            if (liquidityUSD >= 3000) {
                worthy = true;
            }
            break;
        }
        case 'METIS': {
            if (liquidityUSD >= 5000) {
                worthy = true;
            }
            break;
        }
    }
    return worthy;
};

// not in use currently
const getContractDeployerInfo = async (contractAddress, chain) => {
    // this functionality is only implemented for bsc at the moment
    if (chain !== 'BSC') {
        return '';
    }
    let contractCreator = '';
    let success = false;
    let count = 0;

    while (!success) {
        try {
            count++;
            const txs = await getTransactions(contractAddress, chain);

            if (txs.length > 0 && txs[0]['to'] === '') {
                contractCreator = txs[0]['from'];
            } else {
                // contract was deployed via an internal transaction
                const internalTxs = await getInternalTransactions(contractAddress);
                if (internalTxs.length < 1) {
                    // no normal txs and no internal txs => etherscan not updated
                    throw 'block explorer not updated';
                }
                if (internalTxs.length < 1) {
                    console.log('AFTER THROW');
                }

                if (internalTxs[0]['to'] === '') {
                    contractAddress = internalTxs[0]['from'];
                }

                // recurses until inital EOA account is found
                contractCreator = getContractDeployerInfo(contractAddress);
            }
            success = true;
        } catch (err) {
            if (count === 1 || count === 100) {
                // only log the first and last error
                //console.error(err, `, can't find creator for ${contractAddress} on try ${count}`);
            }
            sleep(500);
            if (count > 100) break;
        }
    }

    return contractCreator;
};

const getTransactions = async (address, chain) => {
    let res;
    if (chain === 'BSC') {
        res = await fetch(
            `https://api.bscscan.com/api?module=account&action=txlist&address=${address}&page=1&offset=10000&sort=asc&apikey=${APIKEY_BSCSCAN}`
        );
    } else if (chain === 'FTM') {
        res = await fetch(
            `https://api.ftmscan.com/api?module=account&action=txlist&address=${address}&sort=asc&apikey=${APIKEY_FTMSCAN}`
        );
    }

    const txs = await res.json();
    return txs['result'];
};
const getInternalTransactions = async (address) => {
    const res = await fetch(
        `https://api.bscscan.com/api?module=account&action=txlistinternal&address=${address}&page=1&offset=10&sort=asc&apikey=${APIKEY_BSCSCAN}`
    );
    const internalTxs = await res.json();

    return internalTxs['result'];
};

const getHookInfo = (chain, dex) => {
    let hook = {};

    switch (chain) {
        case 'BSC': {
            hook.img = 'https://s2.coinmarketcap.com/static/img/coins/200x200/1839.png';
            hook.greenUrl = config.bscHookUrlGreen;
            hook.yellowUrl = config.bscHookUrlYellow;
            hook.redUrl = config.bscHookUrlRed;
            hook.explorerUrl = 'https://bscscan.com/token/';
            if (dex === 'pancakeswap') {
                hook.dexUrl = 'https://pancakeswap.finance/swap/';
            } else {
                hook.dexUrl = '';
            }
            break;
        }
        case 'FTM': {
            hook.img = 'https://s2.coinmarketcap.com/static/img/coins/200x200/3513.png';
            hook.greenUrl = config.ftmHookUrlGreen;
            hook.yellowUrl = config.ftmHookUrlYellow;
            hook.redUrl = config.ftmHookUrlRed;
            hook.explorerUrl = 'https://ftmscan.com/token/';
            if (dex === 'spookyswap') {
                hook.dexUrl = 'https://spookyswap.finance/swap';
            } else if (dex === 'spiritswap') {
                hook.dexUrl = 'https://swap.spiritswap.finance/#/exchange/swap/';
            }
            break;
        }
        case 'AURORA': {
            hook.img = 'https://s2.coinmarketcap.com/static/img/coins/200x200/14803.png';
            hook.greenUrl = config.auroraHookUrlGreen;
            hook.yellowUrl = config.auroraHookUrlYellow;
            hook.redUrl = config.auroraHookUrlRed;
            hook.explorerUrl = 'https://explorer.mainnet.aurora.dev/token/';
            if (dex === 'trisolaris') {
                hook.dexUrl = 'https://www.trisolaris.io/#/swap';
            } else if (dex == 'wannaswap') {
                hook.dexUrl = 'https://wannaswap.finance/exchange/swap';
            }
            break;
        }
        case 'FUSE': {
            hook.img = 'https://s2.coinmarketcap.com/static/img/coins/200x200/5634.png';
            hook.greenUrl = config.fuseHookUrlGreen;
            hook.yellowUrl = config.fuseHookUrlYellow;
            hook.redUrl = config.fuseHookUrlRed;
            hook.explorerUrl = 'https://explorer.fuse.io/token/';
            if (dex === 'fuse.fi') {
                hook.dexUrl = 'https://app.fuse.fi/#/swap';
            }
            break;
        }
        case 'METIS': {
            hook.img = 'https://s2.coinmarketcap.com/static/img/coins/200x200/9640.png';
            hook.greenUrl = config.metisHookUrlGreen;
            hook.yellowUrl = config.metisHookUrlYellow;
            hook.redUrl = config.metisHookUrlRed;
            hook.explorerUrl = 'https://andromeda-explorer.metis.io/token/';
            if (dex === 'netswap') {
                hook.dexUrl = 'https://netswap.io/#/swap';
            } else if (dex === 'tethys') {
                hook.dexUrl = 'https://tethys.finance/swap';
            }
            break;
        }

        default:
            break;
    }
    return hook;
};

const onPairCreated = async (account, token0Address, token1Address, addressPair, chain, dex, knownTokens) => {
    let token0 = await getTokenMetadata(token0Address, account);
    let token1 = await getTokenMetadata(token1Address, account);

    const { liq0, liq1 } = await getPairLiquidity(token0.decimals, token1.decimals, addressPair, account);
    token0.liq = liq0;
    token1.liq = liq1;

    displayPair(token0, token1, addressPair, chain, dex, knownTokens);
};

export { getTokenMetadata, getPairLiquidity, displayPair, getContractDeployerInfo, onPairCreated };

// think about casing here
// let tokenDeployerAddress = '';
// let knownAddresses = Object.values(established_tokenAddresses).map((token) => token.address);
// if (!knownAddresses.includes(token0Address)) {
//     tokenDeployerAddress = await getContractDeployerInfo(token0Address, chain);
// } else if (!knownAddresses.includes(token1Address)) {
//     tokenDeployerAddress = await getContractDeployerInfo(token1Address, chain);
// }

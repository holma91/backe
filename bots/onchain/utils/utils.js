import connections from '../connections.js';
import ethers from 'ethers';
import clientInitializer from 'twilio';
const { BSC, ETH, FTM, AVAX, AURORA, FUSE, METIS, OPTIMISM } = connections;
import { MessageEmbed, WebhookClient } from 'discord.js';
import { config } from '../wh_discord.js';
import twilio from '../twilio_env.js';

const uniV2Factory = ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'];
const uniV3Factory = ['event PoolCreated(address token0, address token1, uint24 fee, int24 tickSpacing, address pool)'];
const uniV2Pair = [
    'event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)',
];

const onPairCreated = async (account, token0Address, token1Address, addressPair, chain, dex, knownTokens) => {
    let token0 = await getTokenMetadata(token0Address, account);
    let token1 = await getTokenMetadata(token1Address, account);

    const { liq0, liq1 } = await getPairLiquidity(token0.decimals, token1.decimals, addressPair, account);
    token0.liq = liq0;
    token1.liq = liq1;

    try {
        let pairInfo = getPairInfo(token0, token1, addressPair, chain, dex, knownTokens);
        displayPair(pairInfo);
        sendDiscordMessages(pairInfo);
    } catch (e) {
        console.log(e);
    }

    // return {
    //     token0Decimals: token0.decimals,
    //     token1Decimals: token1.decimals,
    // };
};

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
            sleep(1000);
            if (count > 10) break;
        }
    }

    let liq0 = ethers.utils.formatUnits(reserves['reserve0'], token0Decimals);
    let liq1 = ethers.utils.formatUnits(reserves['reserve1'], token1Decimals);

    return { liq0, liq1 };
};

const getPairInfo = (token0, token1, addressPair, chain, dex, knownTokens) => {
    let pairInfo = {
        liquidity: 0,
        liquidityUSD: 0,
        addressNewToken: '',
        symbolNewToken: '',
        symbolOldToken: '',
        nameNewToken: '',
        address: addressPair,
        chain: chain,
        dex: dex,
    };

    let knownAddresses = Object.values(knownTokens).map((token) => token.address.toLowerCase());

    try {
        if (knownAddresses.includes(token0.address.toLowerCase())) {
            pairInfo.liquidity = parseFloat(token0.liq);
            pairInfo.liquidityUSD = parseFloat(pairInfo.liquidity) * knownTokens[token0.symbol]['inUSD'];
            pairInfo.symbolOldToken = token0.symbol;
            pairInfo.addressNewToken = token1.address;
            pairInfo.symbolNewToken = token1.symbol;
            pairInfo.nameNewToken = token1.name;
        } else if (knownAddresses.includes(token1.address.toLowerCase())) {
            pairInfo.liquidity = parseFloat(token1.liq);
            pairInfo.liquidityUSD = parseFloat(pairInfo.liquidity) * knownTokens[token1.symbol]['inUSD'];
            pairInfo.symbolOldToken = token1.symbol;
            pairInfo.addressNewToken = token0.address;
            pairInfo.symbolNewToken = token0.symbol;
            pairInfo.nameNewToken = token0.name;
        } else {
            // none of the addresses in the pair are known... liq is basically 0?
            // do nothing
        }
    } catch (e) {
        console.log(`token0: ${token0.symbol} ${token0.address}`);
        console.log(`token1: ${token1.symbol} ${token1.address}`);
        console.error(e);
    }

    return pairInfo;
};

const displayPair = (pairInfo) => {
    const FgRed = '\x1b[31m';
    const FgGreen = '\x1b[32m';
    const FgYellow = '\x1b[33m';

    let color = '';
    if (pairInfo.liquidityUSD >= 5000.0) {
        color = FgGreen;
    } else if (pairInfo.liquidityUSD >= 1000.0) {
        color = FgYellow;
    } else {
        color = FgRed;
    }

    console.log(color, `${color}`);
    console.log(
        `${pairInfo.symbolOldToken}/${pairInfo.symbolNewToken}\n${pairInfo.nameNewToken}\nliq (${
            pairInfo.symbolOldToken
        }, USD): ${pairInfo.liquidity.toFixed(2)}, $${pairInfo.liquidityUSD.toFixed(2)}\n${
            pairInfo.symbolNewToken
        } address: ${pairInfo.addressNewToken}\npair: ${pairInfo.address}\n${pairInfo.dex}\n`
    );
};

const sendDiscordMessages = async (pairInfo) => {
    const hook = getHookInfo(pairInfo.chain, pairInfo.dex);

    const webhookClient = new WebhookClient({
        url: hook.greenUrl,
    });

    let color = '';
    if (pairInfo.liquidityUSD >= 50000) {
        color = '#00ff00';
    } else if (pairInfo.liquidityUSD >= 10000) {
        color = '#ffff00';
    } else {
        color = '#ff0000';
    }

    const embed = new MessageEmbed()
        .setColor(color)
        .setTitle(`${pairInfo.symbolOldToken}/${pairInfo.symbolNewToken}`)
        .setURL(hook.dexUrl)
        .setAuthor({ name: `${pairInfo.chain}-BOT`, iconURL: hook.img, url: 'https://discord.js.org' })
        .addFields(
            {
                name: 'Pair information',
                value: `${pairInfo.symbolOldToken}/${pairInfo.symbolNewToken}, ${pairInfo.address}, ${hook.explorerUrl}${pairInfo.address}`,
            },
            {
                name: 'Token information',
                value: `${pairInfo.nameNewToken} (${pairInfo.symbolNewToken}), ${pairInfo.addressNewToken}, ${hook.explorerUrl}${pairInfo.addressNewToken}`,
            },
            {
                name: 'Liquidity information',
                value: `liquidity (${pairInfo.symbolOldToken}, USD): ${pairInfo.liquidity.toFixed(
                    2
                )}, $${pairInfo.liquidityUSD.toFixed(2)}`,
            }
        )
        .setTimestamp();

    webhookClient.send({
        username: 'liquidity pair bot',
        avatarURL: 'https://i.imgur.com/AfFp7pu.png',
        embeds: [embed],
    });

    if (notificationWorthy(pairInfo.liquidityUSD, pairInfo.chain)) {
        let webhookNotificationClient = new WebhookClient({ url: config.newPairHookUrl });
        webhookNotificationClient.send({
            username: 'liquidity pair bot',
            avatarURL: 'https://i.imgur.com/AfFp7pu.png',
            embeds: [embed],
        });

        // phone call here lol. wake the fuck up
        const client = clientInitializer(twilio.accountSid, twilio.authToken);
        await client.calls.create({
            url: 'http://demo.twilio.com/docs/voice.xml',
            from: twilio.fromNumber,
            to: twilio.toNumber,
        });
    }
};

const notificationWorthy = (liquidityUSD, chain) => {
    // do research here to determine
    let worthy = false;
    switch (chain) {
        case 'ETH': {
            if (liquidityUSD >= 500000) {
                worthy = true;
            }
            break;
        }
        case 'AURORA': {
            if (liquidityUSD >= 15000) {
                worthy = true;
            }
            break;
        }
        case 'FUSE': {
            if (liquidityUSD >= 15000) {
                worthy = true;
            }
            break;
        }
        case 'METIS': {
            if (liquidityUSD >= 15000) {
                worthy = true;
            }
            break;
        }
        case 'OPTIMISM': {
            if (liquidityUSD >= 15000) {
                worthy = true;
            }
            break;
        }
    }
    return worthy;
};

const getHookInfo = (chain, dex) => {
    let hook = {};

    switch (chain) {
        case 'BSC': {
            hook.img = BSC.img;
            hook.greenUrl = BSC.webhooks.newPair;
            hook.explorerUrl = `${BSC.explorer.url}/token/`;
            if (dex === 'pancakeswap') {
                hook.dexUrl = BSC.dexes.pancakeswap.url;
            } else {
                hook.dexUrl = '';
            }
            break;
        }
        case 'ETH': {
            hook.img = ETH.img;
            hook.greenUrl = ETH.webhooks.newPair;
            hook.explorerUrl = `${ETH.explorer.url}/token/`;
            if (dex === 'uniswap') {
                hook.dexUrl = ETH.dexes.uniswap.url;
            } else if (dex === 'sushiswap') {
                hook.dexUrl = ETH.dexes.sushiswap.url;
            } else {
                hook.dexUrl = '';
            }
            break;
        }
        case 'AVAX': {
            hook.img = AVAX.img;
            hook.greenUrl = AVAX.webhooks.newPair;
            hook.explorerUrl = `${AVAX.explorer.url}/token/`;
            if (dex === 'traderjoe') {
                hook.dexUrl = AVAX.dexes.uniswap.url;
            } else if (dex === 'pangolin') {
                hook.dexUrl = AVAX.dexes.sushiswap.url;
            } else {
                hook.dexUrl = '';
            }
            break;
        }
        case 'FTM': {
            hook.img = FTM.img;
            hook.greenUrl = FTM.webhooks.newPair;
            hook.explorerUrl = `${FTM.explorer.url}/token/`;
            if (dex === 'spookyswap') {
                hook.dexUrl = FTM.dexes.spookyswap.url;
            } else if (dex === 'spiritswap') {
                hook.dexUrl = FTM.dexes.spiritswap.url;
            }
            break;
        }
        case 'AURORA': {
            hook.img = AURORA.img;
            hook.greenUrl = AURORA.webhooks.newPair;
            hook.explorerUrl = `${AURORA.explorer.url}/token/`;
            if (dex === 'trisolaris') {
                hook.dexUrl = AURORA.dexes.trisolaris.url;
            } else if (dex == 'wannaswap') {
                hook.dexUrl = AURORA.dexes.wannaswap.url;
            }
            break;
        }
        case 'FUSE': {
            hook.img = FUSE.img;
            hook.greenUrl = FUSE.webhooks.newPair;
            hook.explorerUrl = `${FUSE.explorer.url}/token/`;
            if (dex === 'fuse.fi') {
                hook.dexUrl = FUSE.dexes.fusefi.url;
            }
            break;
        }
        case 'METIS': {
            hook.img = METIS.img;
            hook.greenUrl = METIS.webhooks.newPair;
            hook.explorerUrl = `${METIS.explorer.url}/token/`;
            if (dex === 'netswap') {
                hook.dexUrl = METIS.dexes.netswap.url;
            } else if (dex === 'tethys') {
                hook.dexUrl = METIS.dexes.tethys.url;
            }
            break;
        }
        case 'OPTIMISM': {
            hook.img = OPTIMISM.img;
            hook.greenUrl = OPTIMISM.webhooks.newPair;
            hook.explorerUrl = `${OPTIMISM.explorer.url}/token/`;
            if (dex === 'zipswap') {
                hook.dexUrl = OPTIMISM.dexes.zipswap.url;
            }
            break;
        }

        default:
            break;
    }
    return hook;
};

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

export { getTokenMetadata, getPairLiquidity, displayPair, onPairCreated, uniV2Factory, uniV3Factory, uniV2Pair };

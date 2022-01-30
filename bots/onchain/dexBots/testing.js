const getDate = () => new Date();

// liq after a while function

const main = async () => {
    const intervals = [1000, 5000, 10000];
    for (const interval of intervals) {
        console.log('interval: ', interval);
        const x = async () => {
            const promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(getDate());
                }, interval);
            });
            return promise;
        };

        const res = await x();
        console.log(res);
    }
};

main();

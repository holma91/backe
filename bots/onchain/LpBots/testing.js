const getDate = () => {
    return new Date();
};

// liq after a while function

const main = async () => {
    const intervals = [1000, 5000, 10000];
    for (const interval of intervals) {
        console.log('interval: ', interval);
        const x = async () => {
            var promise = new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve(getDate());
                }, interval);
            });
            return promise;
        };

        let res = await x();
        console.log(res);
    }
};

main();

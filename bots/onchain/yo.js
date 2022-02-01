// console.log(new Promise((resolve) => resolve(5)));
// new Promise((resolve) => {
//     setTimeout(resolve, 1000);
// })
//     .then(() => {
//         console.log('first then is running');
//     })
//     .then(() => {
//         console.log('second then is running');
//     });

function getUser(id) {
    return new Promise((resolve) => {
        setTimeout(resolve, 2000); // Simulate slow network request
    }).then(() => {
        console.log('got user', id);
        return 'user ' + id.toString();
    });
}

// get users slowly
// let users = await getUser(1).then((user1) => getUser(2).then((user2) => [user1, user2]));
// console.log(users);

// get users faster
// const promise1 = getUser(1);
// const promise2 = getUser(2);

// let users = await promise1.then((user1) => promise2.then((user2) => [user1, user2]));
// console.log(users);

let funcs = [getUser(1), getUser(2), getUser(3), getUser(4)];
console.log(funcs);
let res = await Promise.all(funcs);
console.log(res);

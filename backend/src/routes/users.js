const express = require('express');
const UserRepo = require('../repos/userRepo');

const router = express.Router();

router.get('/users', async (req, res) => {
    const users = await UserRepo.find();

    res.send(users);
});

router.get('/users/:id', async (req, res) => {
    const { id } = req.params;

    const user = await UserRepo.findById(id);

    if (user) {
        res.send(user);
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;
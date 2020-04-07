const express = require('express');
const router = express.Router();

const { hashPassword } = require('../auth/helpers');

const usersQueries = require('../queries/users');

const processInput = require('../helpers/processInput');
const handleError = require('../helpers/handleError');

router.post('/:role/add', async (request, response, next) => {
    try {
        if (request.user.a_id) {
            const email = processInput(request.body.email, 'hardVC', 'user email', 50).toLowerCase();
            const password = processInput(request.body.password, 'hardVC', 'user password');
            const hashedPassword = await hashPassword(password);
            
            const role = processInput(request.params.role);
            let newUser = null;

            if (role === 'admin') {
                newUser = await usersQueries.addUser(email, hashedPassword, 'admin');
            } else if (role === 'staff') {
                newUser = await usersQueries.addUser(email, hashedPassword, 'staff');
            } else if (role === 'fellow') {
                newUser = await usersQueries.addUser(email, hashedPassword, 'fellow');
            } else {
                throw new Error("404__Wrong route !");
            }

            delete newUser.password;
            response.status(201).json({
                error: false,
                message: 'Successfully added new user to admin list',
                payload: newUser,
            });
        }
        else {
            throw new Error("401__You don't have permission to perform this operation - Admin right only");
        }

    } catch (err) {
        handleError(err, request, response, next);
    }
})


module.exports = router;
const express = require('express');
const router = express.Router();

const { hashPassword, comparePasswords } = require('../auth/helpers');

const usersQueries = require('../queries/users');
const adminQueries = require('../queries/admin');
const volunteersQueries = require('../queries/volunteers');
const fellowsQueries = require('../queries/fellows');

const processInput = require('../helpers/processInput');
const handleError = require('../helpers/handleError');

const storage = require('../helpers/s3Service');

router.post('/:role/add', async (request, response, next) => {
    try {
        if (request.user && request.user.a_id) {
            const email = processInput(request.body.email, 'hardVC', 'user email', 50).toLowerCase();
            const password = processInput(request.body.password, 'hardVC', 'user password');
            const hashedPassword = await hashPassword(password);
            
            const role = processInput(request.params.role, 'hardVC', 'user role', 10);
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
                message: 'Successfully added new user to users list',
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


const updatePassword = async(request, response, next) => {
    try {
        processInput(request.body.password, 'hardVC', 'user password');
        const newPassword = processInput(request.body.newPassword, 'hardVC', 'user password');
        const confirmPassword = processInput(request.body.confirmPassword, 'hardVC', 'user password');
        const targetId = processInput(request.params.user_id, 'idNum', 'user id');
        const loggedUserId = request.user.a_id || request.user.v_id || request.user.f_id;

        if (targetId === loggedUserId && newPassword === confirmPassword) {
            const loggedUserEmail = request.user.a_email || request.user.v_email || request.user.f_email;
            const targetUser = await usersQueries.getUserByEmail(loggedUserEmail);
            const passMatch = await comparePasswords(request.body.password, targetUser.password);
            
            if (passMatch) {
                const hashedPassword = await hashPassword(newPassword);
                await usersQueries.updatePassword(loggedUserEmail, hashedPassword);
                next();

            } else {
                throw new Error("401__Not authorized to update - password doesn't match");
            }
        } else {
            throw new Error("401__Not authorized to update - password doesn't match or you don't have the right to update");
        }

    } catch (err) {
        handleError(err, request, response, next);
    }
}

router.patch('/:user_id', updatePassword, (request, response) => {
    response.json({
        error: false,
        message: 'Successfully updated password',
        payload: request.user
    })
})


const deleteAccount = async(request, response, next) => {
    try {
        const loggedUserId = request.user.a_id || request.user.v_id || request.user.f_id;
        const targetId = processInput(request.params.user_id, 'idNum', 'user id');
        const loggedUserEmail = request.user.a_email || request.user.v_email || request.user.f_email;

        if (targetId === loggedUserId) {
            if (request.user && request.user.a_id) {
                await adminQueries.deleteAdmin(loggedUserId);
            } 
            else if (request.user.v_id) {
                await volunteersQueries.deleteVolunteer(loggedUserId);
                // NEED: delete volunteer skills
            } 
            else {
                await fellowsQueries.deleteFellow(loggedUserId);
            }
    
            await usersQueries.deleteUser(loggedUserEmail);

            const profilePic = request.user.a_picture || request.user.v_picture || request.user.f_picture;
            // Check if a user has a stored profile picture stored in S3 then delete it
            if (profilePic && profilePic.includes('https://pursuit-volunteer-management.s3.us-east-2.amazonaws.com/')) {
                storage.deleteFile(profilePic);
            }
            next();
        } 
        else {
            throw new Error("403__Not authorized to delete");
        }

    } catch (err) {
        handleError(err, request, response, next);
    }
}

router.delete('/:user_id', deleteAccount, (request, response) => {
    request.logOut();
    response.json({
        error: false,
        message: 'Successfully deleted user',
        payload: null
    })
})

const deleteUser = async(request, response, next) => {
    try {
        const targetEmail = processInput(request.params.email, 'hardVC', 'email', 50);

        if (request.user && request.user.a_id) {
            await usersQueries.deleteUser(targetEmail);
            next();
        } 
        else {
            throw new Error("403__Not authorized to delete");
        }

    } catch (err) {
        handleError(err, request, response, next);
    }
}

router.delete('/user/:email', deleteUser, (request, response) => {
    request.logOut();
    response.json({
        error: false,
        message: 'Successfully deleted user',
        payload: null
    })
})


module.exports = router;
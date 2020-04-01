const express = require('express');
const router = express.Router();

const passport = require('../auth/passport');
const { checkUserLogged, hashPassword } = require('../auth/helpers');

const storage = require('../helpers/s3Service');

const usersQueries = require('../queries/users');
const adminQueries = require('../queries/admin');
const volunteersQueries = require('../queries/volunteers');
const fellowsQueries = require('../queries/fellows');

const { checkValidId, checkValidParams, checkValidEmail, checkBool, handleErrors } = require('../helpers/helpers');


// LOGIN  A USER
// Expecting: request.email and request.password
router.post('/login', passport.authenticate('local'), (request, response) => {
    response.json({
        error: false,
        message: 'Successfully logged user',
        payload: request.user,
    })
})

// Sign-up a user as Admin
// Expecting into the request body: email, password, firstName, lastName
const signupAdmin = async (request, response, next) => {
    let { email, password, firstName, lastName } = request.body;
    if (checkValidEmail(email, response) 
    && checkValidParams(password, response)
    && checkValidParams(firstName, response)
    && checkValidParams(lastName, response)) {
        try {
            const hashedPassword = await hashPassword(password.trim());
            await adminQueries.addAdmin(firstName.trim(), LastName.trim(), email.trim(), hashedPassword);
            request.body.email = email;
            request.body.password = password;
            next();

        } catch (err) {
            handleErrors(err, response);
        }
    }
}

// Sign-up a user as Volunteer
// Expecting into the request body: email, password, firstName, lastName, company, title, mentor, officeHours, techMockInterview, behavioralMockInterview
const signupVolunteer = async (request, response, next) => {
    let { email, password, firstName, lastName, company, title, mentor, officeHours, techMockInterview, behavioralMockInterview } = request.body;
    if (checkValidEmail(email, response) 
    && checkValidParams(password, response)
    && checkValidParams(firstName, response)
    && checkValidParams(lastName, response)
    && checkValidParams(company, response)
    && checkValidParams(title, response)
    && checkBool(mentor, response)
    && checkBool(officeHours, response)
    && checkBool(techMockInterview, response)
    && checkBool(behavioralMockInterview, response)) {
        try {
            email = email.trim();
            password = password.trim();
            firstName = firstName.trim();
            lastName = lastName.trim();
            company = company.trim();
            title = title.trim();
            mentor = mentor.trim();
            officeHours = officeHours.trim();
            techMockInterview = techMockInterview.trim();
            behavioralMockInterview = behavioralMockInterview.trim();
            const hashedPassword = await hashPassword(password);

            await volunteersQueries.addVolunteer(firstName, LastName, email, hashedPassword, company, title, mentor, officeHours, techMockInterview, behavioralMockInterview);
            request.body.email = email;
            request.body.password = password;
            next();
            
        } catch (err) {
            handleErrors(err, response);
        }
    }
}

// Sign-up a user as Fellow
// Expecting into the request body: email, password, firstName, lastName, cohort
const signupFellow = async (request, response, next) => {
    let { email, password, firstName, lastName, cohort } = request.body;
    if (checkValidEmail(email, response) 
    && checkValidParams(password, response)
    && checkValidParams(firstName, response)
    && checkValidParams(lastName, response)
    && checkValidId(cohort, response)) {
        try {
            email = email.trim();
            password = password.trim();
            firstName = firstName.trim();
            lastName = lastName.trim();
            company = company.trim();
            title = title.trim();
            mentor = mentor.trim();
            officeHours = officeHours.trim();
            techMockInterview = techMockInterview.trim();
            behavioralMockInterview = behavioralMockInterview.trim();
            const hashedPassword = await hashPassword(password);

            await fellowsQueries.addFellow(firstName.trim(), LastName.trim(), email.trim(), hashedPassword, cohort);
            request.body.email = email;
            request.body.password = password;
            next();
            
        } catch (err) {
            handleErrors(err, response);
        }

    }
}

// Middleware to sign-up a new user
const signupUser = (request, response, next) => {
    const userType = request.params.userType;
    if (userType === 'admin') {
        signupAdmin(request, response, next);
    } else if (userType === 'volunteer') {
        signupVolunteer(request, response, next);
    } else if (userType === 'fellow') {
        signupFellow(request, response, next);
    } else {
        response.status(404).json({
            error: true,
            message: 'Wrong route',
            payload: null,
        });
    }
}
 
router.post('/:userType/signup', signupUser, passport.authenticate('local'), (request, response) => {
    response.status(201)
    response.json({
        error: false,
        message: 'Successfully signed up',
        payload: request.user
    })
})


const updateInfo = async(request, response, next) => {
    // const { email, password, firstName, lastName } = request.body;
    // const targetId = request.params.user_id;
    
    // if (parseInt(targetId) === request.user.id && checkValidParams(response, email) && checkValidParams(response, password)) {
    //     try {
    //         const userType = request.params.userType;
    
    //         await userQueries.updateUserInfo(targetId, email.toLowerCase(), firstName, lastName);
    //         next()

    //     } catch (err) {
    //         handleErrors(response, err)
    //     }
    // }
}

router.put('/:user_id', checkUserLogged, storage.upload.single('picture'), updateInfo, passport.authenticate('local'), (request, response) => {
    response.json({
        error: false,
        message: 'Successfully updated user info',
        payload: request.user
    })
})


const updatePassword = async(request, response, next) => {
    const { newPassword, confirmPassword } = request.body;
    const targetId = request.params.user_id;
    const loggedUserId = request.user.a_id || request.user.v_id || request.user.f_id;
    const loggedUserEmail = request.user.a_email || request.user.v_email || request.user.f_email;
  
    if (parseInt(targetId) === loggedUserId
        && checkValidParams(newPassword, response) 
        && checkValidParams(confirmPassword, response)
        && newPassword === confirmPassword) {
        try {
            const hashedPassword = await hashPassword(newPassword.trim());
            await usersQueries.updatePassword(loggedUserEmail, hashedPassword);
            request.body.password = newPassword.trim();
            next();

        } catch (err) {
            handleErrors(err, response);
        }
    }
}

router.patch('/:user_id', checkUserLogged, updatePassword, (request, response) => {
    response.json({
        error: false,
        message: 'Successfully updated password',
        payload: request.user
    })
})


const deleteAccount = async(request, response, next) => {
    const targetId = request.params.user_id;
    const loggedUserId = request.user.a_id || request.user.v_id || request.user.f_id;
    const loggedUserEmail = request.user.a_email || request.user.v_email || request.user.f_email;

    if (parseInt(targetId) === loggedUserId) {
        try {
            if (request.user.a_id) {
                await adminQueries.deleteUser(loggedUserId);
            } 
            else if (request.user.v_id) {
                await volunteersQueries.deleteUser(loggedUserId);
            } 
            else {
                await fellowsQueries.deleteUser(loggedUserId);
            }

            await usersQueries.deleteUser(loggedUserEmail)
            next();

        } catch (err) {
            handleErrors(response, err)
        }
    }
}

router.delete('/:user_id', checkUserLogged, deleteAccount, (request, response) => {
    request.logOut();
    response.json({
        error: false,
        message: 'Successfully deleted user/brand',
        payload: null
    })
})


router.get('/logout', checkUserLogged, (request, response) => {
    request.logOut();
    response.json({
        error: false,
        message: 'User logged out successfully',
        payload: null,
    });
})


router.get('/is_logged', checkUserLogged, (request, response) => {
    response.json({
        error: false,
        message: 'User is logged in. Session active',
        payload: request.user,
    })
})


module.exports = router;
const express = require('express');
const router = express.Router();

const passport = require('../auth/passport');
const { checkUserLogged, hashPassword, comparePasswords } = require('../auth/helpers');

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
    const { email, password, firstName, lastName } = request.body;
    if (checkValidEmail(email, request, response) 
    && checkValidParams(password, request, response)
    && checkValidParams(firstName, request, response)
    && checkValidParams(lastName, request, response)) {
        try {
            const hashedPassword = await hashPassword(password.trim());
            await adminQueries.addAdmin(firstName.trim(), LastName.trim(), email.trim().toLowerCase(), hashedPassword);
            request.body.email = email.trim().toLowerCase();
            request.body.password = password.trim();
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
    if (checkValidEmail(email, request, response) 
    && checkValidParams(password, request, response)
    && checkValidParams(firstName, request, response)
    && checkValidParams(lastName, request, response)
    && checkValidParams(company, request, response)
    && checkValidParams(title, request, response)
    && checkBool(mentor, request, response)
    && checkBool(officeHours, request, response)
    && checkBool(techMockInterview, request, response)
    && checkBool(behavioralMockInterview, request, response)) {
        try {
            email = email.trim().toLowerCase();
            password = password.trim();
            firstName = firstName.trim();
            lastName = lastName.trim();
            company = company.trim();
            title = title.trim();
            mentor = mentor.trim().toLowerCase();
            officeHours = officeHours.trim().toLowerCase();
            techMockInterview = techMockInterview.trim().toLowerCase();
            behavioralMockInterview = behavioralMockInterview.trim().toLowerCase();
            const hashedPassword = await hashPassword(password);

            // TO BE REVIEWED ONCE queries/volunteers.js MERGED
            await volunteersQueries.addVolunteer(firstName, LastName, email, hashedPassword, company, title, mentor, officeHours, techMockInterview, behavioralMockInterview);
            request.body.email = email;
            request.body.password = password.trim();
            next();
            
        } catch (err) {
            handleErrors(err, response);
        }
    }
}

// Sign-up a user as Fellow
// Expecting into the request body: email, password, firstName, lastName, cohort
const signupFellow = async (request, response, next) => {
    const { email, password, firstName, lastName, cohort } = request.body;
    if (checkValidEmail(email, request, response) 
    && checkValidParams(password, request, response)
    && checkValidParams(firstName, request, response)
    && checkValidParams(lastName, request, response)
    && checkValidId(cohort, request, response)) {
        try {
            const hashedPassword = await hashPassword(password.trim());

            // TO BE REVIEWED ONCE queries/fellows.js MERGED
            await fellowsQueries.addFellow(firstName.trim(), LastName.trim(), email.trim().toLowerCase(), hashedPassword, cohort);
            request.body.email = email.trim().toLowerCase();
            request.body.password = password.trim();
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

const updateAdminUser = async (userId, request, response, next) => {
    const actualEmail = request.user.a_email;
    const { firstName, lastName, email, password } = request.body;
    
    if (checkValidEmail(email, request, response)
    && checkValidParams(password, request, response)
    && checkValidParams(firstName, request, response)
    && checkValidParams(lastName, request, response)) {
        try {
            const formattedEmail = email.trim().toLowerCase();
            const user = await usersQueries.getUserByEmail(actualEmail);
            const passMatch = await comparePasswords(password, user.password);
            if (passMatch) { // BEFORE ALLOWING UPDATE USER HAS TO CONFIRM THEIR PASSWORD
                if (actualEmail !== formattedEmail) {
                    await usersQueries.updateEmail(actualEmail, formattedEmail)
                }
                
                await adminQueries.updateAdmin(userId, firstName.trim(), LastName.trim(), formattedEmail);
                request.body.email = formattedEmail;
                request.body.password = password.trim();
                next();
            } 
            else {
                response.status(401).json({
                    error: true,
                    message: 'Wrong password',
                    payload: null,
                })
            }

        } catch (err) {
            handleErrors(err, response);
        }
    }
}

const updateVolunteerUser = async (userId, request, response, next) => {
    const actualEmail = request.user.v_email;
    let { email, password, firstName, lastName, company, title, bio, linkedIn, mentor, officeHours, techMockInterview, behavioralMockInterview } = request.body;
    
    if (checkValidEmail(email, request, response) 
    && checkValidParams(password, request, response)
    && checkValidParams(firstName, request, response)
    && checkValidParams(lastName, request, response)
    && checkValidParams(company, request, response)
    && checkValidParams(title, request, response)
    && checkValidParams(bio, request, response)
    && checkValidParams(linkedIn, request, response)
    && checkBool(mentor, request, response)
    && checkBool(officeHours, request, response)
    && checkBool(techMockInterview, request, response)
    && checkBool(behavioralMockInterview, request, response)) {
        try {
            email = email.trim().toLowerCase();
            password = password.trim();
            firstName = firstName.trim();
            lastName = lastName.trim();
            company = company.trim();
            title = title.trim();
            bio = bio.trim();
            linkedIn = linkedIn.trim();
            mentor = mentor.trim();
            officeHours = officeHours.trim();
            techMockInterview = techMockInterview.trim();
            behavioralMockInterview = behavioralMockInterview.trim();

            const user = await usersQueries.getUserByEmail(email);
            const passMatch = await comparePasswords(password, user.password);
            if (passMatch) { // BEFORE ALLOWING UPDATE USER HAS TO CONFIRM THEIR PASSWORD
                if (actualEmail !== email) {
                    await usersQueries.updateEmail(actualEmail, email)
                }

                let picture = request.user.v_picture;
                if (request.file) {
                    picture = request.file.location;
                }
                
                // TO BE REVIEWED ONCE queries/volunteers.js MERGED
                await volunteersQueries.updateVolunteer(userId, firstName, LastName, email, picture, company, title, bio, linkedIn, mentor, officeHours, techMockInterview, behavioralMockInterview);
                if (request.file) {
                    storage.deleteFile(request.user.v_picture)
                }
                request.body.email = email;
                request.body.password = password.trim();
                next();
            }
            else {
                storage.deleteFile(request.file.location);
                response.status(401).json({
                    error: true,
                    message: 'Wrong password',
                    payload: null,
                });
            }
            
        } catch (err) {
            handleErrors(err, response);
        }
    }
}

const updateFellowUser = async (userId, request, response, next) => {
    const actualEmail = request.user.f_email;
    let { email, password, firstName, lastName, bio, linkedIn, github, cohort, wantMentor } = request.body;
    
    if (checkValidEmail(email, request, response) 
    && checkValidParams(password, request, response)
    && checkValidParams(firstName, request, response)
    && checkValidParams(lastName, request, response)
    && checkValidParams(bio, request, response)
    && checkValidParams(linkedIn, request, response)
    && checkValidParams(github, request, response)
    && checkValidId(cohort, request, response)
    && checkBool(wantMentor, request, response)) {
        try {
            email = email.trim().toLowerCase();
            password = password.trim();
            firstName = firstName.trim();
            lastName = lastName.trim();
            bio = bio.trim();
            linkedIn = linkedIn.trim();
            github = github.trim();
            wantMentor = wantMentor.trim().toLowerCase();

            const user = await usersQueries.getUserByEmail(email);
            const passMatch = await comparePasswords(password, user.password);
            if (passMatch) { // BEFORE ALLOWING UPDATE USER HAS TO CONFIRM THEIR PASSWORD
                if (actualEmail !== email) {
                    await usersQueries.updateEmail(actualEmail, email)
                }

                let picture = request.user.f_picture;
                if (request.file) {
                    picture = request.file.location;
                }

                // TO BE REVIEWED ONCE queries/fellows.js MERGED
                await fellowsQueries.updateFellow(userId, firstName, LastName, email, picture, bio, linkedIn, github, cohort, wantMentor);
                if (request.file) {
                    storage.deleteFile(request.user.f_picture)
                }
                request.body.email = email;
                request.body.password = password.trim();
                next();
            }
            else {
                storage.deleteFile(request.file.location);
                response.status(401).json({
                    error: true,
                    message: 'Wrong password',
                    payload: null,
                });
            }
            
        } catch (err) {
            handleErrors(err, response);
        }
    }
}


const updateUser = async(request, response, next) => {
    const userId = request.params.user_id;

    if (request.user.a_email) {
        updateAdminUser(userId, request, response, next);
    } else if (request.user.v_email) {
        updateVolunteerUser(userId, request, response, next);
    } else {
        updateFellowUser(userId, request, response, next);
    }
}

router.put('/:user_id', checkUserLogged, storage.upload.single('picture'), updateUser, passport.authenticate('local'), (request, response) => {
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
        && checkValidParams(newPassword, request, response) 
        && checkValidParams(confirmPassword, request, response)
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
                // TO BE REVIEWED ONCE queries/volunteers.js MERGED
                await volunteersQueries.deleteUser(loggedUserId);
            } 
            else {
                // TO BE REVIEWED ONCE queries/fellows.js MERGED
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
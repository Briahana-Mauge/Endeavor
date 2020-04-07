const express = require('express');
const router = express.Router();

const passport = require('../auth/passport');
const { checkUserLogged, hashPassword, comparePasswords } = require('../auth/helpers');

const storage = require('../helpers/s3Service');

const usersQueries = require('../queries/users');
const adminQueries = require('../queries/admin');
const volunteersQueries = require('../queries/volunteers');
const fellowsQueries = require('../queries/fellows');

const processInput = require('../helpers/processInput');
const handleError = require('../helpers/handleError');


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
    try {
        const email = processInput(request.body.email, 'hardVC', 'user email', 50).toLowerCase();
        const password = processInput(request.body.password, 'hardVC', 'user password');
        const newPassword = processInput(request.body.newPassword, 'hardVC', 'user password');
        const firstName = processInput(request.body.firstName, 'hardVC', 'user first name', 30);
        const lastName = processInput(request.body.lastName, 'hardVC', 'user last name', 30);
        
        const allowedAdmin = await usersQueries.getUserByEmail(email);
        if (allowedAdmin && (allowedAdmin.role === 'admin' || allowedAdmin.role === 'staff')) {
            const passMatch = await comparePasswords(request.body.password, allowedAdmin.password);
            
            if (passMatch) {
                const hashedPassword = await hashPassword(newPassword);
                if (allowedAdmin.role === 'admin') {
                    await adminQueries.addAdmin(firstName, lastName, email, hashedPassword, allowedAdmin.password, true);
                } else {
                    await adminQueries.addAdmin(firstName, lastName, email, hashedPassword, allowedAdmin.password, false);
                }
                request.body.email = email;
                request.body.password = newPassword;
                next();
            }
            else {
                throw new Error('401__Not authorized to sign up, default password does not match');
            }
        }
        else {
            throw new Error('401__Not authorized to sign up as an Admin');
        }

    } catch (err) {
        handleError(err, request, response, next);
    }
}

// Sign-up a user as Volunteer
// Expecting into the request body: email, password, firstName, lastName, company, title, mentor, officeHours, techMockInterview, behavioralMockInterview
const signupVolunteer = async (request, response, next) => {
    try {
        const formattedRequestBody = {
            email: processInput(request.body.email, 'hardVC', 'user email', 50).toLowerCase(),
            password: processInput(request.body.password, 'hardVC', 'user password'),
            firstName: processInput(request.body.firstName, 'hardVC', 'user first name', 30),
            lastName: processInput(request.body.lastName, 'hardVC', 'user last name', 30),
            company: processInput(request.body.company, 'hardVC', 'company', 50),
            title: processInput(request.body.title, 'hardVC', 'title', 50),
            skills: processInput(request.body.skills, 'array', 'skills list', 25),
            mentor: processInput(request.body.mentor, 'bool', 'mentoring'),
            officeHours: processInput(request.body.officeHours, 'bool', 'office hours'),
            techMockInterview: processInput(request.body.techMockInterview, 'bool', 'technical mock interview'),
            behavioralMockInterview: processInput(request.body.behavioralMockInterview, 'bool', 'behavioral mock interview'),
            professionalSkillsCoach: processInput(request.body.professionalSkillsCoach, 'bool', 'professional skill coach'),
            hostSiteVisit: processInput(request.body.hostSiteVisit, 'bool', 'host site visit'),
            industrySpeaker: processInput(request.body.industrySpeaker, 'bool', 'industry speaker')
        }
        const hashedPassword = await hashPassword(formattedRequestBody.password);

        await volunteersQueries.addVolunteer(formattedRequestBody, hashedPassword);
        request.body.email = formattedRequestBody.email;
        request.body.password = formattedRequestBody.password;
        next();
        
    } catch (err) {
        handleError(err, request, response, next);
    }
}

// Sign-up a user as Fellow
// Expecting into the request body: email, password, firstName, lastName, cohort
const signupFellow = async (request, response, next) => {
    try {
        const email = processInput(request.body.email, 'hardVC', 'user email', 50).toLowerCase();
        const password = processInput(request.body.password, 'hardVC', 'user password');
        const firstName = processInput(request.body.firstName, 'hardVC', 'user first name', 30);
        const lastName = processInput(request.body.lastName, 'hardVC', 'user last name', 30);
        const newPassword = processInput(request.body.newPassword, 'hardVC', 'user password');
        const cohortId = processInput(request.body.cohortId, 'idNum', 'cohort id', 50);

        const allowedFellow = await usersQueries.getUserByEmail(email);
        if (allowedFellow) {
            const passMatch = await comparePasswords(request.body.password, allowedFellow.password);
            
            if (passMatch) {
                const hashedPassword = await hashPassword(newPassword);
                
                await fellowsQueries.addFellow({firstName, lastName, email, cohortId}, hashedPassword, allowedAdmin.password);
                request.body.email = email;
                request.body.password = newPassword;
                next();
            }
            else {
                throw new Error('401__Not authorized to sign up, default password does not match');
            }
        }
        else {
            throw new Error('401__Not authorized to sign up as fellow, please contact your Admin for more details');
        }
        
    } catch (err) {
        handleError(err, request, response, next);
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
    try {
        const actualEmail = request.user.a_email;
        const email = processInput(request.body.email, 'hardVC', 'user email', 50).toLowerCase();
        const password = processInput(request.body.password, 'hardVC', 'user password');
        const firstName = processInput(request.body.firstName, 'hardVC', 'user first name', 30);
        const lastName = processInput(request.body.lastName, 'hardVC', 'user last name', 30);

        const user = await usersQueries.getUserByEmail(actualEmail);
        const passMatch = await comparePasswords(request.body.password, user.password);
        if (passMatch) { // BEFORE ALLOWING UPDATE USER HAS TO CONFIRM THEIR PASSWORD
            if (actualEmail !== email) {
                await usersQueries.updateEmail(actualEmail, email)
            }
            
            await adminQueries.updateAdmin(userId, firstName, lastName, email);
            request.body.email = email;
            request.body.password = password;
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
        handleError(err, request, response, next);
    }
}

const updateVolunteerUser = async (userId, request, response, next) => {
    try {
        const actualEmail = request.user.v_email;
        const formattedRequestBody = {
            userId,
            email: processInput(request.body.email, 'hardVC', 'user email', 50).toLowerCase(),
            password: processInput(request.body.password, 'hardVC', 'user password'),
            firstName: processInput(request.body.firstName, 'hardVC', 'user first name', 30),
            lastName: processInput(request.body.lastName, 'hardVC', 'user last name', 30),
            company: processInput(request.body.company, 'hardVC', 'company', 50),
            title: processInput(request.body.title, 'hardVC', 'title', 50),
            bio: processInput(request.body.bio, 'softVC', 'bio'),
            linkedIn: processInput(request.body.linkedIn, 'softVC', 'linkedIn link', 150),
            skills: processInput(request.body.skills, 'softVC', 'skills list', 50),
            mentor: processInput(request.body.mentor, 'bool', 'mentoring'),
            officeHours: processInput(request.body.officeHours, 'bool', 'office hours'),
            techMockInterview: processInput(request.body.techMockInterview, 'bool', 'technical mock interview'),
            behavioralMockInterview: processInput(request.body.behavioralMockInterview, 'bool', 'behavioral mock interview'),
            professionalSkillsCoach: processInput(request.body.professionalSkillsCoach, 'bool', 'professional skill coach'),
            hostSiteVisit: processInput(request.body.hostSiteVisit, 'bool', 'host site visit'),
            industrySpeaker: processInput(request.body.industrySpeaker, 'bool', 'industry speaker'),
            picture: request.user.v_picture
        }
        
        const user = await usersQueries.getUserByEmail(actualEmail);
        const passMatch = await comparePasswords(request.body.password, user.password);
        if (passMatch) { // BEFORE ALLOWING UPDATE USER HAS TO CONFIRM THEIR PASSWORD
            if (actualEmail !== formattedRequestBody.email) {
                await usersQueries.updateEmail(actualEmail, formattedRequestBody.email)
            }

            if (request.file) {
                formattedRequestBody.picture = request.file.location;
            }
            
            await volunteersQueries.updateVolunteer(formattedRequestBody);
            if (request.file && request.user.f_picture && request.user.f_picture.includes('https://pursuit-volunteer-management.s3.us-east-2.amazonaws.com/')) {
                storage.deleteFile(request.user.v_picture)
            }
            request.body.email = formattedRequestBody.email;
            request.body.password = formattedRequestBody.password;
            next();
        }
        else {
            if (request.file) {
                storage.deleteFile(request.file.location);
            }
            throw new Error('401__Wrong password');
        }
        
    } catch (err) {
        handleError(err, request, response, next);
    }
}

const updateFellowUser = async (userId, request, response, next) => {
    try {
        const actualEmail = request.user.f_email;

        const formattedRequestBody = {
            userId,
            email: processInput(request.body.email, 'hardVC', 'user email', 50).toLowerCase(),
            password: processInput(request.body.password, 'hardVC', 'user password'),
            firstName: processInput(request.body.firstName, 'hardVC', 'user first name', 30),
            lastName: processInput(request.body.lastName, 'hardVC', 'user last name', 30),
            bio: processInput(request.body.bio, 'softVC', 'bio'),
            linkedIn: processInput(request.body.linkedIn, 'softVC', 'linkedIn link', 150),
            github: processInput(request.body.linkedIn, 'softVC', 'linkedIn link', 150),
            cohortId: processInput(request.body.cohortId, 'idNum', 'cohort id', 50),
            wantMentor: processInput(request.body.mentor, 'bool', 'mentoring'),
            picture: request.user.f_picture
        }

        const user = await usersQueries.getUserByEmail(actualEmail);
        const passMatch = await comparePasswords(request.body.password, user.password);

        if (passMatch) { // BEFORE ALLOWING UPDATE USER HAS TO CONFIRM THEIR PASSWORD
            if (actualEmail !== formattedRequestBody.email) {
                await usersQueries.updateEmail(actualEmail, formattedRequestBody.email);
            }

            if (request.file) {
                formattedRequestBody.picture = request.file.location;
            }

            await fellowsQueries.updateFellow(formattedRequestBody);
            if (request.file && request.user.f_picture && request.user.f_picture.includes('https://pursuit-volunteer-management.s3.us-east-2.amazonaws.com/')) {
                storage.deleteFile(request.user.f_picture)
            }
            request.body.email = formattedRequestBody.email;
            request.body.password = formattedRequestBody.password;
            next();
        }
        else {
            if (request.file) {
                storage.deleteFile(request.file.location);
            }
            throw new Error('401__Wrong password');
        }
        
    } catch (err) {
        handleError(err, request, response, next);
    }
}


const updateUser = (request, response, next) => {
    const userId = processInput(request.params.user_id, 'idNum', 'user id');

    if (request.user.a_email && Number(userId) === request.user.a_id) {
        updateAdminUser(userId, request, response, next);
    } else if (request.user.v_email && Number(userId) === request.user.v_id) {
        updateVolunteerUser(userId, request, response, next);
    } else if (request.user.f_email && Number(userId) === request.user.f_id){
        updateFellowUser(userId, request, response, next);
    } else {
        if (request.file) {
            storage.deleteFile(request.file.location);
        }
        response.status(401).json({
            error: true,
            message: 'Not authorized to update these information',
            payload: null,
        });
    }
}

router.put('/:user_id', checkUserLogged, storage.upload.single('picture'), updateUser, passport.authenticate('local'), (request, response) => {
    response.json({
        error: false,
        message: 'Successfully updated user info',
        payload: request.user
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
    });
})


module.exports = router;
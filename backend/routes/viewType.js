const express = require('express');
const router = express.Router();

const { hashPassword, comparePasswords } = require('../auth/helpers');

const adminQueries = require('../queries/admin');
const volunteersQueries = require('../queries/volunteers');
const fellowsQueries = require('../queries/fellows');

const processInput = require('../helpers/processInput');
const handleError = require('../helpers/handleError');


router.patch('/',  async (request, response) => {
    try {
        const targetView = processInput(request.body.targetView, 'hardVC', 'target view');

        if (targetView !== 'events' && targetView !== 'volunteers') {
            throw new Error('400__Invalid view type');
        }

        let updated = null;

        if (request.user.a_id) {
            updated = await adminQueries.updateViewType(request.user.a_id, targetView);
        }

        if (request.user.v_id) {
            updated = await volunteersQueries.updateViewType(request.user.v_id, targetView);
        }

        if (request.user.f_id) {
            updated = await fellowsQueries.updateViewType(request.user.f_id, targetView);
        }

        response.json({
            error: false,
            message: 'Successfully updated view setting',
            payload: updated
        })

    } catch (err) {
        handleError(err, request, response, next);
    }
})


module.exports = router;
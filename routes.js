
const express = require('express');
const router = express.Router();
const { User, Course} = require('./models');
const { authenticateUser } = require('./middleware/auth-user');
const createError = require('http-errors');

//Asynchandler function
function asyncHandler(cb) {
    return async (req, res, next) => {
        try{
            await cb(req, res, next);
        } catch (error) {
            next(error);
        }
    }
}

//Retrieves requested user with authentication
router.get('/users', authenticateUser, asyncHandler( async(req, res) => {
    const user = req.currentUser
    res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    });
}));

//Creates a new User
router.post('/users', asyncHandler( async(req, res) => {
    try {
        await User.create(req.body);
        res.status(201).json();
    } catch (error) {
        console.log('ERROR: ', error.name);

        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

//Retrieves requested courses with proper filters
router.get('/courses', asyncHandler( async(req, res) => {
    const courses = await Course.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
            {
                model: User,
                attributes: ['firstName', 'lastName', 'emailAddress'],
            }
        ]
    });
    res.status(200).json(courses);
}));

//Retrieves specific course with proper filters
router.get('/courses/:id', asyncHandler( async(req, res) => {
    const course = await Course.findByPk(req.params.id, {
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
            {
                model: User,
                attributes: ['firstName', 'lastName', 'emailAddress'],
            }
        ]
    });

    if (course) {
        res.status(200).json({course})
    } else {
        res.status(404).json({ message: "Course Not Found" });
    }
}));

//Creates new course with proper authentication
router.post('/courses', authenticateUser, asyncHandler( async(req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).location(`/api/courses/${course.id}`).end();
    } catch (error) {
        console.log('ERROR: ', error.name);

        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

//Updates course with proper authentication
router.put('/courses/:id', authenticateUser, asyncHandler( async(req, res, next) => {
    try{
        const user = req.currentUser;
        const course = await Course.findByPk(req.params.id);
        if (course && course.userId === user.id) {
            await course.update(req.body);
            res.status(204).end();
        } else {
            res.status(403).json({ message: "Looks like you do not own this course. Please try again." });
            next(err);
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        } 
    }
}));

//Delets course with proper authentication
router.delete('/courses/:id', authenticateUser, asyncHandler( async(req, res, next) => {
    const user = req.currentUser;
    const course = await Course.findByPk(req.params.id);
        if (course && course.userId === user.id) {
            await course.destroy();
            res.status(204).end();
        } else {
            const err = createError(403, "Looks like you do not own this course. Please try again.");
            next(err);
        }
}));

module.exports = router;
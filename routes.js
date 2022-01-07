const express = require('express');
const router = express.Router();
const { User, Course} = require('./models');
const { authenticateUser } = require('./middleware/auth-user');

function asyncHandler(cb) {
    return async (req, res, next) => {
        try{
            await cb(req, res, next);
        } catch (error) {
            next(error);
        }
    }
}

router.get('/users', authenticateUser, asyncHandler( async(req, res) => {
    const user = req.currentUser
    res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    });
}));

router.post('/users', asyncHandler( async(req, res) => {
    try {
        await User.create(req.body);
        res.status(201).json({ message: "User created successfully!" });
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

router.get('/courses:id', asyncHandler( async(req, res) => {
    const course = await Course.getCourse(req.params.id, {
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
            {
                model: User,
                attributes: ['firstName', 'lastName', 'emailAddress'],
            }
        ]
    });

    if (course) {
        res.status(200),json(course)
    } else {
        res.status(404).json({ message: "Course Not Found" });
    }
}));

router.post('/courses', authenticateUser, asyncHandler( async(req, res) => {
    try {
        await Course.create(req.body);
        res.status(201).json({ message: "Course created successfully!" });
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

router.put('/courses:id', authenticateUser, asyncHandler( async(req, res) => {
    try{
        const user = req.currentUser;
        const course = await Course.getCourse(req.params.id);
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

router.delete('/courses:id', authenticateUser, asyncHandler( async(req, res) => {
    const user = req.currentUser;
    const course = await Course.getCourse(req.params.id);
        if (course && course.userId === user.id) {
            await Course.deleteCourse(course);
            res.status(204).end();
        } else {
            const err = createError(403, "Looks like you do not own this course. Please try again.");
            next(err);
        }
}));

module.exports = router;
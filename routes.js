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
    let courses = await Course.findAll();
    res.status(200).json(courses);
}));

router.get('/courses:id', asyncHandler( async(req, res) => {
    const course = await Course.getCourse(req.params.id);

    if (course) {
        res.status(200),json(course)
    } else {
        res.status(404).json({ message: "Course Not Found" });
    }
}));

router.post('/courses', asyncHandler( async(req, res) => {
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

router.put('/courses:id', asyncHandler( async(req, res) => {
    const course = await Course.getCourse(req.params.id);
    if (course) {
        course.title = req.body.title;
        course.description = req.body.description;
        course.estimatedTime = req.body.estimatedTime;
        course.materialsNeeded = req.body.materialsNeeded;

        await Course.updateCourse(course);
        res.status(204).end();
    } else {
        res.status(404).json({ message: "Course Not Found" });
    }
}));

router.delete('/courses:id', asyncHandler( async(req, res) => {
    const course = await Course.getCourse(req.params.id);
    await Course.deleteCourse(course);
    res.status(204).end();
}));

module.exports = router;
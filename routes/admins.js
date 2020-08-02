const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const validateRegisterInput = require("../validation/adminRegister");
const validateLoginInput = require("../validation/login");// Load User model
const StudentModel = require('../models/Student')
const MentorModel = require("../models/Mentor")
const LiveClassModel = require("../models/LiveClass")
const SubjectModel = require("../models/Subject");
const CategoryModel = require("../models/Category");


router.post('/register', async (req, res, next) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
        return next(errors);
    }
    passport.authenticate('registerAdmin', async (err, user, info) => {
        try {
            if (err || !user) {
                console.log(info)
                return res.status(400).json(info)
            }
            return res.json({ id: user.id, name: user.name, email: user.email, emailVerify: user.emailVerify, type: "admin" })
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});


router.post('/login', async (req, res, next) => {
    const { errors, isValid } = validateLoginInput(req.body);// Check validation
    if (!isValid) {
        return next(errors);
    }
    passport.authenticate('loginAdmin', async (err, user, info) => {
        try {
            if (err || !user) {
                console.log(info)
                return res.status(400).json(info)
            }
            req.login(user, { session: false }, async (error) => {
                if (error) return next(error)
                //We don't want to store the sensitive information such as the
                //user password in the token so we pick only the email and id
                //console.log(user.id)
                const payload = { id: user.id, name: user.name, email: user.email, emailVerify: user.emailVerify, type: "admin" };// Sign token
                const token = jwt.sign(payload, process.env.secretOrKey, { expiresIn: 2678400 /* 1 month in seconds*/ });
                return res.json({ success: true, token: token });
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});

router.get('/profile', passport.authenticate('jwtAdmin', { session: false }), (req, res, next) => {
    //We'll just send back the user details and the token
    res.json({
        message: 'You made it to the secure route',
        user: req.user,
        token: req.query.secret_token
    })
});


router.get('/allStudents', passport.authenticate('jwtAdmin', { session: false }), async (req, res, next) => {
    try {
        const allStudents = await StudentModel.find({}, '_id name email institution subject');
        res.json(allStudents);
    } catch (err) {
        return next(err)
    }
});

router.get('/allMentors', passport.authenticate('jwtAdmin', { session: false }), async (req, res, next) => {
    try {
        const allMentors = await MentorModel.find({}, '_id name email organization position mobileNo adminVerify');
        //console.log(allMentors)
        res.json(allMentors);
    } catch (err) {
        //console.log(err)
        return next(err)
    }
});

router.get('/allMentors/:id', passport.authenticate('jwtAdmin', { session: false }), async (req, res, next) => {
    try {
        const mentor = await MentorModel.findById(req.params.id);
        res.json(mentor);
    } catch (err) {
        return next(err)
    }
});

router.put('/verifyMentor/:id', passport.authenticate('jwtAdmin', { session: false }), async (req, res, next) => {
    try {
        const filter = { _id: req.params.id }
        const update = { adminVerify: true }
        await MentorModel.updateOne(filter, update);
        res.json({ message: "success" });
    } catch (err) {
        return next(err)
    }
});

router.get('/allliveclass', passport.authenticate('jwtAdmin', { session: false }), async (req, res, next) => {
    try {
        const liveClass = await LiveClassModel.find({})
        //console.log(liveClass)
        res.json(liveClass)
    }
    catch (err) {
        console.log(err)
        return next(err);
    }
});



router.post('/approvelive/:id', passport.authenticate('jwtAdmin', { session: false }), async (req, res, next) => {
    try {
        console.log("hu")
        const aproveclass = await LiveClassModel.findOne({ _id: req.params.id })
        aproveclass.approved = true;
        await aproveclass.save()
        res.json({ message: "success" });
    }
    catch (err) {
        console.log(err)
        return next(err);
    }
});

router.get('/subject',/*passport.authenticate('jwtAdmin',{session: false}),*/ async (req, res, next) => {
    try {
        const subject = await SubjectModel.find()
        res.json(subject)
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

router.post("/setprice/:id", async (req, res) => {
    try {
        const liveclass = await LiveClassModel.findOneAndUpdate({ _id: req.params.id }, { $set: { price: req.body.price, fake_price: req.body.fake_price } })
        liveclass.save()
        res.send({ message: "success" })
    } catch (error) {
        res.send(error)
    }
})

router.post('/eachsubject',/*passport.authenticate('jwtAdmin',{session: false}),*/ async (req, res, next) => {
    try {
        const subject = await SubjectModel.find({ category: { $in: req.body.name } })
        res.json(subject)
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

router.post('/subject/add',/*passport.authenticate('jwtAdmin',{session: false}),*/ async (req, res) => {
    try {
        const subject = new SubjectModel(req.body);
        await subject.save()
        res.send({ message: 'success' })
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})
router.post('/subject/delete/:id',/*passport.authenticate('jwtAdmin',{session: false}),*/ async (req, res, next) => {
    try {
        await SubjectModel.findOneAndDelete({ _id: req.params.id })
        res.json({ message: 'success' })
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

router.post('/subject/addSubcategory/:id',/*passport.authenticate('jwtAdmin',{session: false}),*/ async (req, res, next) => {
    try {
        await SubjectModel.updateOne({ _id: req.params.id }, { $push: { subcategory: req.body } })
        res.json({ message: 'success' })
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

router.post('/subject/deleteSubcategory/:id/:catid',/*passport.authenticate('jwtAdmin',{session: false}),*/ async (req, res, next) => {
    try {
        await SubjectModel.updateOne({ _id: req.params.id }, { $pull: { subcategory: { name: req.body.name } } })
        res.json({ message: 'success' })
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

router.get('/category',/*passport.authenticate('jwtAdmin',{session: false}),*/ async (req, res, next) => {
    try {
        const category = await CategoryModel.find()
        res.json(category)
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

router.post('/category/add',/*passport.authenticate('jwtAdmin',{session: false}),*/ async (req, res, next) => {
    try {
        const category = new CategoryModel(req.body)
        category.save()
        res.json({ message: 'success' })
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})
router.post('/category/delete/:id',/*passport.authenticate('jwtAdmin',{session: false}),*/ async (req, res, next) => {
    try {
        await CategoryModel.findOneAndDelete({ _id: req.params.id })
        res.json({ message: 'success' })
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

module.exports = router;
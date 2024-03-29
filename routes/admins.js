const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const router = express.Router();
const validateRegisterInput = require("../validation/adminRegister");
const validateLoginInput = require("../validation/login"); // Load User model
const StudentModel = require("../models/Student");
const MentorModel = require("../models/Mentor");
const LiveClassModel = require("../models/LiveClass");
const SubjectModel = require("../models/Subject");
const CategoryModel = require("../models/Category");
const Course = require("../models/Course");
const QuesCategory = require("../models/QuesCategory");
const QuesBank = require("../models/QuesBank");
const LiveClassBundleModel = require("../models/LiveClassBundle");
const StudentRolesModel = require("../models/StudentRoles");
const CouponModel = require("../models/Coupon");
const { application } = require("express");


router.post("/register", async (req, res, next) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return next(errors);
  }
  passport.authenticate("registerAdmin", async (err, user, info) => {
    try {
      if (err || !user) {
        console.log(info);
        return res.status(400).json(info);
      }
      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerify: user.emailVerify,
        type: "admin",
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.post("/login", async (req, res, next) => {
  const { errors, isValid } = validateLoginInput(req.body); // Check validation
  if (!isValid) {
    return next(errors);
  }
  passport.authenticate("loginAdmin", async (err, user, info) => {
    try {
      if (err || !user) {
        console.log(info);
        return res.status(400).json(info);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        //We don't want to store the sensitive information such as the
        //user password in the token so we pick only the email and id
        //console.log(user.id)
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerify: user.emailVerify,
          type: "admin",
        }; // Sign token
        const token = jwt.sign(payload, process.env.secretOrKey, {
          expiresIn: 2678400 /* 1 month in seconds*/,
        });
        return res.json({ success: true, token: token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.get(
    "/profile",
    passport.authenticate("jwtAdmin", { session: false }),
    (req, res, next) => {
      //We'll just send back the user details and the token
      res.json({
        message: "You made it to the secure route",
        user: req.user,
        token: req.query.secret_token,
      });
    }
);

router.post(
    "/allStudents",
    passport.authenticate("jwtAdmin", { session: false }),
    async (req, res, next) => {
      try {
        let sname = req.body.name;

        await StudentModel.find(
            {
              name: { $regex: sname, $options: "i" },
            },
            (err, found) => {
              if (err) {
                res.json(error);
              } else {
                res.json(found);
              }
            }
        );
      } catch (err) {
        return next(err);
      }
    }
);

router.get(
    "/allMentors",
    passport.authenticate("jwtAdmin", { session: false }),
    async (req, res, next) => {
      try {
        const allMentors = await MentorModel.find(
            {},
            "_id name email organization position mobileNo adminVerify"
        );
        //console.log(allMentors)
        res.json(allMentors);
      } catch (err) {
        //console.log(err)
        return next(err);
      }
    }
);

router.get(
    "/allMentors/:id",
    passport.authenticate("jwtAdmin", { session: false }),
    async (req, res, next) => {
      try {
        const mentor = await MentorModel.findById(req.params.id);
        res.json(mentor);
      } catch (err) {
        return next(err);
      }
    }
);

router.put(
    "/verifyMentor/:id",
    passport.authenticate("jwtAdmin", { session: false }),
    async (req, res, next) => {
      try {
        const filter = { _id: req.params.id };
        const update = { adminVerify: true };
        await MentorModel.updateOne(filter, update);
        res.json({ message: "success" });
      } catch (err) {
        return next(err);
      }
    }
);

router.get(
    "/allliveclass",
    passport.authenticate("jwtAdmin", { session: false }),
    async (req, res, next) => {
      try {
        const liveClass = await LiveClassModel.find({});
        //console.log(liveClass)
        res.json(liveClass);
      } catch (err) {
        console.log(err);
        return next(err);
      }
    }
);

router.post(
    "/allliveclass/filter",
    passport.authenticate("jwtAdmin", { session: false }),

    async (req, res, next) => {
      try {
        let { classquery } = req.body;
        console.log(classquery);
        await LiveClassModel.find(
            {
              topic: { $regex: classquery, $options: "i" },
            },
            (err, found) => {
              if (err) {
                res.json(err);
              } else {
                res.json(found);
              }
            }
        );
      } catch (err) {
        return next(err);
      }
    }
);

router.get(
    "/liveclasses",
    passport.authenticate("jwtAdmin", { session: false }),
    async (req, res) => {
      try {
        const liveclass = await LiveClassModel.find();
        res.json(liveclass);
      } catch (error) {
        res.json(error);
      }
    }
);

router.post(
    "/createmodule",
    passport.authenticate("jwtAdmin", { session: false }),
    async (req, res) => {
      try {
        const liveclassbundle = new LiveClassBundleModel(req.body);
        liveclassbundle.save();
        res.json({ success: true, message: "Bundle created successfully" });
      } catch (error) {
        res.json(error.message);
      }
    }
);

router.post(
    "/createcoupon",
    passport.authenticate("jwtAdmin", { session: false }),
    async (req, res) => {
      try {
        //console.log(req.body);
        const coupon = new CouponModel(req.body.formdata);
        coupon.save();
        res.json({ success: true, message: "Coupon created successfully" });
      } catch (error) {
        res.json(error.message);
      }
    }
);

router.get(
    "/coupons",
    passport.authenticate("jwtAdmin", { session: false }),
    async (req, res) => {
      try {
        const coupons = await CouponModel.find();
        res.json(coupons);
      } catch (error) {
        res.json(error.message);
      }
    }
);

router.post(
    "/addroles",
    passport.authenticate("jwtAdmin", { session: false }),
    async (req, res) => {
      try {
        const newrole = new StudentRolesModel(req.body);
        newrole.save();
        res.json({ success: true, message: "Successfully created roles" });
      } catch (error) {
        res.json({ message: error.message });
      }
    }
);

router.get(
    "/roles",
    passport.authenticate("jwtAdmin", { session: false }),
    async (req, res) => {
      try {
        const roles = await StudentRolesModel.find();
        res.json(roles);
      } catch (error) {
        res.json({ message: error.message });
      }
    }
);

router.post(
    "/approvelive/:id",
    passport.authenticate("jwtAdmin", { session: false }),
    async (req, res, next) => {
      try {
        const aproveclass = await LiveClassModel.findOne({ _id: req.params.id });
        console.log(aproveclass);
        const sclass = {
          topic: aproveclass.topic,
          type: 3,
          //start_time: aproveclass.start_date,
          duration: aproveclass.duration,
          timezone: "Asia/Dhaka",
          settings: {
            host_video: true,
            participant_video: false,
            join_before_host: false,
            mute_upon_entry: true,
            watermark: true,
            approval_type: 0,
            auto_recording: "cloud",
            close_registration: false,
            waiting_room: true,
            registrants_email_notification: true,
          },
        };

        const { data } = await axios({
          method: "post",
          url: "https://api.zoom.us/v2/users/russ.iut03@gmail.com/meetings",
          data: sclass,
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${process.env.ZOOMAPIKEY}`,
          },
        });
        aproveclass.approved = true;
        aproveclass.zoomID = data.id;
        aproveclass.zoomJoinLink = data.join_url;
        aproveclass.zoomStartLink = data.start_url;
        aproveclass.zoomPassword = data.password;
        await aproveclass.save();
        console.log(data);
        res.json({ message: "success" });
      } catch (err) {
        console.log(err);
        //return next(err);
        res.json(err);
      }
    }
);

router.get(
    "/subject",
    /*passport.authenticate('jwtAdmin',{session: false}),*/ async (
        req,
        res,
        next
    ) => {
      try {
        const subject = await SubjectModel.find();
        res.json(subject);
      } catch (err) {
        console.log(err);
        res.send(err);
      }
    }
);

router.post("/setprice/:id", async (req, res) => {
  try {
    const liveclass = await LiveClassModel.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { price: req.body.price, fake_price: req.body.fake_price } }
    );
    liveclass.save();
    res.send({ message: "success" });
  } catch (error) {
    res.send(error);
  }
});

router.post(
    "/eachsubject",
    /*passport.authenticate('jwtAdmin',{session: false}),*/ async (
        req,
        res,
        next
    ) => {
      try {
        const subject = await SubjectModel.find({
          category: { $in: req.body.name },
        });
        res.json(subject);
      } catch (err) {
        console.log(err);
        res.send(err);
      }
    }
);

router.post(
    "/subject/add",
    /*passport.authenticate('jwtAdmin',{session: false}),*/ async (req, res) => {
      try {
        const subject = new SubjectModel(req.body);
        await subject.save();
        res.send({ message: "success" });
      } catch (err) {
        console.log(err);
        res.send(err);
      }
    }
);
router.post(
    "/subject/delete/:id",
    /*passport.authenticate('jwtAdmin',{session: false}),*/ async (
        req,
        res,
        next
    ) => {
      try {
        await SubjectModel.findOneAndDelete({ _id: req.params.id });
        res.json({ message: "success" });
      } catch (err) {
        console.log(err);
        res.send(err);
      }
    }
);

router.post(
    "/subject/addSubcategory/:id",
    /*passport.authenticate('jwtAdmin',{session: false}),*/ async (
        req,
        res,
        next
    ) => {
      try {
        await SubjectModel.updateOne(
            { _id: req.params.id },
            { $push: { subcategory: req.body } }
        );
        res.json({ message: "success" });
      } catch (err) {
        console.log(err);
        res.send(err);
      }
    }
);

router.post(
    "/subject/deleteSubcategory/:id/:catid",
    /*passport.authenticate('jwtAdmin',{session: false}),*/ async (
        req,
        res,
        next
    ) => {
      try {
        await SubjectModel.updateOne(
            { _id: req.params.id },
            { $pull: { subcategory: { name: req.body.name } } }
        );
        res.json({ message: "success" });
      } catch (err) {
        console.log(err);
        res.send(err);
      }
    }
);

router.get(
    "/category",
    /*passport.authenticate('jwtAdmin',{session: false}),*/ async (
        req,
        res,
        next
    ) => {
      try {
        const category = await CategoryModel.find();
        res.json(category);
      } catch (err) {
        console.log(err);
        res.send(err);
      }
    }
);

router.post(
    "/category/add",
    /*passport.authenticate('jwtAdmin',{session: false}),*/ async (
        req,
        res,
        next
    ) => {
      try {
        const category = new CategoryModel(req.body);
        category.save();
        res.json({ message: "success" });
      } catch (err) {
        console.log(err);
        res.send(err.message);
      }
    }
);
router.post(
    "/category/delete/:id",
    /*passport.authenticate('jwtAdmin',{session: false}),*/ async (
        req,
        res,
        next
    ) => {
      try {
        await CategoryModel.findOneAndDelete({ _id: req.params.id });
        res.json({ message: "success" });
      } catch (err) {
        console.log(err);
        res.send(err);
      }
    }
);

router.post("/liveclass/updateschedule/:classid/:id", async (req, res) => {
  try {
    await LiveClassModel.findOneAndUpdate(
        { _id: req.params.classid, "classtimes._id": req.params.id },
        {
          $set: {
            "classtimes.$.classtimestring": req.body.changedDate,
          },
        },
        (err, success) => {
          if (err) {
            res.send(err.message);
          } else {
            res.json({ message: "Successfully updated" });
          }
        }
    );
  } catch (error) {
    res.send(error);
  }
});

// question bank
router.get('/questionBank/course',async (req,res,next) => {
    try {
        const courses = await Course.find().populate('subjects')
        res.json(courses);
    } catch(err) {
        res.send(err)
    }
});

router.post('/questionBank/course/add',async (req,res,next) => {
    try{
        const course =  await new Course(req.body)
        course.save();
        res.json({message: 'success'} )
    } catch (error) {
        console.log(error)
    }
})

router.get('/questionBank/category',/*passport.authenticate('jwtAdmin',{session: false}),*/ async (req, res, next) => {
    try {
        const category = await QuesCategory.find().populate('questions')
        res.json(category);
    } catch(err) {
        res.send(err)
    }
});

router.get(`/questionBank/category/:courseId`,async(req,res,next) =>{
    try {
        const category = await QuesCategory.find({course:req.params.courseId}).populate('questions')
        res.json(category);
    } catch(err) {
        res.send(err)
    }
});

router.post('/questionBank/category/add', async(req,res,next) => {
    try {
        const quesCategory = await new QuesCategory(req.body);
        quesCategory.save();

        await Course.findByIdAndUpdate(
            quesCategory.course._id,
            {$push : {subjects : quesCategory._id}},
            { new: false, useFindAndModify: true }
        )
        res.json({message: 'success'});
    } catch(err) {
        res.send(err)
    }
});

router.post('/questionBank/question/add',async (req,res,next) => {
    try {
        const question = await new QuesBank(req.body);
        question.save();
        console.log("question",question)

        const categoryUpdate = await QuesCategory.findByIdAndUpdate(
            question.questionCategory._id,
            {$push : {questions : question._id} },
            { new: false, useFindAndModify: true }
        )
        console.log("categoryUpdate",categoryUpdate)
        res.json({message: 'success'});
    } catch(err) {
        res.send(err)
    }
});

router.get('/questionBank/question/edit/:questionId',async (req,res,next) => {
    try {
        const questions = await QuesBank.findOne({_id: req.params.questionId}).populate('questionCategory')
        res.json(questions);
    } catch(err) {
        res.send(err)
    }
});

router.post('/questionBank/question/update/:questionId',async (req,res,next) => {
    try {
        const question = await QuesBank.findOneAndUpdate(
            { _id: req.params.questionId },
            { $set: req.body }
        );
        question.save();
        res.send({ message: "Successfully updated" });
    } catch(err) {
        res.send(err)
    }
});

router.post(`/questionBank/question/delete/:questionId`, async(req,res,next) => {
    try {
        const {data} = await QuesBank.findOne(req.params.questionId)
        await QuesBank.findOneAndDelete({ _id: req.params.questionId });
        await QuesCategory.updateOne( {_id: data.questionCategory}, { $pullAll: {questions: [req.params.questionId] } } )
        res.json({ message: "successfully deleted" });
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})

router.get('/questionBank/question',async (req,res,next) => {
    try {
        const questions = await QuesBank.find().populate('questionCategory')
        res.json(questions);
    } catch(err) {
        res.send(err)
    }
});

router.get('/questionBank/question/:subjectId/:studentId',async (req,res,next) => {
    try {
        const questions = await QuesCategory.findById(req.params.subjectId).populate('questions')
        const allQues = questions.questions;
        const answered = await StudentModel.findOne({_id: req.params.studentId}).select( { question_bank: {$elemMatch: {subject_id: req.params.subjectId }}} )


        if (answered.question_bank.length > 0){
            const answeredQues = answered.question_bank[0].questions;

            var unAnsweredQuestion = allQues.filter(function(obj) {
                return !answeredQues.some(function(obj2) {
                    return obj._id == obj2.question_id;
                });
            });
            res.json(unAnsweredQuestion);
        }else{
            res.json(questions.questions);
        }
    } catch(err) {
        res.send(err)
    }
});

router.get('/questionBank/question/:subjectId',async (req,res,next) => {
    try {
        const questions = await QuesCategory.findById(req.params.subjectId).populate('questions')
        res.json(questions.questions);
    } catch(err) {
        res.send(err)
    }
});

router.get('/questionBank/:subjectId/:questionId/:selectedAns/:studentId',async(req,res,next) => {
    try{
        const subject = await QuesCategory.findById(req.params.subjectId);

        const find = await StudentModel.find(
            { _id: req.params.studentId,  question_bank: { $elemMatch: { subject_id: req.params.subjectId } } }
        )
        if(find.length > 0){
            const asd = await StudentModel.findOneAndUpdate(
                {_id: req.params.studentId},
                { $push: {
                        "question_bank.$[outer].questions":
                            {
                                "question_id" : req.params.questionId,
                                "answer" : req.params.selectedAns
                            }
                    }
                },
                { "arrayFilters": [{"outer.subject_id": req.params.subjectId }] }
            );

        }else{
            const asd = await StudentModel.findOneAndUpdate(
                {_id: req.params.studentId},
                {$push :{
                        "question_bank" : {
                            "subject_id": req.params.subjectId,
                            "subject_name": subject.name,
                            "course_id": subject.course._id,
                            "questions": {
                                "question_id" : req.params.questionId,
                                "answer" : req.params.selectedAns
                            }
                        }
                    } }
            )

        }


    } catch(err) {
        console.log(err)
    }
})
// question bank end

module.exports = router;

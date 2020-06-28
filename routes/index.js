const express = require('express');
const { isLoggedIn, isAuth } = require('../handlers/authentication');
const createCourse = require('../handlers/createCourse');
const { courseFormValidator } = require('../handlers/validators');
const Course = require('../models/course');
const joinCourse = require('../handlers/joinCourse');
const e = require('express');
const router = express.Router();


/* GET home page. */
router.get('/', isLoggedIn, async (req, res) => {

  const courses = await Course.find().lean();

  courses.reverse()
    .map(course => {
      const isCreator = res.userId == course.creatorId;
      course.owner = isCreator;
    })

  res.render('home', {
    courses,
    isLogged: res.isLogged,
    username: res.email
  });
});


router.get('/course/create', isAuth, isLoggedIn, (req, res) => {
  res.render('create-course', {
    isLogged: res.isLogged,
    username: res.email
  })
})

router.post('/create-course', courseFormValidator, createCourse);


router.get('/details/:id', isLoggedIn, async (req, res) => {
  const course = await Course.findById(req.params.id).lean();
  const isEnrolled = course.usersEnrolled.includes(res.email);
  const isCreator = res.userId == course.creatorId;

  res.render('course-details', {
    ...course,
    isEnrolled,
    isCreator,
    isLogged: res.isLogged,
    username: res.email
  })
})

router.get('/details/join/:id', isLoggedIn, async (req, res) => {
  joinCourse(req, res)
})

router.get('/edit/:id', isLoggedIn, async (req, res) => {

  const course = await Course.findById(req.params.id);

  res.render('edit-course', {
    _id: course._id,
    imageUrl: course.imageUrl,
    title: course.title,
    description: course.description,
    isLogged: res.isLogged,
    username: res.email
  })
})

router.post('/edit/:id', async (req, res) => {

  const id = req.params.id;
  let isPublic = req.body.isPublic;
  if (isPublic) {
    req.body.isPublic = true;
  } else {
    req.body.isPublic = false;
  }

  try {
    await Course.findByIdAndUpdate(id, { $set: req.body }, { upsert: true });
  } catch (error) {
    console.error(error);
  }
  return res.redirect(`/details/${id}`)
})

router.get('/delete/:id', isAuth, (req, res) => {
  const id = req.params.id;

  Course.findByIdAndDelete(id)
    .then(() => res.redirect(301, '/'))
    .catch(console.error)
})

router.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.redirect('/');
})


module.exports = router;

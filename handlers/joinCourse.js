const Course = require('../models/course');

module.exports = async (req, res) => {
    const id = req.params.id;
    const course = await Course.findById(id).lean();

    course.usersEnrolled.push(res.email);
    console.log(course);

    Course.findByIdAndUpdate(id, { $set: course }, { upsert: true })
        .then((course) => console.log('Enrolled Successfully!'))
        .catch(console.error)

    return res.redirect(`/details/${id}`);
}
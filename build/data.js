const fs = require("fs"),
    path = require("path"),
    faker = require("faker"),
    utils = require("./utils"),
    utf8 = "utf-8";


const mugshots = [
        "avtar-1.jpg",
        "avtar-2.jpg",
        "avtar-3.jpg",
        "avtar-4.jpg",
        "avtar-5.jpg",
        "avtar-6.jpg",
        "avtar-7.jpg",
        "avtar-8.jpg"
    ],
    courseTime = [
        "MWF 8AM",
        "MWF 10AM",
        "MWF 12AM",
        "MWF 2AM",
        "MWF 4AM",
        "TH 8AM",
        "TH 10AM",
        "TH 12AM",
        "TH 2AM",
        "TH 4AM"
    ];

//read content/article
let db = fs.readFileSync(path.resolve("../db.json"), utf8);

db = JSON.parse(db);

//fake events

db.courses = [];
db.students = [];

const generateCourses = () => {

    let courseCount = faker.random.number(100) + 10;
    let courses = [];

    for (let count = 0; count < courseCount; count++) {

        let time = faker.random.number(courseTime.length) - 1;

        let course = {
            "id": faker.random.uuid(),
            "title": faker.commerce.productName(),
            "building": faker.company.companyName(),
            "room": faker.address.streetAddress(),
            "time": courseTime[time],
            "mugshot": mugshots[faker.random.number(mugshots.length) -1],
            "credits": faker.random.number(3) + 1,
            "capacity": faker.random.number(200),
            "instructor": faker.name.lastName(),
            "description": faker.lorem.paragraph(),
            "students": []
        };

        courses.push(course);

    }

    return courses;

}

const generateStudentCourses = () => {

    for (let index = 0; index < db.students.length; index++) {

        const student = db.students[index];

        let courses = faker.random.number(4);

        student.courses = [];

        for (let i = 0; i < courses; i++) {

            let _courseIndex = faker.random.number(db.courses.length - 1),
                _course = db.courses[_courseIndex];

            db.courses[_courseIndex].students.push({
                "id": student.id,
                "firstName": student.firstName,
                "lastName": student.lastName    
            });

            student.courses.push({
                "id": _course.id,
                "title": _course.title,
                "instructor": _course.instructor
            });

        }

        db.students[index] = student;
    }

}

const generateStudents = () => {

    //fake strudents
    for (count = 0; count < faker.random.number(50) + 52; count++) {

        let mugshot = faker.random.number(8) - 1;

        if (mugshot < 0) {
            mugshot = 0;
        }

        if (mugshot > 7) {
            mugshot = 7;
        }

        let student = {
            "id": faker.random.uuid(),
            "firstName": faker.name.firstName(),
            "lastName": faker.name.lastName(),
            "mugshot": mugshots[mugshot],
            "userName": faker.internet.userName(),
            "password": faker.internet.password(),
            "email": faker.internet.email(),
            "phoneNumber": faker.phone.phoneNumber()
        }

        student.Courses = generateStudentCourses();

        db.students.push(student);

    }

}


db.courses = generateCourses();
generateStudents();

fs.writeFileSync(path.resolve("../db.json"), JSON.stringify(db), utf8);

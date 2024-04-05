var express = require('express');
var router = express.Router();
var data = require('../data/data');

router.get('/subject-list', function (req, res, next) {
  res.render('student-subject-list', {
    title: '강의 목록(학생)',
    subjects: data,
  });
});

router.get('/:subjectId', function (req, res, next) {
  const subjectId = Number(req.params.subjectId);
  let result = data.filter((x) => x.subject_id == subjectId);
  if (result.length != 1) return res.sendStatus(500);
  res.render('student-subject', {
    title: result[0].subject_name,
    subject_id: result[0].subject_id,
  });
});

router.post('/:subjectId', function (req, res, next) {
  const subjectId = Number(req.params.subjectId);
  const startTime = Number(req.body.startTime);
  const studentName = req.body.studentName;
  const studentId = req.body.studentId;
  const attendanceCode = req.body.attendanceCode;
  let result1 = data.filter((x) => x.subject_id == subjectId);
  if (result1.length != 1) return res.sendStatus(500);
  // #1. 유효한 학생인지 검증
  let result2 = result1[0].students.filter((x) => x.id == studentId);
  if (result2.length != 1 || result2[0].name != studentName)
    return res.sendStatus(400);

  // #2. 출석코드 검증
  // 애초에 출석 코드 데이터가 없는 경우
  if (!result1[0].attendance_code[attendanceCode]) return res.sendStatus(400);
  // 인증 기간이 만료된 출석 코드인 경우
  if (Math.abs(result1[0].attendance_code[attendanceCode] - startTime) > 5)
    return res.sendStatus(400);

  // 인증에 성공한 경우
  res.sendStatus(200);
});

module.exports = router;

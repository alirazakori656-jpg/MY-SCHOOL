/* DEMO ONLY — LocalStorage data layer. Swap get/save with API later. */
const SMS = {
  KEYS: [
    'students','teachers','staff','parents','classes','sections','subjects',
    'attendance','teacherAttendance','timetable','homework','examTypes','exams',
    'results','feeStructure','feePayments','admissions','leaves','notices',
    'notifications','users','settings','documents'
  ],
  generateId(prefix) {
    return prefix + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  },
  getData(key) {
    try {
      const raw = localStorage.getItem('sms_' + key);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('storage read', key, e);
      return [];
    }
  },
  saveData(key, data) {
    localStorage.setItem('sms_' + key, JSON.stringify(data));
    return data;
  },
  updateData(key, id, patch) {
    const list = this.getData(key);
    const i = list.findIndex(x => x.id === id);
    if (i === -1) return null;
    list[i] = { ...list[i], ...patch };
    this.saveData(key, list);
    return list[i];
  },
  deleteData(key, id) {
    const list = this.getData(key).filter(x => x.id !== id);
    this.saveData(key, list);
    return list;
  },
  hashDemo(pw) {
    let h = 0;
    for (let i = 0; i < pw.length; i++) h = ((h << 5) - h) + pw.charCodeAt(i);
    return 'demo$' + (h >>> 0).toString(16);
  },
  escape(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
};

function seedIfEmpty() {
  if (localStorage.getItem('sms_seeded_v1')) return;
  const settings = {
    schoolName: 'THE SMART MODERN PUBLIC SCHOOL QAMBER',
    shortName: 'SMPS Qamber',
    address: 'Qamber Ali Khan, Larkana District, Sindh, Pakistan',
    phone: '+92 74 1234567',
    email: 'info@smpsqamber.edu.pk',
    website: 'www.smpsqamber.edu.pk',
    principalName: 'Prof. Abdul Rehman Shaikh',
    registrationNumber: 'SINDH-EDU-QMB-2014-088',
    session: '2026–2027',
    currency: 'PKR',
    dateFormat: 'DD-MM-YYYY',
    timeFormat: '12h',
    passingPercentage: 50,
    grades: [
      { name: 'A+', min: 90, max: 100 },
      { name: 'A', min: 80, max: 89 },
      { name: 'B', min: 70, max: 79 },
      { name: 'C', min: 60, max: 69 },
      { name: 'D', min: 50, max: 59 },
      { name: 'F', min: 0, max: 49 }
    ]
  };
  SMS.saveData('settings', settings);

  const users = [
    { id: 'u-admin', name: 'System Admin', email: 'admin@smpsqamber.edu.pk', username: 'admin', passwordHash: SMS.hashDemo('admin123'), role: 'admin', status: 'Active' },
    { id: 'u-prin', name: 'Prof. Abdul Rehman Shaikh', email: 'principal@smpsqamber.edu.pk', username: 'principal', passwordHash: SMS.hashDemo('principal123'), role: 'principal', status: 'Active' },
    { id: 'u-teach', name: 'Ms. Ayesha Memon', email: 'ayesha@smpsqamber.edu.pk', username: 'teacher', passwordHash: SMS.hashDemo('teacher123'), role: 'teacher', status: 'Active', teacherId: 't-01' },
    { id: 'u-acc', name: 'Mr. Imran Ali', email: 'accounts@smpsqamber.edu.pk', username: 'accountant', passwordHash: SMS.hashDemo('accounts123'), role: 'accountant', status: 'Active' },
    { id: 'u-staff', name: 'Mr. Saleem Raza', email: 'staff@smpsqamber.edu.pk', username: 'staff', passwordHash: SMS.hashDemo('staff123'), role: 'staff', status: 'Active' }
  ];
  SMS.saveData('users', users);

  const classes = [
    { id: 'c1', name: 'Grade 1', level: 1 },
    { id: 'c2', name: 'Grade 2', level: 2 },
    { id: 'c3', name: 'Grade 3', level: 3 },
    { id: 'c4', name: 'Grade 4', level: 4 },
    { id: 'c5', name: 'Grade 5', level: 5 },
    { id: 'c6', name: 'Grade 6', level: 6 }
  ];
  SMS.saveData('classes', classes);

  const sections = [];
  classes.forEach(c => {
    ['A','B','C'].forEach(s => {
      sections.push({ id: c.id + '-' + s, classId: c.id, name: s, classTeacherId: null });
    });
  });
  SMS.saveData('sections', sections);

  const teachers = [
    { id: 't-01', name: 'Ms. Ayesha Memon', fatherName: 'Ghulam Memon', gender: 'Female', dob: '1992-04-12', employeeId: 'EMP-T-01', phone: '0300-1112233', email: 'ayesha@smpsqamber.edu.pk', address: 'Qamber City', qualification: 'M.Ed English', experience: '8 years', joiningDate: '2018-08-01', designation: 'Senior Teacher', subjects: ['English'], classes: ['Grade 5','Grade 6'], salary: 65000, status: 'Active' },
    { id: 't-02', name: 'Mr. Nadeem Abbasi', fatherName: 'Ali Abbasi', gender: 'Male', dob: '1988-01-20', employeeId: 'EMP-T-02', phone: '0301-2223344', email: 'nadeem@smpsqamber.edu.pk', address: 'Larkana Road', qualification: 'M.Sc Mathematics', experience: '10 years', joiningDate: '2016-04-10', designation: 'HOD Mathematics', subjects: ['Mathematics'], classes: ['Grade 4','Grade 5','Grade 6'], salary: 72000, status: 'Active' },
    { id: 't-03', name: 'Ms. Sana Soomro', fatherName: 'Rashid Soomro', gender: 'Female', dob: '1994-09-05', employeeId: 'EMP-T-03', phone: '0333-4455667', email: 'sana@smpsqamber.edu.pk', address: 'Qamber', qualification: 'M.Sc Biology', experience: '6 years', joiningDate: '2019-09-01', designation: 'Science Teacher', subjects: ['Science'], classes: ['Grade 3','Grade 4'], salary: 58000, status: 'Active' },
    { id: 't-04', name: 'Mr. Kashif Bhutto', fatherName: 'Niaz Bhutto', gender: 'Male', dob: '1985-11-11', employeeId: 'EMP-T-04', phone: '0345-6677889', email: 'kashif@smpsqamber.edu.pk', address: 'Qamber', qualification: 'M.A Islamiat', experience: '12 years', joiningDate: '2015-03-01', designation: 'Islamiat Teacher', subjects: ['Islamiat'], classes: ['Grade 1','Grade 2','Grade 3'], salary: 60000, status: 'Active' },
    { id: 't-05', name: 'Ms. Hina Qureshi', fatherName: 'Tariq Qureshi', gender: 'Female', dob: '1990-06-18', employeeId: 'EMP-T-05', phone: '0321-8899001', email: 'hina@smpsqamber.edu.pk', address: 'Qamber', qualification: 'M.A Urdu', experience: '7 years', joiningDate: '2018-01-15', designation: 'Urdu Teacher', subjects: ['Urdu'], classes: ['Grade 2','Grade 3'], salary: 56000, status: 'Active' },
    { id: 't-06', name: 'Mr. Faisal Chandio', fatherName: 'Umer Chandio', gender: 'Male', dob: '1987-02-02', employeeId: 'EMP-T-06', phone: '0302-1122334', email: 'faisal@smpsqamber.edu.pk', address: 'Qamber', qualification: 'BS Computer Science', experience: '5 years', joiningDate: '2021-08-01', designation: 'Computer Teacher', subjects: ['Computer'], classes: ['Grade 5','Grade 6'], salary: 62000, status: 'Active' },
    { id: 't-07', name: 'Ms. Rabia Khoso', fatherName: 'Javed Khoso', gender: 'Female', dob: '1993-12-22', employeeId: 'EMP-T-07', phone: '0313-5566778', email: 'rabia@smpsqamber.edu.pk', address: 'Qamber', qualification: 'B.Ed', experience: '4 years', joiningDate: '2022-04-01', designation: 'Class Teacher', subjects: ['Social Studies'], classes: ['Grade 1','Grade 2'], salary: 50000, status: 'Active' },
    { id: 't-08', name: 'Mr. Waseem Brohi', fatherName: 'Gul Brohi', gender: 'Male', dob: '1989-07-07', employeeId: 'EMP-T-08', phone: '0344-7788990', email: 'waseem@smpsqamber.edu.pk', address: 'Qamber', qualification: 'M.A Sindhi', experience: '9 years', joiningDate: '2017-09-01', designation: 'Sindhi Teacher', subjects: ['Sindhi'], classes: ['Grade 4','Grade 5'], salary: 54000, status: 'Active' },
    { id: 't-09', name: 'Ms. Farzana Laghari', fatherName: 'Allah Ditto', gender: 'Female', dob: '1991-03-30', employeeId: 'EMP-T-09', phone: '0308-3344556', email: 'farzana@smpsqamber.edu.pk', address: 'Qamber', qualification: 'M.Ed', experience: '6 years', joiningDate: '2020-01-10', designation: 'Class Teacher G1', subjects: ['English'], classes: ['Grade 1'], salary: 52000, status: 'Active' },
    { id: 't-10', name: 'Mr. Asif Tunio', fatherName: 'Mumtaz Tunio', gender: 'Male', dob: '1984-08-14', employeeId: 'EMP-T-10', phone: '0331-9900112', email: 'asif@smpsqamber.edu.pk', address: 'Qamber', qualification: 'M.Sc Physics', experience: '14 years', joiningDate: '2014-08-01', designation: 'Vice Principal', subjects: ['Science'], classes: ['Grade 6'], salary: 85000, status: 'Active' }
  ];
  SMS.saveData('teachers', teachers);
  sections[0].classTeacherId = 't-09';
  sections[9].classTeacherId = 't-01';
  SMS.saveData('sections', sections);

  const staff = [
    { id: 'st-01', name: 'Mr. Imran Ali', position: 'Accountant', phone: '0300-7008009', email: 'accounts@smpsqamber.edu.pk', joiningDate: '2017-02-01', salary: 45000, status: 'Active', documents: 'CNIC copy' },
    { id: 'st-02', name: 'Mr. Saleem Raza', position: 'Clerk', phone: '0301-6007008', email: 'clerk@smpsqamber.edu.pk', joiningDate: '2019-05-12', salary: 32000, status: 'Active', documents: 'CNIC copy' },
    { id: 'st-03', name: 'Ms. Nadia Baloch', position: 'Librarian', phone: '0333-2112334', email: 'library@smpsqamber.edu.pk', joiningDate: '2020-08-01', salary: 35000, status: 'Active', documents: 'Degree copy' },
    { id: 'st-04', name: 'Ms. Shazia Pathan', position: 'Receptionist', phone: '0345-1221334', email: 'front@smpsqamber.edu.pk', joiningDate: '2021-01-04', salary: 28000, status: 'Active', documents: 'CNIC copy' },
    { id: 'st-05', name: 'Mr. Ghulam Hussain', position: 'Security', phone: '0302-9889776', email: '', joiningDate: '2016-11-01', salary: 25000, status: 'Active', documents: 'CNIC copy' }
  ];
  SMS.saveData('staff', staff);

  const firstNamesM = ['Ahmed','Bilal','Hassan','Usman','Zain','Hamza','Ali','Farhan','Sajid','Taha'];
  const firstNamesF = ['Amina','Fatima','Hira','Iqra','Laiba','Maryam','Noor','Sana','Zara','Ayesha'];
  const lastNames = ['Shaikh','Memon','Abbasi','Soomro','Bhutto','Chandio','Khoso','Brohi','Laghari','Tunio','Qureshi','Pathan'];
  const students = [];
  const parents = [];
  let roll = 1;
  for (let i = 0; i < 22; i++) {
    const female = i % 2 === 1;
    const fn = female ? firstNamesF[i % 10] : firstNamesM[i % 10];
    const ln = lastNames[i % lastNames.length];
    const cls = classes[i % 6];
    const sec = ['A','B','C'][i % 3];
    const father = 'Mr. ' + lastNames[(i+3)%lastNames.length] + ' ' + ln;
    const mother = 'Mrs. ' + lastNames[(i+5)%lastNames.length];
    const sid = 'STU-' + String(1001 + i);
    const pid = 'PAR-' + String(501 + i);
    students.push({
      id: sid, admissionNo: 'ADM-2026-' + String(101 + i), name: fn + ' ' + ln,
      fatherName: father, motherName: mother, dob: (2014 + (i%5)) + '-0' + ((i%8)+1) + '-' + String((i%27)+1).padStart(2,'0'),
      gender: female ? 'Female' : 'Male', classId: cls.id, className: cls.name, section: sec,
      rollNo: roll++, phone: '03' + String(10 + (i%80)).padStart(2,'0') + '-' + String(1000000 + i*111).slice(0,7),
      email: fn.toLowerCase() + i + '@student.smpsqamber.edu.pk',
      address: 'House ' + (12+i) + ', Block ' + (i%4+1) + ', Qamber', city: 'Qamber',
      admissionDate: '2026-04-' + String((i%20)+1).padStart(2,'0'), previousSchool: i%3===0 ? 'Govt. Primary School Qamber' : '',
      bloodGroup: ['A+','B+','O+','AB+','A-'][i%5], emergencyContact: '0300-' + String(8000000+i).slice(0,7),
      photo: '', documents: 'B-Form, Photos', status: 'Active', parentId: pid
    });
    parents.push({
      id: pid, fatherName: father, motherName: mother,
      phone: '0301-' + String(7000000+i).slice(0,7),
      email: 'parent' + (i+1) + '@mail.com',
      address: 'House ' + (12+i) + ', Qamber', occupation: ['Farmer','Teacher','Shopkeeper','Govt Employee','Business'][i%5],
      children: [sid]
    });
  }
  SMS.saveData('students', students);
  SMS.saveData('parents', parents);

  const subjects = [
    { id: 'sub-eng', name: 'English', code: 'ENG', classId: '', teacherId: 't-01', maxMarks: 100, passingMarks: 50 },
    { id: 'sub-mat', name: 'Mathematics', code: 'MATH', classId: '', teacherId: 't-02', maxMarks: 100, passingMarks: 50 },
    { id: 'sub-sci', name: 'Science', code: 'SCI', classId: '', teacherId: 't-03', maxMarks: 100, passingMarks: 50 },
    { id: 'sub-isl', name: 'Islamiat', code: 'ISL', classId: '', teacherId: 't-04', maxMarks: 50, passingMarks: 25 },
    { id: 'sub-urd', name: 'Urdu', code: 'URD', classId: '', teacherId: 't-05', maxMarks: 100, passingMarks: 50 },
    { id: 'sub-cs', name: 'Computer', code: 'CS', classId: '', teacherId: 't-06', maxMarks: 50, passingMarks: 25 },
    { id: 'sub-ss', name: 'Social Studies', code: 'SST', classId: '', teacherId: 't-07', maxMarks: 100, passingMarks: 50 },
    { id: 'sub-sin', name: 'Sindhi', code: 'SIN', classId: '', teacherId: 't-08', maxMarks: 100, passingMarks: 50 }
  ];
  SMS.saveData('subjects', subjects);

  const today = new Date().toISOString().slice(0,10);
  const attendance = [];
  students.forEach((s, i) => {
    const st = i % 11 === 0 ? 'Absent' : (i % 13 === 0 ? 'Leave' : 'Present');
    attendance.push({ id: 'att-' + s.id + '-' + today, studentId: s.id, date: today, classId: s.classId, section: s.section, status: st });
  });
  SMS.saveData('attendance', attendance);

  const teacherAttendance = teachers.map((t, i) => ({
    id: 'tatt-' + t.id + '-' + today, teacherId: t.id, date: today,
    status: i === 8 ? 'Leave' : (i === 4 ? 'Half Day' : 'Present')
  }));
  SMS.saveData('teacherAttendance', teacherAttendance);

  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const periods = [
    { p: 1, start: '08:00', end: '08:45' },
    { p: 2, start: '08:45', end: '09:30' },
    { p: 3, start: '09:45', end: '10:30' },
    { p: 4, start: '10:30', end: '11:15' },
    { p: 5, start: '11:30', end: '12:15' },
    { p: 6, start: '12:15', end: '13:00' }
  ];
  const timetable = [];
  days.forEach((d, di) => {
    periods.forEach((pr, pi) => {
      const sub = subjects[(di + pi) % subjects.length];
      timetable.push({
        id: 'tt-' + di + '-' + pi, classId: 'c5', section: 'A', day: d,
        period: pr.p, startTime: pr.start, endTime: pr.end,
        subjectId: sub.id, teacherId: sub.teacherId, room: 'R-' + (101 + pi)
      });
    });
  });
  SMS.saveData('timetable', timetable);

  SMS.saveData('homework', [
    { id: 'hw-1', subjectId: 'sub-eng', classId: 'c5', section: 'A', teacherId: 't-01', title: 'Essay: My School', description: 'Write 200 words on My School.', assignedDate: '2026-09-10', dueDate: '2026-09-17', status: 'Assigned' },
    { id: 'hw-2', subjectId: 'sub-mat', classId: 'c6', section: 'B', teacherId: 't-02', title: 'Exercise 4.2', description: 'Solve all even questions.', assignedDate: '2026-09-12', dueDate: '2026-09-18', status: 'Assigned' },
    { id: 'hw-3', subjectId: 'sub-sci', classId: 'c4', section: 'A', teacherId: 't-03', title: 'Parts of a Plant', description: 'Draw and label parts of a plant.', assignedDate: '2026-09-11', dueDate: '2026-09-16', status: 'Assigned' }
  ]);

  SMS.saveData('examTypes', [
    { id: 'et-1', name: 'Monthly Test' },
    { id: 'et-2', name: 'Mid Term' },
    { id: 'et-3', name: 'Final Term' },
    { id: 'et-4', name: 'Annual Exam' }
  ]);

  SMS.saveData('exams', [
    { id: 'ex-1', typeId: 'et-2', classId: 'c5', subjectId: 'sub-eng', date: '2026-10-05', startTime: '09:00', endTime: '11:00', room: 'Hall A' },
    { id: 'ex-2', typeId: 'et-2', classId: 'c5', subjectId: 'sub-mat', date: '2026-10-07', startTime: '09:00', endTime: '11:00', room: 'Hall A' },
    { id: 'ex-3', typeId: 'et-2', classId: 'c6', subjectId: 'sub-sci', date: '2026-10-08', startTime: '09:00', endTime: '11:00', room: 'Lab 1' }
  ]);

  const results = [];
  students.filter(s => s.classId === 'c5').forEach((s, i) => {
    subjects.slice(0,5).forEach((sub, j) => {
      const obt = 55 + ((i * 7 + j * 11) % 40);
      results.push({
        id: 'res-' + s.id + '-' + sub.id, studentId: s.id, subjectId: sub.id,
        examTypeId: 'et-2', totalMarks: sub.maxMarks, obtainedMarks: Math.min(obt, sub.maxMarks),
        remarks: obt >= 80 ? 'Excellent' : 'Good'
      });
    });
  });
  SMS.saveData('results', results);

  const feeStructure = classes.map((c, i) => ({
    id: 'fs-' + c.id, classId: c.id,
    admissionFee: 5000, tuitionFee: 2500 + i * 300, examFee: 800,
    computerFee: i > 2 ? 500 : 0, transportFee: 1500, otherFee: 200, discount: 0
  }));
  SMS.saveData('feeStructure', feeStructure);

  const feePayments = students.slice(0, 14).map((s, i) => {
    const fs = feeStructure.find(f => f.classId === s.classId);
    const amount = fs.tuitionFee + fs.examFee;
    const paid = i % 4 === 0 ? amount * 0.5 : amount;
    return {
      id: 'pay-' + s.id, invoiceNo: 'INV-2026-' + String(2001 + i),
      studentId: s.id, month: 'September 2026', feeType: 'Tuition + Exam',
      amount, discount: i % 7 === 0 ? 200 : 0, paidAmount: paid,
      remaining: Math.max(0, amount - paid - (i % 7 === 0 ? 200 : 0)),
      method: ['Cash','Bank Transfer','Online'][i%3], paymentDate: '2026-09-0' + ((i%8)+1)
    };
  });
  SMS.saveData('feePayments', feePayments);

  SMS.saveData('admissions', [
    { id: 'adm-1', applicationNo: 'APP-2026-01', name: 'Raza Ali', fatherName: 'Akbar Ali', motherName: 'Sajida', dob: '2018-03-11', gender: 'Male', previousSchool: 'ABC School', applyingClass: 'Grade 1', phone: '0300-5556677', email: 'raza.p@mail.com', address: 'Qamber', documents: 'B-Form', applicationDate: '2026-08-20', status: 'Pending' },
    { id: 'adm-2', applicationNo: 'APP-2026-02', name: 'Mehak Soomro', fatherName: 'Imam Bux', motherName: 'Zahida', dob: '2017-06-02', gender: 'Female', previousSchool: '', applyingClass: 'Grade 2', phone: '0333-2211445', email: '', address: 'Qamber', documents: 'Photos', applicationDate: '2026-08-22', status: 'Approved' },
    { id: 'adm-3', applicationNo: 'APP-2026-03', name: 'Danish Brohi', fatherName: 'Lal Bux', motherName: 'Nasreen', dob: '2016-01-19', gender: 'Male', previousSchool: 'XYZ Academy', applyingClass: 'Grade 3', phone: '0345-9988776', email: '', address: 'Qamber', documents: '', applicationDate: '2026-08-25', status: 'Rejected' }
  ]);

  SMS.saveData('leaves', [
    { id: 'lv-1', type: 'Student', applicantId: students[0].id, applicantName: students[0].name, leaveType: 'Sick', fromDate: '2026-09-14', toDate: '2026-09-15', reason: 'Fever', status: 'Approved', approvedBy: 'Principal' },
    { id: 'lv-2', type: 'Teacher', applicantId: 't-09', applicantName: 'Ms. Farzana Laghari', leaveType: 'Casual', fromDate: today, toDate: today, reason: 'Family event', status: 'Pending', approvedBy: '' },
    { id: 'lv-3', type: 'Staff', applicantId: 'st-05', applicantName: 'Mr. Ghulam Hussain', leaveType: 'Casual', fromDate: '2026-09-18', toDate: '2026-09-18', reason: 'Personal', status: 'Pending', approvedBy: '' }
  ]);

  SMS.saveData('notices', [
    { id: 'n-1', title: 'Independence Day Assembly', description: 'Special assembly on 14 August. All students in uniform.', date: '2026-08-10', audience: 'Everyone', priority: 'High', attachment: '', status: 'Published', kind: 'Event' },
    { id: 'n-2', title: 'Fee Due Reminder — September', description: 'Please clear September tuition by 20th.', date: '2026-09-05', audience: 'Parents', priority: 'High', attachment: '', status: 'Published', kind: 'Notice' },
    { id: 'n-3', title: 'Mid Term Schedule Released', description: 'Mid term exams start 5 October 2026.', date: '2026-09-12', audience: 'Students', priority: 'Medium', attachment: '', status: 'Published', kind: 'Circular' }
  ]);

  SMS.saveData('notifications', [
    { id: 'nt-1', title: 'Fee due reminder', body: 'September fees pending for some students.', read: false, date: today, type: 'fee' },
    { id: 'nt-2', title: 'New homework', body: 'Essay: My School assigned to Grade 5-A.', read: false, date: '2026-09-10', type: 'homework' },
    { id: 'nt-3', title: 'Exam announcement', body: 'Mid Term starts 5 October.', read: true, date: '2026-09-12', type: 'exam' },
    { id: 'nt-4', title: 'New notice', body: 'Independence Day Assembly published.', read: true, date: '2026-08-10', type: 'notice' }
  ]);

  SMS.saveData('documents', []);
  localStorage.setItem('sms_seeded_v1', '1');
}

seedIfEmpty();

const PERMS = {
  admin: { dashboard:'full', students:'full', teachers:'full', staff:'full', parents:'full', classes:'full', subjects:'full', attendance:'full', timetable:'full', homework:'full', exams:'full', fees:'full', admissions:'full', leaves:'full', notices:'full', notifications:'full', reports:'full', settings:'full' },
  principal: { dashboard:'full', students:'full', teachers:'full', staff:'full', parents:'full', classes:'full', subjects:'full', attendance:'full', timetable:'full', homework:'full', exams:'full', fees:'view', admissions:'full', leaves:'full', notices:'full', notifications:'full', reports:'full', settings:'limited' },
  teacher: { dashboard:'limited', students:'assigned', teachers:'view', staff:'none', parents:'view', classes:'view', subjects:'view', attendance:'manage', timetable:'view', homework:'full', exams:'manage', fees:'view', admissions:'none', leaves:'limited', notices:'view', notifications:'full', reports:'limited', settings:'none' },
  accountant: { dashboard:'limited', students:'view', teachers:'view', staff:'view', parents:'view', classes:'view', subjects:'none', attendance:'view', timetable:'none', homework:'none', exams:'view', fees:'full', admissions:'view', leaves:'none', notices:'view', notifications:'full', reports:'fees', settings:'none' },
  staff: { dashboard:'limited', students:'view', teachers:'limited', staff:'view', parents:'view', classes:'view', subjects:'none', attendance:'view', timetable:'view', homework:'none', exams:'view', fees:'limited', admissions:'view', leaves:'limited', notices:'view', notifications:'full', reports:'limited', settings:'none' }
};

const Auth = {
  sessionKey: 'sms_session',
  current() {
    try { return JSON.parse(sessionStorage.getItem(this.sessionKey) || localStorage.getItem(this.sessionKey) || 'null'); }
    catch { return null; }
  },
  can(module, need) {
    const u = this.current();
    if (!u) return false;
    const level = (PERMS[u.role] || {})[module] || 'none';
    const rank = { none:0, limited:1, view:2, assigned:2, manage:3, fees:3, full:4 };
    const needRank = { view:2, limited:1, manage:3, full:4 };
    if (!need) return level !== 'none';
    return (rank[level] || 0) >= (needRank[need] || 1);
  },
  login(username, password, remember) {
    const users = SMS.getData('users');
    const u = users.find(x => (x.username === username || x.email === username) && x.status === 'Active');
    if (!u || u.passwordHash !== SMS.hashDemo(password)) return { ok: false, error: 'Invalid username or password (demo).' };
    const sess = { id: u.id, name: u.name, email: u.email, username: u.username, role: u.role, teacherId: u.teacherId || null };
    const store = remember ? localStorage : sessionStorage;
    (remember ? sessionStorage : localStorage).removeItem(this.sessionKey);
    store.setItem(this.sessionKey, JSON.stringify(sess));
    return { ok: true, user: sess };
  },
  logout() {
    sessionStorage.removeItem(this.sessionKey);
    localStorage.removeItem(this.sessionKey);
    location.href = 'login.html';
  },
  require(module) {
    const u = this.current();
    if (!u) { location.href = 'login.html'; return null; }
    if (module && !this.can(module)) {
      location.href = 'dashboard.html';
      return null;
    }
    return u;
  }
};

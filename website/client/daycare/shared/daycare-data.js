/* ============================================================
   DIGITAL RISE — DAYCARE OS CLIENT DATA
   client/daycare/shared/daycare-data.js
   ============================================================ */

window.DC = {

  /* ── Nursery ─────────────────────────────────────────── */
  nursery: {
    name: 'Sunshine Nursery',
    tagline: 'Where little ones grow',
    address: '124 Maple Avenue, Edmonton, AB T5H 2K4',
    phone: '+1 780 555 0100',
    email: 'hello@sunshinenursery.com',
    whatsapp: '+1 780 555 0100',
    website: 'https://sunshinenursery.com',
    googleReviewLink: 'https://g.page/r/sunshine-nursery/review',
    primaryColor: '#7C3AED',
    capacity: 40,
    enrolled: 32,
  },

  /* ── KPIs ────────────────────────────────────────────── */
  kpis: {
    newEnquiries: 8,
    toursBooked: 3,
    enrolled: 32,
    todayAttendance: 28,
    staffOnDuty: 6,
    reviewsCollected: 47,
    parentMessages: 5,
    avgResponseTime: '8s',
    monthlyRevenue: 36800,
    enrolmentOpportunity: 8,
    todayPresent: 28,
    todayAbsent: 4,
    mealsServed: 84,
    napReportsPending: 3,
    activitiesCompleted: 6,
    messagesUnread: 5,
  },

  /* ── Rooms ───────────────────────────────────────────── */
  rooms: [
    { id: 'infants',   name: 'Infants',   ageRange: '0–18 months', capacity: 8,  enrolled: 7,  teacher: 'Emma Rodriguez' },
    { id: 'toddlers',  name: 'Toddlers',  ageRange: '18m–3 years', capacity: 12, enrolled: 11, teacher: 'James Patel' },
    { id: 'preschool', name: 'Preschool', ageRange: '3–5 years',   capacity: 16, enrolled: 14, teacher: 'Sarah Thompson' },
    { id: 'afterschool', name: 'After School', ageRange: '5–12',   capacity: 10, enrolled: 0,  teacher: 'TBC' },
  ],

  /* ── Children ────────────────────────────────────────── */
  children: [
    {
      id: 'c1', name: 'Aarav Patel', dob: '2022-09-14', age: '3 years',
      room: 'Preschool', photo: null, parentName: 'Priya Patel',
      parentPhone: '+1 780 555 0210', parentEmail: 'priya.patel@email.com',
      emergencyContact: 'Raj Patel — +1 780 555 0211',
      allergies: 'Peanuts (anaphylaxis — EpiPen on file)', medicalNotes: 'EpiPen stored in office. Alert all staff.',
      keyTeacher: 'Sarah Thompson', careType: 'Full-time', startDate: '2024-09-01',
      attendanceStatus: 'present', monthlyFee: 1150,
    },
    {
      id: 'c2', name: 'Emily Brown', dob: '2023-02-20', age: '2 years',
      room: 'Toddlers', photo: null, parentName: 'Claire Brown',
      parentPhone: '+1 780 555 0312', parentEmail: 'claire.brown@email.com',
      emergencyContact: 'Tom Brown — +1 780 555 0313',
      allergies: 'None', medicalNotes: 'Mild eczema — use only approved creams.',
      keyTeacher: 'James Patel', careType: 'Full-time', startDate: '2024-11-04',
      attendanceStatus: 'present', monthlyFee: 1150,
    },
    {
      id: 'c3', name: 'Noah Wilson', dob: '2021-07-05', age: '4 years',
      room: 'Preschool', photo: null, parentName: 'Rachel Wilson',
      parentPhone: '+1 780 555 0401', parentEmail: 'rachel.wilson@email.com',
      emergencyContact: 'Mike Wilson — +1 780 555 0402',
      allergies: 'Dairy (mild intolerance)', medicalNotes: 'Dairy-free meals required. Label all food.',
      keyTeacher: 'Sarah Thompson', careType: 'Part-time', startDate: '2024-08-12',
      attendanceStatus: 'absent', monthlyFee: 820,
    },
    {
      id: 'c4', name: 'Mia Thompson', dob: '2023-11-30', age: '1 year',
      room: 'Infants', photo: null, parentName: 'Emma Thompson',
      parentPhone: '+1 780 555 0503', parentEmail: 'emma.thompson@email.com',
      emergencyContact: 'Dan Thompson — +1 780 555 0504',
      allergies: 'None', medicalNotes: 'Still on formula — see feeding plan in file.',
      keyTeacher: 'Emma Rodriguez', careType: 'Full-time', startDate: '2025-01-06',
      attendanceStatus: 'present', monthlyFee: 1150,
    },
    {
      id: 'c5', name: 'Sophia Khan', dob: '2022-04-18', age: '3 years',
      room: 'Preschool', photo: null, parentName: 'Yasmin Khan',
      parentPhone: '+1 780 555 0605', parentEmail: 'yasmin.khan@email.com',
      emergencyContact: 'Khalid Khan — +1 780 555 0606',
      allergies: 'Sesame (mild)', medicalNotes: 'Avoid sesame-based foods. No EpiPen needed.',
      keyTeacher: 'Sarah Thompson', careType: 'Full-time', startDate: '2024-10-07',
      attendanceStatus: 'present', monthlyFee: 1150,
    },
    {
      id: 'c6', name: 'Luca Rossi', dob: '2023-06-11', age: '2 years',
      room: 'Toddlers', photo: null, parentName: 'Marco Rossi',
      parentPhone: '+1 780 555 0712', parentEmail: 'marco.rossi@email.com',
      emergencyContact: 'Giulia Rossi — +1 780 555 0713',
      allergies: 'Eggs', medicalNotes: 'Egg-free diet. Check all baked goods.',
      keyTeacher: 'James Patel', careType: 'Full-time', startDate: '2025-02-03',
      attendanceStatus: 'present', monthlyFee: 1150,
    },
    {
      id: 'c7', name: 'Amara Osei', dob: '2022-12-22', age: '3 years',
      room: 'Preschool', photo: null, parentName: 'Nana Osei',
      parentPhone: '+1 780 555 0814', parentEmail: 'nana.osei@email.com',
      emergencyContact: 'Kwame Osei — +1 780 555 0815',
      allergies: 'None', medicalNotes: 'No medical concerns.',
      keyTeacher: 'Sarah Thompson', careType: 'Part-time', startDate: '2025-01-13',
      attendanceStatus: 'present', monthlyFee: 820,
    },
    {
      id: 'c8', name: 'Oliver Chen', dob: '2024-01-08', age: '1 year',
      room: 'Infants', photo: null, parentName: 'Wei Chen',
      parentPhone: '+1 780 555 0920', parentEmail: 'wei.chen@email.com',
      emergencyContact: 'Li Chen — +1 780 555 0921',
      allergies: 'None', medicalNotes: 'Fully breastfed. Parent brings milk daily.',
      keyTeacher: 'Emma Rodriguez', careType: 'Full-time', startDate: '2025-03-10',
      attendanceStatus: 'present', monthlyFee: 1150,
    },
  ],

  /* ── Staff ───────────────────────────────────────────── */
  staff: [
    {
      id: 's1', name: 'Sarah Thompson', role: 'Lead Teacher', room: 'Preschool',
      phone: '+1 780 555 1001', email: 'sarah.t@sunshinenursery.com',
      todayStatus: 'on-duty', childrenAssigned: 14, startTime: '7:30 AM',
      qualifications: 'ECE Level 3, First Aid Trained, DBS Checked',
      tasks: ['Complete daily reports by 4 PM', 'Lead circle time at 10 AM'],
    },
    {
      id: 's2', name: 'James Patel', role: 'Toddler Teacher', room: 'Toddlers',
      phone: '+1 780 555 1002', email: 'james.p@sunshinenursery.com',
      todayStatus: 'on-duty', childrenAssigned: 11, startTime: '8:00 AM',
      qualifications: 'ECE Level 2, First Aid Trained, DBS Checked',
      tasks: ['Sensory play session at 11 AM', 'Nap check at 1:30 PM'],
    },
    {
      id: 's3', name: 'Emma Rodriguez', role: 'Infant Teacher', room: 'Infants',
      phone: '+1 780 555 1003', email: 'emma.r@sunshinenursery.com',
      todayStatus: 'on-duty', childrenAssigned: 7, startTime: '7:30 AM',
      qualifications: 'ECE Level 3, Infant CPR, DBS Checked',
      tasks: ['Feeding log updates', 'Parent update messages by 2 PM'],
    },
    {
      id: 's4', name: 'Maria Santos', role: 'Nursery Assistant', room: 'Toddlers',
      phone: '+1 780 555 1004', email: 'maria.s@sunshinenursery.com',
      todayStatus: 'on-duty', childrenAssigned: 11, startTime: '9:00 AM',
      qualifications: 'ECE Level 1, First Aid Trained',
      tasks: ['Assist with outdoor play 10:30 AM', 'Clean rooms after lunch'],
    },
    {
      id: 's5', name: 'David Kim', role: 'Nursery Manager', room: 'All Rooms',
      phone: '+1 780 555 1005', email: 'david.k@sunshinenursery.com',
      todayStatus: 'on-duty', childrenAssigned: 0, startTime: '8:30 AM',
      qualifications: 'ECE Level 3, Management Diploma, DBS Checked',
      tasks: ['Staff meeting 3:00 PM', 'Review August enrollment report'],
    },
    {
      id: 's6', name: 'Preethi Nair', role: 'Cook', room: 'Kitchen',
      phone: '+1 780 555 1006', email: 'preethi.n@sunshinenursery.com',
      todayStatus: 'on-duty', childrenAssigned: 0, startTime: '7:00 AM',
      qualifications: 'Food Safety Level 2, Allergen Trained',
      tasks: ['Lunch by 12:00 PM', 'Allergy check for Sophia K and Oliver C'],
    },
  ],

  /* ── Attendance ──────────────────────────────────────── */
  attendance: [
    { childId: 'c1', childName: 'Aarav Patel',   room: 'Preschool', expectedTime: '8:00', checkedIn: '7:58', pickedUp: null, status: 'present', parent: 'Priya Patel' },
    { childId: 'c2', childName: 'Emily Brown',   room: 'Toddlers',  expectedTime: '8:30', checkedIn: '8:27', pickedUp: null, status: 'present', parent: 'Claire Brown' },
    { childId: 'c3', childName: 'Noah Wilson',   room: 'Preschool', expectedTime: '9:00', checkedIn: null,   pickedUp: null, status: 'absent',  parent: 'Rachel Wilson' },
    { childId: 'c4', childName: 'Mia Thompson',  room: 'Infants',   expectedTime: '8:00', checkedIn: '8:05', pickedUp: null, status: 'present', parent: 'Emma Thompson' },
    { childId: 'c5', childName: 'Sophia Khan',   room: 'Preschool', expectedTime: '8:00', checkedIn: '8:12', pickedUp: null, status: 'present', parent: 'Yasmin Khan' },
    { childId: 'c6', childName: 'Luca Rossi',    room: 'Toddlers',  expectedTime: '9:00', checkedIn: '9:02', pickedUp: null, status: 'present', parent: 'Marco Rossi' },
    { childId: 'c7', childName: 'Amara Osei',    room: 'Preschool', expectedTime: '9:30', checkedIn: '9:28', pickedUp: null, status: 'present', parent: 'Nana Osei' },
    { childId: 'c8', childName: 'Oliver Chen',   room: 'Infants',   expectedTime: '8:00', checkedIn: '8:10', pickedUp: null, status: 'present', parent: 'Wei Chen' },
  ],

  /* ── Daily Reports ───────────────────────────────────── */
  dailyReports: [
    {
      id: 'dr1', childId: 'c1', childName: 'Aarav Patel', date: '2026-07-01',
      teacher: 'Sarah Thompson', mood: 'happy', meals: { breakfast: 'all', lunch: 'most', snack: 'all' },
      nap: { time: '12:30 PM', duration: '1 hr 15 min' },
      activities: ['Outdoor play', 'Story time', 'Painting'],
      learningNotes: 'Aarav showed excellent focus during counting activities today.',
      teacherNote: 'Had a fantastic day — very engaged and social.',
      aiReport: 'Hi Priya! 😊 Aarav had a wonderful day at Sunshine Nursery. He joined in outdoor play, story time and painting, ate well at all meals, and had a restful 1 hr 15 min nap. His key worker noted he showed great focus during counting — he\'s really coming along! We\'ll see him tomorrow 💛',
      status: 'sent', sentAt: '4:02 PM',
    },
    {
      id: 'dr2', childId: 'c2', childName: 'Emily Brown', date: '2026-07-01',
      teacher: 'James Patel', mood: 'calm', meals: { breakfast: 'most', lunch: 'all', snack: 'some' },
      nap: { time: '1:00 PM', duration: '1 hr' },
      activities: ['Sensory play', 'Music', 'Water play'],
      learningNotes: 'Emily loved the water play tray today — developing excellent fine motor skills.',
      teacherNote: 'Calm and happy all day. Really enjoyed sensory play.',
      aiReport: 'Hi Claire! 👋 Emily had a lovely calm day today. She especially loved our water play and sensory activities — her fine motor skills are developing beautifully. She ate most of her breakfast and all of lunch, and napped for a full hour 🌙 See you tomorrow!',
      status: 'sent', sentAt: '4:05 PM',
    },
    {
      id: 'dr3', childId: 'c4', childName: 'Mia Thompson', date: '2026-07-01',
      teacher: 'Emma Rodriguez', mood: 'happy', meals: { breakfast: 'formula', lunch: 'puree', snack: 'formula' },
      nap: { time: '11:00 AM', duration: '2 hrs' },
      activities: ['Tummy time', 'Sensory exploration', 'Music & movement'],
      learningNotes: 'Mia is making great progress with head control during tummy time.',
      teacherNote: 'Wonderful day — lots of smiles and great engagement.',
      aiReport: null, status: 'draft', sentAt: null,
    },
  ],

  /* ── Activities ──────────────────────────────────────── */
  activities: [
    { id: 'a1', title: 'Color Sorting Game', category: 'Colors', ageGroup: '2–4 years', duration: '20 min', skills: ['Color recognition', 'Fine motor', 'Sorting'], materials: 'Colored objects, sorting trays', printable: true, room: 'Toddlers' },
    { id: 'a2', title: 'Alphabet Tracing Sheets', category: 'Alphabet', ageGroup: '3–5 years', duration: '15 min', skills: ['Letter recognition', 'Pencil grip', 'Pre-writing'], materials: 'Tracing sheets, chunky pencils', printable: true, room: 'Preschool' },
    { id: 'a3', title: 'Animal Matching Cards', category: 'Animals', ageGroup: '2–5 years', duration: '25 min', skills: ['Memory', 'Language', 'Concentration'], materials: 'Printed animal cards', printable: true, room: 'All' },
    { id: 'a4', title: 'Rainy Day Indoor Bundle', category: 'Rainy Day Activities', ageGroup: '2–5 years', duration: '60 min', skills: ['Creativity', 'Independence', 'Focus'], materials: 'Craft supplies, worksheets', printable: true, room: 'All' },
    { id: 'a5', title: 'Fine Motor Play Tray', category: 'Fine Motor Skills', ageGroup: '1–3 years', duration: '30 min', skills: ['Pincer grip', 'Hand-eye coordination', 'Focus'], materials: 'Rice/sand tray, tools, objects', printable: false, room: 'Toddlers' },
    { id: 'a6', title: 'Number Counting Mats', category: 'Numbers', ageGroup: '3–5 years', duration: '20 min', skills: ['Number recognition', 'Counting', 'Math basics'], materials: 'Printed mats, counters', printable: true, room: 'Preschool' },
    { id: 'a7', title: 'Story & Drawing Time', category: 'Story Time', ageGroup: '2–5 years', duration: '30 min', skills: ['Listening', 'Imagination', 'Expression'], materials: 'Story book, drawing paper, crayons', printable: false, room: 'All' },
    { id: 'a8', title: 'Sensory Bin Exploration', category: 'Sensory Play', ageGroup: '0–3 years', duration: '20 min', skills: ['Sensory development', 'Curiosity', 'Fine motor'], materials: 'Bins, fillers (rice/water/sand)', printable: false, room: 'Infants' },
    { id: 'a9', title: 'Festival Coloring Sheets', category: 'Crafts', ageGroup: '2–5 years', duration: '25 min', skills: ['Creativity', 'Cultural awareness', 'Fine motor'], materials: 'Printed sheets, crayons', printable: true, room: 'All' },
    { id: 'a10', title: 'Outdoor Nature Walk', category: 'Outdoor Play', ageGroup: '1–5 years', duration: '45 min', skills: ['Physical development', 'Nature awareness', 'Language'], materials: 'Outdoor area, nature bags', printable: false, room: 'All' },
    { id: 'a11', title: 'Shapes & Colors Puzzle', category: 'Shapes', ageGroup: '2–4 years', duration: '20 min', skills: ['Shape recognition', 'Problem solving', 'Fine motor'], materials: 'Shape puzzles or printed sheets', printable: true, room: 'Toddlers' },
    { id: 'a12', title: 'Hindi Alphabet Flashcards', category: 'Hindi/Punjabi Learning', ageGroup: '3–5 years', duration: '15 min', skills: ['Cultural heritage', 'Language', 'Memory'], materials: 'Printed flashcards', printable: true, room: 'Preschool' },
  ],

  /* ── Parent Messages (Conversations) ─────────────────── */
  parentMessages: [
    {
      id: 'pm1', parentName: 'Sarah Mitchell', channel: 'WhatsApp', service: 'Tour Booking',
      status: 'completed', statusColor: 'green', time: '2 min ago', unread: false,
      preview: 'Tour confirmed for Thursday 10 AM ✓',
      messages: [
        { role: 'parent', text: "Hi! I'd like to book a nursery tour please.", time: '09:01' },
        { role: 'ai', text: "Hi Sarah! 👋 We'd love to show you around. We have tours Tuesday–Thursday. Which day works best?", time: '09:01', agent: 'Ava' },
        { role: 'parent', text: "Thursday morning please!", time: '09:02' },
        { role: 'ai', text: "Perfect! Thursday at 10:00 AM is booked for you 📅 We'll send a WhatsApp reminder the day before. See you then!", time: '09:02', agent: 'Ava' },
        { role: 'system', text: '✓ Tour booked · ✓ Calendar updated · ✓ CRM lead created · ✓ Reminder scheduled', time: '09:02' },
      ],
    },
    {
      id: 'pm2', parentName: 'Priya Patel', channel: 'Website Chat', service: 'Daily Report Reply',
      status: 'active', statusColor: 'blue', time: '8 min ago', unread: true,
      preview: "Thank you! Aarav loved the painting 😊",
      messages: [
        { role: 'ai', text: "Hi Priya! 😊 Aarav had a wonderful day today. He joined in outdoor play, story time and painting, ate well at all meals, and had a restful nap. We'll see him tomorrow 💛", time: '16:02', agent: 'Ava' },
        { role: 'parent', text: "Thank you so much! He came home talking about the painting. He's so happy there!", time: '16:18' },
        { role: 'parent', text: "Quick question — will there be a parent event this month?", time: '16:19' },
        { role: 'ai', text: "That's so lovely to hear! 🎨 Yes — we have a Parent Showcase on Friday 18th July at 5 PM. You'll get an invite by email shortly!", time: '16:20', agent: 'Ava' },
      ],
    },
    {
      id: 'pm3', parentName: 'James Cooper', channel: 'WhatsApp', service: 'Waitlist Enquiry',
      status: 'pending', statusColor: 'amber', time: '15 min ago', unread: true,
      preview: "Any update on January availability?",
      messages: [
        { role: 'parent', text: "Hi, any update on January availability for 2 year olds?", time: '10:35' },
        { role: 'ai', text: "Hi James! 👋 We're still at capacity for January for toddlers, but you're on our priority waitlist. We'll contact you the moment a space opens — usually 4–8 weeks notice. 😊", time: '10:35', agent: 'Ava' },
        { role: 'parent', text: "Okay thank you. We're still very interested.", time: '10:42' },
      ],
    },
    {
      id: 'pm4', parentName: 'Rachel Nguyen', channel: 'Email', service: 'Fee Enquiry',
      status: 'completed', statusColor: 'green', time: '1 hr ago', unread: false,
      preview: 'Fee brochure sent. Follow-up at 48hr.',
      messages: [
        { role: 'parent', text: "Hi, could you send me the full fee breakdown and what's included?", time: '09:15' },
        { role: 'ai', text: "Of course! Our full-time place is $1,150/month and includes all meals, nappies, wipes, activities and daily parent updates. I've just emailed you our full fee guide and brochure 📋", time: '09:15', agent: 'Maya' },
        { role: 'system', text: '✓ Fee brochure emailed · ✓ 48hr follow-up scheduled · ✓ Lead tagged high-intent', time: '09:15' },
      ],
    },
    {
      id: 'pm5', parentName: 'Emma Thompson', channel: 'WhatsApp', service: 'Callback Request',
      status: 'pending', statusColor: 'amber', time: '12 min ago', unread: true,
      preview: "Can someone call me at 2pm today?",
      messages: [
        { role: 'parent', text: "Hi! Can someone call me at 2pm today? I have questions about part-time care for Mia.", time: '09:22' },
        { role: 'ai', text: "Of course, Emma! ✅ I've booked a 2:00 PM callback for you. Our admissions manager will call your WhatsApp number. You'll get a reminder at 1:45 PM 📞", time: '09:22', agent: 'Ava' },
        { role: 'system', text: '✓ Staff task created · ✓ Reminder set · ✓ CRM updated', time: '09:22' },
      ],
    },
  ],

  /* ── Tours ───────────────────────────────────────────── */
  tours: [
    { id: 't1', parent: 'Sarah Mitchell', childAge: '3 years', careType: 'Full-time', date: '2026-07-03', time: '10:00 AM', status: 'confirmed', reminderSent: true, assignedStaff: 'David Kim', source: 'Website AI Chat', phone: '+1 780 555 0198', email: 'sarah.m@email.com', notes: 'Very interested. 3 yo daughter starting Sept.' },
    { id: 't2', parent: 'James Cooper',   childAge: '2 years', careType: 'Full-time', date: '2026-07-02', time: '2:00 PM',  status: 'confirmed', reminderSent: true, assignedStaff: 'David Kim', source: 'WhatsApp', phone: '+1 780 555 0241', email: 'james.c@email.com', notes: 'Has been on waitlist. Tour requested after space opened.' },
    { id: 't3', parent: 'Priya Sharma',   childAge: '1 year',  careType: 'Full-time', date: '2026-07-04', time: '10:00 AM', status: 'pending',   reminderSent: false, assignedStaff: 'David Kim', source: 'Google Search', phone: '+1 780 555 0292', email: 'priya.s@email.com', notes: 'First child. Interested in infant room.' },
    { id: 't4', parent: 'Michael Chen',   childAge: '4 years', careType: 'Part-time', date: '2026-06-28', time: '10:00 AM', status: 'attended',  reminderSent: true, assignedStaff: 'Sarah Thompson', source: 'Referral', phone: '+1 780 555 0383', email: 'michael.c@email.com', notes: 'Loved the preschool room. Deciding between us and one other.' },
    { id: 't5', parent: 'Lisa Wang',      childAge: '2 years', careType: 'Full-time', date: '2026-06-25', time: '2:00 PM',  status: 'no-show',  reminderSent: true, assignedStaff: 'David Kim', source: 'Facebook', phone: '+1 780 555 0441', email: 'lisa.w@email.com', notes: 'Reminder sent. No response. Follow-up needed.' },
  ],

  /* ── AI Employees ────────────────────────────────────── */
  aiEmployees: [
    {
      id: 'ava', name: 'Ava', role: 'Admissions AI Employee', status: 'online',
      gradient: ['#7C3AED', '#4F46E5'], initial: 'A',
      channels: ['Website Chat', 'WhatsApp', 'Voice'],
      tasksToday: 14, totalTasks: 412, accuracy: 97, responseTime: '8s',
      services: ['Answer FAQs', 'Book Tours', 'Qualify Leads', 'Send WhatsApp', 'Create CRM Lead', 'Schedule Follow-ups'],
      greeting: "Hi! 👋 I'm Ava, Sunshine Nursery's AI. I can help with tours, availability, fees and more. What would you like help with?",
      tone: 'Warm', escalationRule: 'Escalate if parent is upset or question unanswerable after 2 attempts.',
    },
    {
      id: 'maya', name: 'Maya', role: 'Parent Support AI Employee', status: 'online',
      gradient: ['#2563EB', '#0EA5E9'], initial: 'M',
      channels: ['Website Chat', 'Email'],
      tasksToday: 8, totalTasks: 134, accuracy: 99, responseTime: '5s',
      services: ['Answer FAQs', 'Send Email', 'Parent Updates', 'Fee Brochure', 'Holiday Info'],
      greeting: "Hello! I'm Maya. I'm here to answer any questions about Sunshine Nursery. How can I help?",
      tone: 'Professional', escalationRule: 'Escalate immediately if safeguarding or emergency mentioned.',
    },
    {
      id: 'nova', name: 'Nova', role: 'Review AI Employee', status: 'online',
      gradient: ['#059669', '#10B981'], initial: 'N',
      channels: ['WhatsApp', 'Email'],
      tasksToday: 2, totalTasks: 54, accuracy: 100, responseTime: '12s',
      services: ['Review Requests', 'Sentiment Detection', 'Google Review Link', 'Private Alerts'],
      greeting: "Hi there! 😊 Thank you for visiting Sunshine Nursery. How was your experience with us?",
      tone: 'Friendly', escalationRule: 'If negative feedback: create private staff task immediately.',
    },
    {
      id: 'luna', name: 'Luna', role: 'Daily Report Assistant', status: 'online',
      gradient: ['#DB2777', '#F59E0B'], initial: 'L',
      channels: ['Internal'],
      tasksToday: 6, totalTasks: 89, accuracy: 98, responseTime: '3s',
      services: ['Improve Daily Reports', 'Generate Parent Messages', 'Send Report Updates'],
      greeting: "Hi! I'm Luna. I help teachers write and send beautiful daily reports to parents.",
      tone: 'Warm', escalationRule: 'Alert manager if no report submitted for enrolled child by 3 PM.',
    },
  ],

  /* ── Automations ─────────────────────────────────────── */
  automations: [
    { id: 'au1', name: 'New Parent Enquiry',    trigger: 'Parent sends first message',       aiAction: 'Reply instantly, qualify lead',      bizAction: 'Create CRM lead, schedule follow-up', followUp: 'WhatsApp confirmation sent', status: true, color: 'purple', runsToday: 8, total: 412 },
    { id: 'au2', name: 'Tour Booking',          trigger: 'Parent selects tour time',          aiAction: 'Confirm booking details',            bizAction: 'Update calendar, notify staff',       followUp: 'WhatsApp confirmation in 60s', status: true, color: 'blue', runsToday: 3, total: 89 },
    { id: 'au3', name: 'Tour Reminder',         trigger: '24 hrs before tour',               aiAction: 'Send personalised reminder',         bizAction: 'Log reminder in CRM',                 followUp: 'Mark reminder sent', status: true, color: 'blue', runsToday: 2, total: 76 },
    { id: 'au4', name: 'Daily Report Send',     trigger: 'Teacher saves daily report',        aiAction: 'Improve wording, personalise',       bizAction: 'Send to parent via WhatsApp/email',   followUp: 'Mark sent in system', status: true, color: 'green', runsToday: 6, total: 143 },
    { id: 'au5', name: 'Attendance Reminder',   trigger: 'Child not checked in by 9:30 AM',  aiAction: 'Send polite reminder to parent',     bizAction: 'Log in attendance system',            followUp: 'Alert staff if no response', status: true, color: 'amber', runsToday: 1, total: 34 },
    { id: 'au6', name: 'Review Request',        trigger: 'Happy parent detected',             aiAction: 'Send Google review link',            bizAction: 'Track review in CRM',                 followUp: 'Log request sent', status: true, color: 'amber', runsToday: 2, total: 54 },
    { id: 'au7', name: 'Negative Feedback',     trigger: 'Negative sentiment detected',       aiAction: 'Acknowledge privately, de-escalate', bizAction: 'Create private staff task',           followUp: 'Manager alert within 5 min', status: true, color: 'red', runsToday: 0, total: 7 },
    { id: 'au8', name: 'Waitlist Monthly Update', trigger: 'Monthly schedule trigger',       aiAction: 'Send availability update',           bizAction: 'Update waitlist status',              followUp: 'Log in CRM', status: true, color: 'orange', runsToday: 0, total: 18 },
    { id: 'au9', name: 'Fee Enquiry',           trigger: 'Parent asks about fees',            aiAction: 'Share fee info, send brochure',      bizAction: 'Email brochure, schedule follow-up',  followUp: '48hr follow-up call task', status: false, color: 'teal', runsToday: 0, total: 67 },
  ],

  /* ── Reviews ─────────────────────────────────────────── */
  reviews: {
    rating: 4.8, total: 47,
    requestsSent: 54, conversionRate: 87,
    sentiment: { positive: 43, neutral: 3, negative: 1 },
    recent: [
      { id: 'rv1', author: 'Rachel Nguyen', rating: 5, platform: 'Google', text: "Sunshine Nursery is absolutely wonderful. The staff are so warm and attentive — our daughter thrived from day one!", time: '2 days ago', replied: false, sentiment: 'positive' },
      { id: 'rv2', author: 'Michael Chen',  rating: 5, platform: 'Google', text: "We've been here 6 months and couldn't be happier. The daily reports are brilliant and the meals are fresh and healthy.", time: '5 days ago', replied: true, sentiment: 'positive' },
      { id: 'rv3', author: 'Aisha Patel',   rating: 4, platform: 'Google', text: "Really lovely nursery. Drop-off was bumpy at first but the key worker was so patient. Would definitely recommend.", time: '1 week ago', replied: false, sentiment: 'positive' },
      { id: 'rv4', author: 'Anonymous',     rating: 3, platform: 'Private', text: "Had a communication issue regarding holiday dates. Resolved once I escalated but wish info had been clearer.", time: '2 weeks ago', replied: true, sentiment: 'neutral', privateNote: 'Manager spoke with parent — issue resolved. Holiday info updated on website and WhatsApp.' },
    ],
  },

  /* ── Calendar Events ─────────────────────────────────── */
  calendarEvents: [
    { id: 'ev1', title: 'Tour — Sarah Mitchell',    type: 'tour',     date: '2026-07-03', time: '10:00', color: 'purple' },
    { id: 'ev2', title: 'Tour — James Cooper',      type: 'tour',     date: '2026-07-02', time: '14:00', color: 'purple' },
    { id: 'ev3', title: 'Tour — Priya Sharma',      type: 'tour',     date: '2026-07-04', time: '10:00', color: 'purple' },
    { id: 'ev4', title: 'Staff Meeting',             type: 'staff',    date: '2026-07-01', time: '15:00', color: 'blue'   },
    { id: 'ev5', title: 'Parent Showcase Evening',  type: 'event',    date: '2026-07-18', time: '17:00', color: 'green'  },
    { id: 'ev6', title: 'Summer Activity Week',      type: 'activity', date: '2026-07-07', time: null,    color: 'amber'  },
    { id: 'ev7', title: 'Monthly Billing Run',       type: 'billing',  date: '2026-07-01', time: '09:00', color: 'teal'   },
    { id: 'ev8', title: 'Priya Sharma — Fee Review', type: 'meeting',  date: '2026-07-08', time: '11:00', color: 'indigo' },
    { id: 'ev9', title: 'ECE Training Day (Closed)', type: 'closure',  date: '2026-07-25', time: null,    color: 'red'    },
  ],

  /* ── Billing ─────────────────────────────────────────── */
  billing: {
    monthlyRevenue: 36800,
    pending: 3450,
    paid: 33350,
    overdue: 1150,
    invoices: [
      { id: 'inv1', parent: 'Priya Patel',   child: 'Aarav Patel',   amount: 1150, status: 'paid',    dueDate: '2026-07-01', paidDate: '2026-06-28' },
      { id: 'inv2', parent: 'Claire Brown',  child: 'Emily Brown',   amount: 1150, status: 'paid',    dueDate: '2026-07-01', paidDate: '2026-06-30' },
      { id: 'inv3', parent: 'Rachel Wilson', child: 'Noah Wilson',   amount: 820,  status: 'overdue', dueDate: '2026-07-01', paidDate: null },
      { id: 'inv4', parent: 'Emma Thompson', child: 'Mia Thompson',  amount: 1150, status: 'pending', dueDate: '2026-07-05', paidDate: null },
      { id: 'inv5', parent: 'Yasmin Khan',   child: 'Sophia Khan',   amount: 1150, status: 'paid',    dueDate: '2026-07-01', paidDate: '2026-07-01' },
      { id: 'inv6', parent: 'Marco Rossi',   child: 'Luca Rossi',    amount: 1150, status: 'paid',    dueDate: '2026-07-01', paidDate: '2026-06-29' },
      { id: 'inv7', parent: 'Nana Osei',     child: 'Amara Osei',    amount: 820,  status: 'pending', dueDate: '2026-07-05', paidDate: null },
      { id: 'inv8', parent: 'Wei Chen',      child: 'Oliver Chen',   amount: 1150, status: 'paid',    dueDate: '2026-07-01', paidDate: '2026-07-01' },
    ],
  },

  /* ── Admissions Pipeline ─────────────────────────────── */
  admissions: [
    { id: 'adm1', parentName: 'Sarah Mitchell', childAge: '3 years', careType: 'Full-time', service: 'Book a Tour', status: 'Tour Booked', statusColor: 'purple', source: 'Website AI', nextAction: 'Tour Thu 10 AM', assignedTo: 'Ava (AI)', lastActivity: '2 min ago', phone: '+1 780 555 0198', email: 'sarah.m@email.com', notes: 'Very interested. Touring Thu 10 AM.', aiActions: ['Enquiry captured', 'Lead qualified', 'Tour booked', 'WhatsApp sent', 'CRM created', 'Reminder scheduled'] },
    { id: 'adm2', parentName: 'James Cooper',   childAge: '2 years', careType: 'Full-time', service: 'Waitlist',    status: 'Waitlisted',  statusColor: 'orange', source: 'Website AI', nextAction: 'Monthly update', assignedTo: 'Ava (AI)', lastActivity: '15 min ago', phone: '+1 780 555 0241', email: 'james.c@email.com', notes: 'January intake. Priority waitlist.', aiActions: ['Enquiry captured', 'Waitlisted', 'CRM created', 'Monthly follow-up set'] },
    { id: 'adm3', parentName: 'Emma Thompson',  childAge: '4 months', careType: 'Full-time', service: 'Callback',   status: 'Callback 2pm',statusColor: 'blue',   source: 'WhatsApp',   nextAction: 'Call at 2:00 PM', assignedTo: 'Manager', lastActivity: '12 min ago', phone: '+1 780 555 0503', email: 'emma.t@email.com', notes: 'Infant room inquiry. Part-time discussed.', aiActions: ['Callback requested', 'Time confirmed', 'Staff task created', 'WhatsApp reminder set'] },
    { id: 'adm4', parentName: 'Priya Sharma',   childAge: '1 year',  careType: 'Full-time', service: 'Availability', status: 'High-Intent', statusColor: 'green', source: 'Google',     nextAction: 'Tour Fri 10 AM', assignedTo: 'Ava (AI)', lastActivity: '18 min ago', phone: '+1 780 555 0292', email: 'priya.s@email.com', notes: '2 spaces confirmed. Tour reserved.', aiActions: ['Availability checked', '2 places found', 'Tagged high-intent', 'Tour reserved'] },
    { id: 'adm5', parentName: 'Rachel Nguyen',  childAge: '3 years', careType: 'Full-time', service: 'Fee Enquiry', status: 'Brochure Sent',statusColor: 'teal',  source: 'Email',      nextAction: '48hr follow-up', assignedTo: 'Maya (AI)', lastActivity: '1 hr ago', phone: '+1 780 555 0341', email: 'rachel.n@email.com', notes: 'Fee brochure sent. Follow-up at 48hr.', aiActions: ['Fee enquiry received', 'Brochure emailed', '48hr follow-up scheduled'] },
  ],

  /* ── AI Activity Feed ────────────────────────────────── */
  aiActivity: [
    { icon: 'tour',     color: 'purple', msg: 'Ava booked a tour for <strong>Sarah Mitchell</strong> — Thursday 10:00 AM', time: '2 min ago' },
    { icon: 'message',  color: 'blue',   msg: 'Ava replied to <strong>Priya Patel</strong> — daily report thank you', time: '8 min ago' },
    { icon: 'report',   color: 'green',  msg: 'Luna sent daily reports to <strong>18 parents</strong>', time: '16 min ago' },
    { icon: 'whatsapp', color: 'green',  msg: 'Ava sent WhatsApp confirmation to <strong>James Cooper</strong>', time: '22 min ago' },
    { icon: 'star',     color: 'amber',  msg: 'Nova scheduled review request for <strong>Rachel Nguyen</strong>', time: '30 min ago' },
    { icon: 'email',    color: 'blue',   msg: 'Maya sent fee brochure to <strong>Rachel Nguyen</strong>', time: '45 min ago' },
    { icon: 'waitlist', color: 'orange', msg: 'Ava sent waitlist update to <strong>James Cooper</strong>', time: '1 hr ago' },
    { icon: 'attend',   color: 'teal',   msg: 'Attendance reminder sent — <strong>Noah Wilson</strong> not yet checked in', time: '1 hr ago' },
  ],

  /* ── Knowledge Base ──────────────────────────────────── */
  knowledgeBase: {
    openingHours: 'Monday to Friday, 7:30 AM to 6:30 PM. Closed on bank holidays and two weeks over Christmas.',
    ageGroups: 'We support children from birth to 5 years old across our Infant, Toddler and Preschool rooms.',
    fees: { fullTime: '$1,150/month', partTime3: '$820/month', partTime2: '$650/month', sibling: '10% sibling discount', funding: '15hr and 30hr Government Childcare Funding accepted.' },
    meals: 'Fresh breakfast, lunch and afternoon snack prepared daily on-site. All allergies catered for. Nappies, wipes and sun cream included in fees.',
    safety: 'All staff DBS checked and first-aid trained. Secure keypad entry — registered adults only. Daily supervision logs kept.',
    curriculum: 'Play-based early learning: language, motor skills, social-emotional growth, outdoor play, music, storytelling and creative arts.',
    tours: 'Tours run Tuesday, Wednesday and Thursday at 10:00 AM or 2:00 PM.',
    waitlist: 'Families on waitlist receive monthly availability updates automatically.',
    dailyRoutine: '7:30 Arrival · 8:00 Breakfast · 9:00 Morning activities · 10:30 Outdoor play · 11:30 Lunch · 12:30 Nap · 2:30 Afternoon activities · 4:00 Snack · 5:00 Free play · 6:30 Close',
    sickChildPolicy: 'Children with fever above 38°C, vomiting or contagious illness must stay home until 48 hours symptom-free. Call by 8:30 AM.',
    paymentPolicy: 'Fees due first of each month. 7-day grace period. Overdue fees incur 5% late charge. Payment by bank transfer or childcare vouchers.',
    allergyPolicy: 'All allergies recorded on child files. Kitchen team briefed daily. EpiPens stored in office. No nut products on premises.',
    faqs: [
      { q: 'Do you provide nappies?', a: 'Yes — nappies, wipes and nappy cream are all included in the monthly fee.' },
      { q: 'What is the staff-to-child ratio?', a: '1:3 for under-2s and 1:8 for 3–5 year olds, exceeding all regulatory requirements.' },
      { q: 'Do you offer a sibling discount?', a: 'Yes — 10% off for second enrolled children at the same time.' },
      { q: 'Are you registered with EECD?', a: 'Yes — we are fully registered and licensed. Our latest inspection report is available on request.' },
      { q: 'Can I view the menu?', a: 'Yes — we share our seasonal menus on our parent app and at the front desk each week.' },
    ],
  },
};

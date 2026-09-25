import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Home, BookOpen, Clock, AlertTriangle, HeartHandshake, 
  Target, DollarSign, Cpu, Briefcase, HelpCircle, 
  Search, ShieldAlert, ChevronRight, CheckCircle2, ArrowRight, 
  X, MessageSquare, Plus, Trash2, Send, ExternalLink, Sparkles,
  RefreshCw, Award, Check, MoreVertical, Info, Mail, ShieldCheck, Phone, Users, UserCheck,
  MapPin, Compass, AlertOctagon, Siren, Flame, Radio, UserPlus, MessageCircle, Contact, Download,
  Vote, BarChart3, Zap, Bot, Bell, BellOff, Volume2, VolumeX
} from 'lucide-react';
import { Preferences } from '@capacitor/preferences';
import { Geolocation } from '@capacitor/geolocation';
import { Contacts } from '@capacitor-community/contacts';

// ==========================================
// DAILY DILEMMA POLLING DATA (SOUTH AFRICAN CONTEXT)
// ==========================================

const DAILY_DILEMMAS = [
  {
    id: 'dilemma-01',
    dateLabel: "Today's Dilemma",
    category: "Peer Pressure & Loyalty",
    scenario: "Your close friend got caught with exam cheat sheets right before the matric trial. The teacher pulls you aside and asks point-blank if you knew. If you lie, you risk getting disciplined too. If you speak, your friend gets suspended.",
    question: "What is your immediate move?",
    options: [
      { id: 'opt1', text: "Protect my friend at all costs — no snitching.", basePct: 38 },
      { id: 'opt2', text: "Tell the truth privately so I don't go down with them.", basePct: 41 },
      { id: 'opt3', text: "Refuse to speak and tell my friend to own up themselves.", basePct: 21 }
    ],
    breakdownNote: "Over 62% of KZN youth chose options that protect their own matric qualification while pushing their friend toward personal responsibility."
  },
  {
    id: 'dilemma-02',
    dateLabel: "Yesterday's Flashback",
    category: "Street Ethics & Money",
    scenario: "You find an envelope with R800 cash on an empty seat in a local minibus taxi. Nobody is looking, and you have zero transport fare for next week.",
    question: "What do you do with the money?",
    options: [
      { id: 'opt1', text: "Hand it over to the taxi driver / rank marshal.", basePct: 47 },
      { id: 'opt2', text: "Take it. Finder's keepers, especially when broke.", basePct: 29 },
      { id: 'opt3', text: "Wait 5 minutes to see if someone runs back searching for it.", basePct: 24 }
    ],
    breakdownNote: "Integrity under pressure separates short-term thrills from long-term self-respect."
  }
];

// ==========================================
// EMERGENCY & CRISIS SOS DIRECTORY (SOUTH AFRICA)
// ==========================================

const EMERGENCY_SERVICES_DATA = [
  {
    id: 'sos-112',
    name: 'National Emergency (Cellular)',
    category: 'sos',
    tag: 'All Emergencies',
    phone: '112',
    tollFree: true,
    desc: 'Dial from any mobile network in SA to route to closest police, medical, or fire rescue.',
    badgeColor: '#ef4444'
  },
  {
    id: 'police-10111',
    name: 'SAPS Police Flying Squad',
    category: 'police',
    tag: 'Crime & Imminent Danger',
    phone: '10111',
    tollFree: true,
    desc: 'Nationwide rapid police dispatch for crimes in progress, home invasion, or robbery.',
    badgeColor: '#3b82f6'
  },
  {
    id: 'ambulance-10177',
    name: 'National Ambulance & Fire',
    category: 'medical',
    tag: 'Medical Emergency',
    phone: '10177',
    tollFree: true,
    desc: 'Government emergency medical response, ambulance dispatch, and fire rescue services.',
    badgeColor: '#f97316'
  },
  {
    id: 'childline-116',
    name: 'Childline South Africa',
    category: 'child',
    tag: 'Child & Minor Abuse',
    phone: '116',
    altPhone: '0800055555',
    tollFree: true,
    desc: '24/7 dedicated confidential counselling for children, abuse reporting, bullying, and neglect.',
    badgeColor: '#10b981'
  },
  {
    id: 'sadag-suicide',
    name: 'SADAG 24hr Suicide Crisis Line',
    category: 'mental',
    tag: 'Depression & Self-Harm',
    phone: '0800567567',
    altPhone: '0800456789',
    tollFree: true,
    desc: 'Immediate round-the-clock telephone intervention for suicidal thoughts and acute distress.',
    badgeColor: '#a855f7'
  },
  {
    id: 'gbv-command',
    name: 'Gender-Based Violence Command Centre',
    category: 'gbv',
    tag: 'Domestic & Sexual Violence',
    phone: '0800428428',
    ussd: '*120*7867#',
    tollFree: true,
    desc: 'Support for survivors of gender-based violence, shelter referrals, and social worker assistance.',
    badgeColor: '#ec4899'
  },
  {
    id: 'lifeline-sa',
    name: 'Lifeline South Africa',
    category: 'mental',
    tag: 'Emotional Crisis',
    phone: '0861322322',
    tollFree: false,
    desc: 'Confidential listening and emotional counselling for grief, anxiety, and family conflicts.',
    badgeColor: '#38bdf8'
  }
];

// ==========================================
// SEED ARTICLES & SCENARIOS
// ==========================================

const ARTICLES_DATA = [
  {
    id: 1,
    title: "Why Digital Skills Beat Experience in Your First Job",
    category: "Technology",
    readTime: "4 min read",
    ageBands: ['13-15', '16-17', '18-25'],
    image: "💻",
    description: "How learning basic code, cloud tools, and AI prompts can land your first remote or entry-level role in KZN.",
    meaningPoints: [
      "Companies care more about problem-solving than paper credentials.",
      "Free certifications (like AWS, Python, Google) prove initiative.",
      "Learning one digital skill for 30 minutes daily adds up fast."
    ],
    challenge: "Complete one interactive quiz in the Tech & AI corner today."
  },
  {
    id: 2,
    title: "The Truth About Side Hustles & Quick Money Online",
    category: "Money",
    readTime: "5 min read",
    ageBands: ['16-17', '18-25'],
    image: "💸",
    description: "Don't fall for fake forex gurus and crypto schemes. Here is what real freelance work looks like.",
    meaningPoints: [
      "Legitimate opportunities never ask you to pay an 'onboarding fee'.",
      "Real skills (data entry, coding, tutoring, trades) pay predictably.",
      "Building a reputation takes months, not 24 hours."
    ],
    challenge: "Try the Money Zone simulator and allocate at least 15% to savings."
  },
  {
    id: 3,
    title: "How to Build Unshakable Focus When the World is Loud",
    category: "Life",
    readTime: "3 min read",
    ageBands: ['9-12', '13-15', '16-17', '18-25'],
    image: "🧠",
    description: "Constant notifications rewire our attention span. Here is how to regain control of your day.",
    meaningPoints: [
      "Multitasking is a myth; switching tasks burns mental fuel.",
      "Turning off notifications for 90 minutes helps finish schoolwork.",
      "Future Me thrives on deep focus, not quick dopamine."
    ],
    challenge: "Put your phone on silent for 30 minutes during study time."
  },
  {
    id: 4,
    title: "How to Choose Your Subjects for Grade 10 to 12 in KZN Schools",
    category: "Education",
    readTime: "3 min read",
    ageBands: ['13-15'],
    image: "📚",
    description: "Aligning your mathematics and science choices early so UKZN, DUT, and TVET doors stay open.",
    meaningPoints: [
      "Pure Maths opens engineering, commerce, software, and health science paths.",
      "Maths Literacy is practical for humanities, law, and creative fields.",
      "Speak to teachers and counselors before finalizing subject choices."
    ],
    challenge: "Review three career entry requirements in the Opportunities section."
  },
  {
    id: 5,
    title: "Fun Ways to Learn Problem Solving & Coding Early",
    category: "Kids Tech",
    readTime: "2 min read",
    ageBands: ['9-12'],
    image: "🤖",
    description: "Using games, logic puzzles, and block coding to build your brain power.",
    meaningPoints: [
      "Coding is like giving instructions to a friendly robot.",
      "Making mistakes is how programmers discover cool solutions.",
      "Creativity and logic go hand in hand."
    ],
    challenge: "Ask a parent or teacher to show you Scratch or Blockly online."
  }
];

const THINK_TWICE_SCENARIOS = [
  {
    id: 1,
    title: "Skipping school with friends",
    situation: "Your friends are daring you to skip classes to hang out at the mall or park.",
    why: "Fear of missing out (FOMO) and wanting to feel accepted by the crew.",
    now: "Temporary thrill and laughs.",
    later: "Falling behind on test prep, missed marks, calls home to parents.",
    future: "Lower matric results, jeopardizing university entry and bursaries.",
    alternatives: "Suggest hanging out after school hours or on the weekend.",
    support: "Talk to an older sibling, mentor, or school counsellor."
  },
  {
    id: 2,
    title: "Sharing private photos online",
    situation: "Someone you like online asks you to send private, sensitive photos.",
    why: "Wanting to prove trust or fear they will stop talking to you.",
    now: "Temporary approval or easing peer pressure.",
    later: "Loss of control over the file. It can be forwarded, saved, or leaked.",
    future: "Permanent digital footprint impacting future opportunities.",
    alternatives: "Say firmly: 'I keep personal things in real life. I don't send private photos.'",
    support: "If threatened, contact Childline SA immediately at 116 or 0800 055 555."
  },
  {
    id: 3,
    title: "Giving someone your banking PIN or Capitec App",
    situation: "A friend asks to borrow your card PIN or bank login to receive money.",
    why: "Desire to help out or avoid an awkward argument.",
    now: "Feels like being loyal.",
    later: "Your account can be flagged for money laundering or frozen.",
    future: "Credit blacklist, legal complications, unable to open accounts.",
    alternatives: "Offer to make an official transfer yourself instead.",
    support: "Call your bank's fraud helpline immediately."
  },
  {
    id: 4,
    title: "Taking an unverified online job offer asking for money",
    situation: "An online advert offers R800 a day for typing, but asks for an R200 'registration deposit'.",
    why: "Need for quick cash for yourself or to assist at home.",
    now: "Hope and excitement of starting immediate work.",
    later: "The person disappears with your deposit and blocks your contact.",
    future: "Lost savings and hesitation toward real online career opportunities.",
    alternatives: "Look for verified learnerships and no-fee portals like YES4Youth and Harambee.",
    support: "Check legitimate opportunities with mentors at Indaba Men's Corner."
  }
];

const THEN_NOW_NEXT_DATA = [
  {
    id: 'communication',
    title: 'Communication & Boundaries',
    then: 'Conversations were deliberate. You met face-to-face or spoke from a coin telephone. When you were home, nobody could disturb you.',
    now: 'Hyper-connectivity. Constant WhatsApp blue ticks, instant replies expected 24/7, and fear of being left out of group chats.',
    next: 'Intentional digital presence. Setting boundaries on notification times, communicating respectfully, and keeping private life private.'
  },
  {
    id: 'money',
    title: 'Money & Wealth Building',
    then: 'Cash in envelopes, lay-bys, and long queues at the bank branch on Saturday mornings.',
    now: 'Tap-to-pay, banking apps, instant loans, and crypto/forex scams tempting young people with get-rich-quick promises.',
    next: 'Automated fractional investing, tax-free savings accounts, digital budgeting, and avoiding high-interest debt traps.'
  },
  {
    id: 'work',
    title: 'Work & Digital Careers',
    then: 'Working 30 years at one company with a single fixed skill set.',
    now: 'High youth unemployment, gig work, and rapid AI changes across businesses.',
    next: 'Continuous learning, digital literacy, problem solving, and building hands-on portfolio projects.'
  }
];

const OPPORTUNITIES_DATA = [
  {
    id: 1,
    title: "KZN Provincial Government Bursary Programme",
    org: "KZN Office of the Premier",
    category: "Bursary",
    age: "18-25",
    location: "KwaZulu-Natal (All Districts)",
    stipend: "Tuition + Accommodation + Meals",
    desc: "Targeted funding for youth pursuing STEM, Healthcare, Agriculture, and Maritime Studies at public universities."
  },
  {
    id: 2,
    title: "Youth Employment Service (YES4Youth) 2026",
    org: "YES South Africa",
    category: "Learnership",
    age: "18-25",
    location: "National / KZN Hubs",
    stipend: "R4,500/month",
    desc: "12-month quality workplace experience with leading South African employers for unemployed youth."
  },
  {
    id: 3,
    title: "NSFAS Bursary Scheme",
    org: "DHET South Africa",
    category: "Bursary",
    age: "16-25",
    location: "National (SA)",
    stipend: "Full Tuition + Living Allowance",
    desc: "Comprehensive government bursary for qualifying South African students at universities and TVET colleges."
  },
  {
    id: 4,
    title: "Moses Kotane Institute Digital Labs",
    org: "Moses Kotane Institute (KZN)",
    category: "Digital-Skills",
    age: "16-25",
    location: "KZN Innovation Hubs & Online",
    stipend: "Free Training & Certification",
    desc: "High-impact bootcamps in software engineering, cloud computing, IoT, and AI prompting for KZN youth."
  },
  {
    id: 5,
    title: "eThekwini Municipal Academy Learnerships",
    org: "eThekwini Municipality",
    category: "Apprenticeship",
    age: "18-25",
    location: "Durban / KwaZulu-Natal",
    stipend: "Monthly Stipend Provided",
    desc: "Practical trade apprenticeships and administrative learnership programmes across municipal departments."
  },
  {
    id: 6,
    title: "Free Full Stack Web & Mobile App Bootcamps",
    org: "mLab / IT Varsity",
    category: "Course",
    age: "16-25",
    location: "Online / Hybrid KZN",
    stipend: "Free Education",
    desc: "Learn HTML, CSS, JavaScript, React, and Python with mentor-backed reviews."
  }
];

const THERAPIST_DIRECTORY = [
  {
    id: 1,
    name: "Childline KZN Regional Counselling",
    type: "Child & Youth Counselling Centre",
    phone: "116",
    altPhone: "0800055555",
    location: "383 Bulwer St, Pietermaritzburg / Morningside, Durban",
    cost: "100% Free / NPO",
    suitability: "Ages 6–21 & Families",
    desc: "Walk-in and telephone trauma counselling, school pressure support, and child protection services.",
    mapUrl: "https://maps.google.com/?q=Childline+KwaZulu-Natal"
  },
  {
    id: 2,
    name: "SADAG Mental Health & Support Groups",
    type: "Youth & Adult Psychological Support",
    phone: "0800567567",
    altPhone: "0112344837",
    location: "Nationwide & KZN Community Clinics",
    cost: "Free Toll-Free Support",
    suitability: "Ages 13–25+",
    desc: "24/7 telephonic counselling, depression, exam anxiety relief, and referrals to local psychiatrists.",
    mapUrl: "https://maps.google.com/?q=SADAG+South+Africa"
  },
  {
    id: 3,
    name: "Lifeline Pietermaritzburg & KZN",
    type: "Crisis & Emotional Wellness Centre",
    phone: "0861322322",
    altPhone: "0333424447",
    location: "Pietermaritzburg City Centre & Regional Units",
    cost: "Free / Community Rates",
    suitability: "All Youth & Adults",
    desc: "Confidential one-on-one sessions for family struggles, grief, emotional distress, and relationship strain.",
    mapUrl: "https://maps.google.com/?q=Lifeline+Pietermaritzburg"
  },
  {
    id: 4,
    name: "FAMSA (Families South Africa)",
    type: "Family & Youth Counselling",
    phone: "0333424976",
    altPhone: "0312028987",
    location: "KZN Regional Branches",
    cost: "Subsidised / Sliding Scale",
    suitability: "Teens, Young Adults & Parents",
    desc: "Specialist relationship mediation, trauma counselling, and life skills support for adolescents.",
    mapUrl: "https://maps.google.com/?q=FAMSA+KwaZulu+Natal"
  }
];

const BUDGET_PRESETS = [
  { name: 'Student R2,500', income: 2500, budget: { transport: 600, food: 800, education: 400, savings: 400, entertainment: 300 } },
  { name: 'Entry Job R6,500', income: 6500, budget: { transport: 1500, food: 2000, education: 600, savings: 1500, entertainment: 900 } },
  { name: 'Freelancer R10,000', income: 10000, budget: { transport: 2000, food: 3000, education: 1000, savings: 2500, entertainment: 1500 } }
];

const COMPANION_GRADE_PERSONAS = {
  '9-12': {
    title: "Grades 4–6 Explorer Mode",
    morningGreeting: "Sawubona young leader! School bag packed? Let's make today fun and learn something new.",
    afternoonGreeting: "Sanibonani! Finished your homework? Take a quick breather and build your focus streak.",
    dilemmaPrompt: "There's a fun dilemma waiting for you today. What would you do if your friend needed help?",
    actionChips: [
      { label: 'Read Story', tab: 'daily' },
      { label: 'Chat with Friends', tab: 'friends-chat' }
    ]
  },
  '13-15': {
    title: "Grades 7–9 Junior High Mode",
    morningGreeting: "Morning! Stay locked in today. Every test and subject choice now sets up your Grade 10 stream.",
    afternoonGreeting: "Afternoon check-in! Don't let school stress get heavy—balance study time with your friends.",
    dilemmaPrompt: "A new peer pressure scenario just dropped. Check what other high schoolers voted!",
    actionChips: [
      { label: 'Vote on Dilemma', tab: 'think-twice' },
      { label: 'Subject Guidance', tab: 'daily' }
    ]
  },
  '16-17': {
    title: "Grades 10–12 Matric Focus Mode",
    morningGreeting: "Sawubona Matric builder! High APS points start with small daily wins. What's the main study goal today?",
    afternoonGreeting: "Evening grind! Don't trade your future matric certificate for quick distractions tonight.",
    dilemmaPrompt: "Today's dilemma touches real exam ethics. Cast your vote and review the peer breakdown.",
    actionChips: [
      { label: 'Check Bursaries', modal: 'opps' },
      { label: 'Think Twice Test', tab: 'think-twice' }
    ]
  },
  '18-25': {
    title: "Young Adult Hustle Mode",
    morningGreeting: "Sawubona! Ready to move closer to your career goals? Check out today's verified KZN opportunities.",
    afternoonGreeting: "Evening review! Protect your cash flow and keep building in-demand digital skills.",
    dilemmaPrompt: "Today's dilemma tackles real-world money and ethics. See what your peers would do.",
    actionChips: [
      { label: 'YES4Youth & Bursaries', modal: 'opps' },
      { label: 'Rand Budget Plan', tab: 'money' }
    ]
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  
  // ADAPTIVE INNER COMPANION STATE
  const [companionEnabled, setCompanionEnabled] = useState(true);
  const [companionOpen, setCompanionOpen] = useState(true);
  const [companionSpeech, setCompanionSpeech] = useState('');
  const [companionChips, setCompanionChips] = useState([]);

  // AGE ONBOARDING STATE
  const [ageBand, setAgeBand] = useState(null);
  const [showAgeOnboarding, setShowAgeOnboarding] = useState(false);

  // DAILY DILEMMA / BLIND POLL STATE
  const [selectedDilemmaIndex, setSelectedDilemmaIndex] = useState(0);
  const [votedDilemmas, setVotedDilemmas] = useState({});

  // FAMILY SOS LIVE LOCATION STATE
  const [familyContact, setFamilyContact] = useState({ name: '', phone: '' });
  const [showSosSetupModal, setShowSosSetupModal] = useState(false);
  const [sosStatus, setSosStatus] = useState('');
  const [tempFamilyName, setTempFamilyName] = useState('');
  const [tempFamilyPhone, setTempFamilyPhone] = useState('');

  // FRIENDS CHAT & CONTACTS STATE
  const [deviceContacts, setDeviceContacts] = useState([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friendChats, setFriendChats] = useState({});
  const [friendMsgInput, setFriendMsgInput] = useState('');

  // THERAPY TAB VIEW
  const [therapySubView, setTherapySubView] = useState('therapists');
  const [therapyFilter, setTherapyFilter] = useState('all');

  // GET HELP / SOS MODAL STATE & TRIAGE CATEGORY
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpCategory, setHelpCategory] = useState('all');

  // Toolmenu & Modal states
  const [showToolMenu, setShowToolMenu] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showThenNowModal, setShowThenNowModal] = useState(false);
  const [showOppsModal, setShowOppsModal] = useState(false);
  const [showParentsModal, setShowParentsModal] = useState(false);
  const toolMenuRef = useRef(null);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // Future Me Question State
  const [futureMeChoice, setFutureMeChoice] = useState(null);

  // Articles & Scenarios
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(THINK_TWICE_SCENARIOS[0]);

  // Money Zone State (ZAR)
  const [income, setIncome] = useState(5000);
  const [budget, setBudget] = useState({
    transport: 1200,
    food: 1500,
    education: 800,
    savings: 1000,
    entertainment: 500
  });

  // Future Me Goals
  const [goals, setGoals] = useState([
    { id: 1, title: 'Learn Python programming basics', progress: 50 },
    { id: 2, title: 'Open a tax-free savings account', progress: 80 }
  ]);
  const [newGoalText, setNewGoalText] = useState('');

  // Daily Habit Streak
  const [habitStreak, setHabitStreak] = useState(3);
  const [completedToday, setCompletedToday] = useState(false);

  // Daily Mood
  const [checkedInMood, setCheckedInMood] = useState('Good');
  const [showGrounding, setShowGrounding] = useState(false);

  // AI Chat Messages
  const [chatMessages, setChatMessages] = useState([
    { sender: 'assistant', text: "Sawubona! I'm your NextGen reflection companion. How are you feeling today?" }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Close toolmenu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (toolMenuRef.current && !toolMenuRef.current.contains(event.target)) {
        setShowToolMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Safe Persistence & Load Stored Data
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        let storedGoals = null;
        let storedMood = null;
        let storedStreak = null;
        let storedAge = null;
        let storedFam = null;
        let storedChats = null;
        let storedVotes = null;
        let storedCompanion = null;

        try {
          const a = await Preferences.get({ key: 'nextgen_ageband_v1' });
          storedAge = a.value;
          const g = await Preferences.get({ key: 'nextgen_goals_v1' });
          storedGoals = g.value;
          const m = await Preferences.get({ key: 'nextgen_mood_v1' });
          storedMood = m.value;
          const s = await Preferences.get({ key: 'nextgen_streak_v1' });
          storedStreak = s.value;
          const f = await Preferences.get({ key: 'nextgen_family_sos_v1' });
          storedFam = f.value;
          const c = await Preferences.get({ key: 'nextgen_friend_chats_v1' });
          storedChats = c.value;
          const v = await Preferences.get({ key: 'nextgen_dilemma_votes_v1' });
          storedVotes = v.value;
          const comp = await Preferences.get({ key: 'nextgen_companion_enabled_v1' });
          storedCompanion = comp.value;
        } catch {
          storedAge = localStorage.getItem('nextgen_ageband_v1');
          storedGoals = localStorage.getItem('nextgen_goals_v1');
          storedMood = localStorage.getItem('nextgen_mood_v1');
          storedStreak = localStorage.getItem('nextgen_streak_v1');
          storedFam = localStorage.getItem('nextgen_family_sos_v1');
          storedChats = localStorage.getItem('nextgen_friend_chats_v1');
          storedVotes = localStorage.getItem('nextgen_dilemma_votes_v1');
          storedCompanion = localStorage.getItem('nextgen_companion_enabled_v1');
        }

        if (storedCompanion !== null) {
          setCompanionEnabled(storedCompanion === 'true');
        }

        if (storedAge) {
          setAgeBand(storedAge);
          setShowAgeOnboarding(false);
        } else {
          setShowAgeOnboarding(true);
        }

        if (storedVotes) {
          setVotedDilemmas(JSON.parse(storedVotes));
        }

        if (storedFam) {
          const parsed = JSON.parse(storedFam);
          setFamilyContact(parsed);
          setTempFamilyName(parsed.name || '');
          setTempFamilyPhone(parsed.phone || '');
        }

        if (storedChats) {
          setFriendChats(JSON.parse(storedChats));
        }

        if (storedGoals) setGoals(JSON.parse(storedGoals));
        if (storedMood) setCheckedInMood(storedMood);
        if (storedStreak) setHabitStreak(Number(storedStreak));
      } catch (err) {
        console.warn('Storage read fallback', err);
        setShowAgeOnboarding(true);
      }
    };

    loadStoredData();
  }, []);

  // Adaptive Companion Logic with Grade Persona Mapping
  useEffect(() => {
    if (!companionEnabled) return;

    const currentHour = new Date().getHours();
    const currentBand = ageBand || '16-17';
    const persona = COMPANION_GRADE_PERSONAS[currentBand] || COMPANION_GRADE_PERSONAS['16-17'];
    const greeting = currentHour < 14 ? persona.morningGreeting : persona.afternoonGreeting;

    if (checkedInMood === 'Stressed' || checkedInMood === 'Overwhelmed') {
      setCompanionSpeech(
        currentBand === '9-12'
          ? "Feeling tired or worried? Remember to speak to your parents or teacher. You can also try our quick breathing exercise!"
          : "School pressure or life getting loud? Take 60 seconds with our 5-4-3-2-1 reset. You don't have to carry it alone."
      );
      setCompanionChips([
        { label: 'Try Grounding', action: () => setShowGrounding(true) },
        { label: 'Therapist Directory', action: () => { setActiveTab('therapy'); setTherapySubView('therapists'); } }
      ]);
    } else if (futureMeChoice?.val === 'no') {
      setCompanionSpeech(
        currentBand === '16-17'
          ? "Saying NO to risky moves protects your matric exams and future bursary eligibility. That's real maturity."
          : "Standing your ground takes guts. Your future self will thank you for making the wise call."
      );
      setCompanionChips([
        { label: 'Check Consequence', action: () => setActiveTab('think-twice') },
        { label: 'Set A New Goal', action: () => setActiveTab('future-me') }
      ]);
    } else if (!votedDilemmas['dilemma-01']) {
      setCompanionSpeech(`${greeting} ${persona.dilemmaPrompt}`);
      setCompanionChips([
        { label: 'Vote on Dilemma', action: () => setActiveTab('think-twice') },
        { label: 'Chat with Friends', action: () => setActiveTab('friends-chat') }
      ]);
    } else {
      setCompanionSpeech(`${greeting} You're on a ${habitStreak}-day focus streak. Keep building momentum!`);
      setCompanionChips(
        persona.actionChips.map(chip => ({
          label: chip.label,
          action: chip.modal === 'opps' ? () => setShowOppsModal(true) : () => setActiveTab(chip.tab)
        }))
      );
    }
  }, [checkedInMood, futureMeChoice, habitStreak, votedDilemmas, companionEnabled, ageBand]);

  const toggleCompanion = async () => {
    const nextState = !companionEnabled;
    setCompanionEnabled(nextState);
    if (!nextState) {
      setCompanionOpen(false);
    } else {
      setCompanionOpen(true);
    }
    try {
      await Preferences.set({ key: 'nextgen_companion_enabled_v1', value: String(nextState) });
    } catch {
      localStorage.setItem('nextgen_companion_enabled_v1', String(nextState));
    }
  };

  const handleSelectAgeGroup = async (selected) => {
    setAgeBand(selected);
    setShowAgeOnboarding(false);
    try {
      await Preferences.set({ key: 'nextgen_ageband_v1', value: selected });
    } catch {
      localStorage.setItem('nextgen_ageband_v1', selected);
    }
  };

  const handleVoteDilemma = async (dilemmaId, optionId) => {
    const nextVotes = { ...votedDilemmas, [dilemmaId]: optionId };
    setVotedDilemmas(nextVotes);
    
    if (!completedToday) {
      handleHabitCheckIn();
    }

    try {
      await Preferences.set({ key: 'nextgen_dilemma_votes_v1', value: JSON.stringify(nextVotes) });
    } catch {
      localStorage.setItem('nextgen_dilemma_votes_v1', JSON.stringify(nextVotes));
    }
  };

  const handleSaveFamilyContact = async (e) => {
    e.preventDefault();
    if (!tempFamilyPhone.trim()) return;
    const data = { name: tempFamilyName.trim() || 'My Family', phone: tempFamilyPhone.trim() };
    setFamilyContact(data);
    setShowSosSetupModal(false);
    try {
      await Preferences.set({ key: 'nextgen_family_sos_v1', value: JSON.stringify(data) });
    } catch {
      localStorage.setItem('nextgen_family_sos_v1', JSON.stringify(data));
    }
  };

  const loadDeviceContacts = async () => {
    setIsLoadingContacts(true);
    try {
      const permission = await Contacts.requestPermissions();
      if (permission.contacts === 'granted') {
        const res = await Contacts.getContacts({
          projection: {
            name: true,
            phones: true
          }
        });
        const formatted = (res.contacts || [])
          .filter(c => c.phones && c.phones.length > 0)
          .map(c => ({
            id: c.contactId || c.displayName || Math.random().toString(),
            name: c.displayName || c.name?.display || 'Friend',
            phone: c.phones[0].number
          }));
        setDeviceContacts(formatted);
      } else {
        alert("Contacts permission is required to chat with friends without exposing minors publicly.");
      }
    } catch (err) {
      console.warn("Contacts API fallback:", err);
      setDeviceContacts([
        { id: '1', name: 'Sipho (Classmate)', phone: '082 555 1234' },
        { id: '2', name: 'Amahle (Study Buddy)', phone: '083 444 5678' },
        { id: '3', name: 'Bandile (Indaba Corner)', phone: '071 333 9876' }
      ]);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const sendFriendMessage = async () => {
    if (!friendMsgInput.trim() || !selectedFriend) return;
    const friendId = selectedFriend.id;
    const existing = friendChats[friendId] || [];
    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: friendMsgInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'free-sent'
    };
    const updatedChats = {
      ...friendChats,
      [friendId]: [...existing, newMsg]
    };
    setFriendChats(updatedChats);
    setFriendMsgInput('');

    try {
      await Preferences.set({ key: 'nextgen_friend_chats_v1', value: JSON.stringify(updatedChats) });
    } catch {
      localStorage.setItem('nextgen_friend_chats_v1', JSON.stringify(updatedChats));
    }
  };

  const triggerFamilySos = async () => {
    if (!familyContact.phone) {
      setShowSosSetupModal(true);
      return;
    }

    setSosStatus('Locating your GPS coordinates...');

    let lat = -29.6167;
    let lng = 30.3833;

    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 6000
      });
      lat = position.coords.latitude;
      lng = position.coords.longitude;
    } catch (err) {
      console.warn('Geolocation read fallback', err);
    }

    const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
    const sosMessage = `🚨 EMERGENCY SOS: I am in trouble and need immediate help! Here is my current live GPS location: ${mapsUrl} (Sent via NextGen by Indaba Men's Corner)`;

    const cleanPhone = familyContact.phone.replace(/[^0-9+]/g, '');
    const smsLink = `sms:${cleanPhone}?body=${encodeURIComponent(sosMessage)}`;

    setSosStatus('Opening emergency message dispatch...');
    window.location.href = smsLink;

    setTimeout(() => {
      setSosStatus('');
    }, 2500);
  };

  useEffect(() => {
    const saveGoals = async () => {
      const val = JSON.stringify(goals);
      try {
        await Preferences.set({ key: 'nextgen_goals_v1', value: val });
      } catch {
        localStorage.setItem('nextgen_goals_v1', val);
      }
    };
    saveGoals();
  }, [goals]);

  const totalSpent = Object.values(budget).reduce((a, b) => a + b, 0);
  const remaining = income - totalSpent;

  const currentDilemma = DAILY_DILEMMAS[selectedDilemmaIndex];
  const hasVotedCurrent = !!votedDilemmas[currentDilemma.id];

  const filteredArticles = useMemo(() => {
    const currentBand = ageBand || '16-17';
    return ARTICLES_DATA.filter(art => art.ageBands.includes(currentBand));
  }, [ageBand]);

  const filteredTherapists = useMemo(() => {
    if (therapyFilter === 'free') {
      return THERAPIST_DIRECTORY.filter(t => t.cost.toLowerCase().includes('free'));
    }
    return THERAPIST_DIRECTORY;
  }, [therapyFilter]);

  const filteredEmergencyServices = useMemo(() => {
    if (helpCategory === 'all') return EMERGENCY_SERVICES_DATA;
    if (helpCategory === 'sos') return EMERGENCY_SERVICES_DATA.filter(s => s.category === 'sos' || s.category === 'police' || s.category === 'medical');
    return EMERGENCY_SERVICES_DATA.filter(s => s.category === helpCategory);
  }, [helpCategory]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    const articles = ARTICLES_DATA.filter(a => a.title.toLowerCase().includes(q))
      .map(a => ({ type: 'Article', title: a.title, action: () => { setSelectedArticle(a); setActiveTab('daily'); } }));
    const scenarios = THINK_TWICE_SCENARIOS.filter(s => s.title.toLowerCase().includes(q))
      .map(s => ({ type: 'Think Twice', title: s.title, action: () => { setSelectedScenario(s); setActiveTab('think-twice'); } }));
    const opps = OPPORTUNITIES_DATA.filter(o => o.title.toLowerCase().includes(q) || o.location.toLowerCase().includes(q))
      .map(o => ({ type: 'Opportunity', title: o.title, action: () => setShowOppsModal(true) }));
    const therapists = THERAPIST_DIRECTORY.filter(t => t.name.toLowerCase().includes(q) || t.location.toLowerCase().includes(q))
      .map(t => ({ type: 'Therapist Near You', title: t.name, action: () => { setActiveTab('therapy'); setTherapySubView('therapists'); } }));
    return [...articles, ...scenarios, ...opps, ...therapists];
  }, [searchQuery]);

  const handleHabitCheckIn = () => {
    if (!completedToday) {
      const next = habitStreak + 1;
      setHabitStreak(next);
      setCompletedToday(true);
      try {
        Preferences.set({ key: 'nextgen_streak_v1', value: String(next) });
      } catch {
        localStorage.setItem('nextgen_streak_v1', String(next));
      }
    }
  };

  const applyBudgetPreset = (preset) => {
    setIncome(preset.income);
    setBudget(preset.budget);
  };

  const addGoal = () => {
    if (!newGoalText.trim()) return;
    setGoals([...goals, { id: Date.now(), title: newGoalText.trim(), progress: 0 }]);
    setNewGoalText('');
  };

  const updateGoalProgress = (id, delta) => {
    setGoals(goals.map(g => {
      if (g.id === id) {
        const next = Math.max(0, Math.min(100, g.progress + delta));
        return { ...g, progress: next };
      }
      return g;
    }));
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const handleSendContact = (e) => {
    e.preventDefault();
    if (!contactMsg.trim()) return;
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactMsg('');
      setContactName('');
      setShowContactModal(false);
    }, 1800);
  };

  const sendChatMessage = (customText) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim()) return;
    const newChat = [...chatMessages, { sender: 'user', text: textToSend }];
    setChatMessages(newChat);
    if (!customText) setChatInput('');

    setTimeout(() => {
      let reply = "Thank you for reflecting on that. What is one small, positive choice Future Me would be proud of you making right now?";
      const lower = textToSend.toLowerCase();
      if (lower.includes('stress') || lower.includes('sad') || lower.includes('overwhelm')) {
        reply = "Take a slow, deep breath. You don't have to carry everything at once. Would you like to check our directory of qualified local counsellors?";
      } else if (lower.includes('money') || lower.includes('job') || lower.includes('career') || lower.includes('bursary')) {
        reply = "Focusing on your future shows real maturity. Check the Youth Opportunities section for KZN Premier bursaries and NSFAS guidance.";
      }
      setChatMessages([...newChat, { sender: 'assistant', text: reply }]);
    }, 500);
  };

  return (
    <>
      {/* 1. TOP SEMANTIC HEADER LANDMARK */}
      <header style={{ 
        maxWidth: '480px', 
        margin: '0 auto', 
        paddingTop: 'max(env(safe-area-inset-top), 20px)', 
        paddingLeft: '16px', 
        paddingRight: '16px', 
        marginBottom: 16 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ 
                fontSize: 26, 
                fontWeight: 900, 
                letterSpacing: -0.8, 
                background: 'linear-gradient(135deg, #ffffff 30%, #e9d5ff 70%, #c084fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 4px 20px rgba(168, 85, 247, 0.3)'
              }}>
                NEXT<span style={{ color: '#a855f7', WebkitTextFillColor: '#c084fc' }}>GEN</span>
              </span>
              <span style={{ 
                fontSize: 10, 
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.35) 0%, rgba(121, 40, 202, 0.15) 100%)', 
                border: '1px solid rgba(192, 132, 252, 0.35)',
                color: '#e9d5ff', 
                padding: '2px 8px', 
                borderRadius: 9999, 
                fontWeight: 800,
                boxShadow: '0 2px 10px rgba(168, 85, 247, 0.25)'
              }}>
                V1
              </span>
            </div>
            <p style={{ fontSize: 11, color: '#c084fc', margin: 0, fontWeight: 500, letterSpacing: 0.2 }}>by Indaba Men's Corner</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* RED FAMILY SOS BUTTON */}
            <button 
              onClick={triggerFamilySos}
              title="Send SOS with Live GPS Location"
              style={{ 
                background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', 
                color: '#fff', 
                border: '1px solid rgba(254, 202, 202, 0.5)', 
                padding: '7px 12px', 
                borderRadius: 9999, 
                fontSize: 11, 
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                boxShadow: '0 4px 18px rgba(220, 38, 38, 0.5), inset 0 1px 0 rgba(255,255,255,0.4)',
                cursor: 'pointer'
              }}>
              <Radio size={14} /> SOS
            </button>

            {/* GET HELP TRIGGER */}
            <button 
              onClick={() => { setShowHelpModal(true); setHelpCategory('all'); }}
              style={{ 
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.35) 0%, rgba(236, 72, 153, 0.35) 100%)', 
                color: '#fff', 
                border: '1px solid rgba(255, 255, 255, 0.2)', 
                padding: '7px 12px', 
                borderRadius: 9999, 
                fontSize: 11, 
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                backdropFilter: 'blur(16px)',
                boxShadow: '0 4px 18px rgba(236, 72, 153, 0.25), inset 0 1px 0 rgba(255,255,255,0.3)',
                cursor: 'pointer'
              }}>
              <ShieldAlert size={14} /> HELP
            </button>

            {/* Glossy More Menu Trigger */}
            <div style={{ position: 'relative' }} ref={toolMenuRef}>
              <button
                onClick={() => setShowToolMenu(!showToolMenu)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#e9d5ff',
                  width: 36,
                  height: 36,
                  borderRadius: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.25)',
                  cursor: 'pointer'
                }}>
                <MoreVertical size={18} />
              </button>

              {/* Toolmenu Dropdown Menu */}
              {showToolMenu && (
                <div style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  width: 255,
                  background: 'linear-gradient(135deg, rgba(25, 10, 52, 0.95) 0%, rgba(12, 4, 30, 0.98) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 22,
                  padding: '8px',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.25)',
                  zIndex: 100,
                  backdropFilter: 'blur(30px)'
                }}>
                  {/* INNER COMPANION TOGGLE IN MENU */}
                  <div 
                    onClick={toggleCompanion}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '10px 12px', 
                      borderRadius: 14, 
                      cursor: 'pointer', 
                      background: companionEnabled ? 'rgba(168,85,247,0.18)' : 'rgba(255,255,255,0.04)', 
                      border: companionEnabled ? '1px solid rgba(168,85,247,0.35)' : '1px solid rgba(255,255,255,0.1)' 
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {companionEnabled ? <Volume2 size={16} color="#c084fc" /> : <VolumeX size={16} color="#64748b" />}
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: companionEnabled ? '#e9d5ff' : '#94a3b8', margin: 0 }}>
                          Inner Companion
                        </p>
                        <span style={{ fontSize: 10, color: companionEnabled ? '#c084fc' : '#64748b' }}>
                          {companionEnabled ? 'Active on startup' : 'Muted & hidden'}
                        </span>
                      </div>
                    </div>
                    <span style={{ 
                      fontSize: 10, 
                      fontWeight: 800, 
                      padding: '2px 8px', 
                      borderRadius: 9999, 
                      background: companionEnabled ? '#a855f7' : '#334155', 
                      color: '#fff' 
                    }}>
                      {companionEnabled ? 'ON' : 'OFF'}
                    </span>
                  </div>

                  <div 
                    onClick={() => { setActiveTab('friends-chat'); setShowToolMenu(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 14, cursor: 'pointer', background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(16,185,129,0.25)', marginTop: 4 }}>
                    <MessageSquare size={16} color="#10b981" />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#34d399', margin: 0 }}>Smart Friends Chat</p>
                      <span style={{ fontSize: 10, color: '#a7f3d0' }}>Youth messaging & social handoff</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => { setShowSosSetupModal(true); setShowToolMenu(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 14, cursor: 'pointer', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', marginTop: 4 }}>
                    <Radio size={16} color="#ef4444" />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#f87171', margin: 0 }}>Family SOS Contact</p>
                      <span style={{ fontSize: 10, color: '#fca5a5' }}>{familyContact.phone ? `${familyContact.name} (${familyContact.phone})` : 'Tap to set contact'}</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => { setShowAgeOnboarding(true); setShowToolMenu(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 14, cursor: 'pointer', background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', marginTop: 4 }}>
                    <UserCheck size={16} color="#c084fc" />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#d8b4fe', margin: 0 }}>Age Group: {ageBand || 'Set'}</p>
                      <span style={{ fontSize: 10, color: '#e2e8f0' }}>Change your content level</span>
                    </div>
                  </div>

                  <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '6px 4px' }} />

                  <div 
                    onClick={() => { setShowThenNowModal(true); setShowToolMenu(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 12, cursor: 'pointer', background: 'rgba(255,255,255,0.03)' }}>
                    <Clock size={16} color="#f59e0b" />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>Then → Now → Next</p>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>Generational wisdom</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => { setShowOppsModal(true); setShowToolMenu(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 12, cursor: 'pointer', background: 'rgba(255,255,255,0.03)', marginTop: 2 }}>
                    <Briefcase size={16} color="#38bdf8" />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>Youth Opportunities</p>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>Bursaries, TVET & skills</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => { setShowParentsModal(true); setShowToolMenu(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 12, cursor: 'pointer', background: 'rgba(255,255,255,0.03)', marginTop: 2 }}>
                    <Users size={16} color="#eab308" />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>Parents & Guardians</p>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>Age-appropriate safety</span>
                    </div>
                  </div>

                  <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '6px 4px' }} />

                  <div 
                    onClick={() => { setShowAboutModal(true); setShowToolMenu(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 12, cursor: 'pointer', background: 'rgba(255,255,255,0.03)' }}>
                    <Info size={16} color="#a855f7" />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>About NextGen</p>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>Vision & mission</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => { setShowContactModal(true); setShowToolMenu(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 12, cursor: 'pointer', background: 'rgba(255,255,255,0.03)', marginTop: 2 }}>
                    <Mail size={16} color="#ec4899" />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>Contact Us</p>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>081 532 5916 & support</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => { setShowPrivacyModal(true); setShowToolMenu(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 12, cursor: 'pointer', background: 'rgba(255,255,255,0.03)', marginTop: 2 }}>
                    <ShieldCheck size={16} color="#10b981" />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>Privacy & Safety</p>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>Safe youth space</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {sosStatus && (
          <aside style={{ background: '#b91c1c', padding: '8px 12px', borderRadius: 14, fontSize: 12, fontWeight: 800, textAlign: 'center', color: '#fff', marginTop: 10, boxShadow: '0 4px 18px rgba(185,28,28,0.4)' }}>
            🚨 {sosStatus}
          </aside>
        )}

        {/* UNIVERSAL SEARCH BAR */}
        <div style={{ position: 'relative', marginTop: 12 }}>
          <Search size={18} style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: '#c084fc' }} />
          <input
            type="text"
            placeholder="Search KZN bursaries, skills, topics, advice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '13px 20px 13px 48px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: 9999,
              color: '#fff',
              fontSize: 13,
              outline: 'none',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
              boxSizing: 'border-box'
            }}
          />
          {searchQuery && (
            <X 
              size={16} 
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', color: '#c084fc', cursor: 'pointer' }}
            />
          )}
        </div>

        {searchResults && (
          <section aria-label="Search Results" style={{ 
            background: 'linear-gradient(135deg, rgba(24, 11, 49, 0.95) 0%, rgba(13, 5, 33, 0.98) 100%)', 
            border: '1px solid rgba(168, 85, 247, 0.3)', 
            borderRadius: 18, 
            marginTop: 8, 
            padding: 8,
            boxShadow: '0 16px 36px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.2)',
            backdropFilter: 'blur(24px)'
          }}>
            <p style={{ fontSize: 11, color: '#c084fc', padding: '4px 8px', margin: 0, fontWeight: 700 }}>RESULTS ({searchResults.length})</p>
            {searchResults.length === 0 ? (
              <p style={{ fontSize: 13, color: '#94a3b8', padding: '8px', margin: 0 }}>No matches found for "{searchQuery}".</p>
            ) : (
              searchResults.map((res, i) => (
                <div 
                  key={i} 
                  onClick={() => { res.action(); setSearchQuery(''); }}
                  style={{ padding: '9px 12px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', marginBottom: 4 }}>
                  <div>
                    <span style={{ fontSize: 10, color: '#38bdf8', textTransform: 'uppercase', fontWeight: 800 }}>{res.type}</span>
                    <p style={{ fontSize: 13, color: '#fff', margin: 0 }}>{res.title}</p>
                  </div>
                  <ChevronRight size={14} color="#c084fc" />
                </div>
              ))
            )}
          </section>
        )}
      </header>

      {/* 2. MAIN SEMANTIC LANDMARK (ENCOMPASSES DYNAMIC BODY CONTENT) */}
      <main style={{ 
        maxWidth: '480px', 
        margin: '0 auto', 
        paddingLeft: '16px', 
        paddingRight: '16px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 14 
      }}>
        {/* 2.1 ADAPTIVE INNER COMPANION */}
        {companionEnabled && companionOpen && (
          <aside aria-label="Inner Companion Advice" style={{
            background: 'linear-gradient(135deg, rgba(34, 12, 70, 0.92) 0%, rgba(14, 5, 34, 0.96) 100%)',
            border: '1px solid rgba(192, 132, 252, 0.45)',
            borderRadius: 24,
            padding: '16px 18px',
            boxShadow: '0 18px 45px rgba(121, 40, 202, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(24px)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  position: 'relative',
                  width: 32,
                  height: 32,
                  borderRadius: 9999,
                  background: 'linear-gradient(135deg, #7928ca 0%, #38bdf8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 12px rgba(168, 85, 247, 0.6)'
                }}>
                  <Bot size={18} color="#fff" />
                  <span style={{
                    position: 'absolute',
                    top: -1,
                    right: -1,
                    width: 8,
                    height: 8,
                    background: '#10b981',
                    borderRadius: 9999,
                    border: '1.5px solid #070214'
                  }} />
                </div>

                <div>
                  <h4 style={{ fontSize: 13, fontWeight: 900, margin: 0, color: '#fff', letterSpacing: -0.2 }}>
                    {COMPANION_GRADE_PERSONAS[ageBand || '16-17']?.title || 'NextGen Companion'}
                  </h4>
                  <span style={{ fontSize: 10, color: '#c084fc', fontWeight: 600 }}>
                    Active • Age {ageBand || '16-17'} Mode
                  </span>
                </div>
              </div>

              <button
                onClick={() => setCompanionOpen(false)}
                title="Dismiss for this session"
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}>
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: 12, color: '#e2e8f0', lineHeight: 1.5, margin: '10px 0 12px 0' }}>
              "{companionSpeech}"
            </p>

            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
              {companionChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={chip.action}
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: 9999,
                    fontSize: 11,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
                  }}>
                  {chip.label} →
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* 2.2 HOME SCREEN VIEW */}
        {activeTab === 'home' && (
          <>
            {/* HERO DECISION CARD */}
            <article style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.22) 0%, rgba(20, 8, 48, 0.65) 100%)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: 28,
              padding: '24px 22px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.35)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)'
              }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={15} color="#c084fc" />
                <span style={{ fontSize: 11, fontWeight: 900, color: '#d8b4fe', letterSpacing: 0.8, textTransform: 'uppercase' }}>
                  Today's Filter
                </span>
              </div>

              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '10px 0 8px 0', color: '#fff', lineHeight: 1.35, letterSpacing: -0.3 }}>
                Will this decision help Future Me?
              </h2>

              <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                Before you make a move today, pause and picture where it leaves you tomorrow.
              </p>
              
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { label: 'Yes, it builds me', val: 'yes', feedback: 'Great mindset! Keep taking daily steps toward your future self.' },
                  { label: 'Not sure', val: 'maybe', feedback: 'Take 2 minutes to run this through our Think Twice consequence checker.' },
                  { label: 'No, it hurts me', val: 'no', feedback: 'Respect your own boundaries. Saying no today protects Future Me tomorrow.' }
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setFutureMeChoice(item)}
                    style={{
                      flex: 1,
                      padding: '10px 6px',
                      borderRadius: 9999,
                      border: futureMeChoice?.val === item.val ? '1px solid #fff' : '1px solid rgba(255,255,255,0.18)',
                      fontSize: 11,
                      fontWeight: 800,
                      background: futureMeChoice?.val === item.val 
                        ? 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)' 
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
                      color: futureMeChoice?.val === item.val ? '#120926' : '#fff',
                      boxShadow: futureMeChoice?.val === item.val 
                        ? '0 6px 20px rgba(255, 255, 255, 0.35)' 
                        : '0 4px 14px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}>
                    {item.label}
                  </button>
                ))}
              </div>

              {futureMeChoice && (
                <div style={{ 
                  marginTop: 14, 
                  padding: '12px 14px', 
                  background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(14, 165, 233, 0.05) 100%)', 
                  borderRadius: 14, 
                  borderLeft: '3px solid #38bdf8',
                  borderTop: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRight: '1px solid rgba(56, 189, 248, 0.1)',
                  borderBottom: '1px solid rgba(56, 189, 248, 0.1)'
                }}>
                  <p style={{ fontSize: 12, color: '#38bdf8', margin: 0, fontWeight: 700 }}>{futureMeChoice.feedback}</p>
                </div>
              )}
            </article>

            {/* MOOD SELECTION SECTION */}
            <section aria-label="Mood Check-in">
              <h3 style={{ fontSize: 12, color: '#c084fc', fontWeight: 700, margin: '0 0 10px 0', letterSpacing: 0.3 }}>How are you feeling right now?</h3>
              <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
                {[
                  { label: 'Happy', emoji: '😊' },
                  { label: 'Calm', emoji: '🌿' },
                  { label: 'Stressed', emoji: '⚡' },
                  { label: 'Overwhelmed', emoji: '🌪️' },
                  { label: 'I need help', emoji: '🆘' }
                ].map((m) => (
                  <button
                    key={m.label}
                    onClick={() => {
                      setCheckedInMood(m.label);
                      if (m.label === 'I need help') {
                        setShowHelpModal(true);
                      } else if (m.label === 'Stressed' || m.label === 'Overwhelmed') {
                        setShowGrounding(true);
                      }
                    }}
                    style={{
                      minWidth: 92,
                      padding: '12px 8px',
                      borderRadius: 20,
                      background: checkedInMood === m.label 
                        ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.4) 0%, rgba(121, 40, 202, 0.45) 100%)' 
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)',
                      border: checkedInMood === m.label 
                        ? '1.5px solid rgba(255, 255, 255, 0.45)' 
                        : '1px solid rgba(255, 255, 255, 0.12)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      backdropFilter: 'blur(16px)',
                      boxShadow: checkedInMood === m.label 
                        ? '0 8px 24px rgba(168, 85, 247, 0.4), inset 0 1px 0 rgba(255,255,255,0.4)' 
                        : '0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}>
                    <span style={{ fontSize: 22 }}>{m.emoji}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{m.label}</span>
                  </button>
                ))}
              </div>

              {showGrounding && (
                <article style={{ 
                  background: 'linear-gradient(135deg, rgba(28, 16, 56, 0.95) 0%, rgba(14, 5, 34, 0.95) 100%)', 
                  border: '1px solid rgba(168, 85, 247, 0.4)', 
                  borderRadius: 20, 
                  padding: 16, 
                  marginTop: 10,
                  boxShadow: '0 12px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(20px)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: '#38bdf8' }}>5-4-3-2-1 GROUNDING TECHNIQUE</span>
                    <X size={16} onClick={() => setShowGrounding(false)} style={{ cursor: 'pointer', color: '#94a3b8' }} />
                  </div>
                  <p style={{ fontSize: 12, color: '#cbd5e1', marginTop: 8, lineHeight: 1.45 }}>
                    Pause for 60 seconds and look around you:<br/>
                    👁️ <strong>5 things</strong> you can see around the room<br/>
                    ✋ <strong>4 things</strong> you can physically touch<br/>
                    👂 <strong>3 sounds</strong> you can hear<br/>
                    👃 <strong>2 scents</strong> you can smell<br/>
                    🌟 <strong>1 thing</strong> you appreciate about yourself today
                  </p>
                </article>
              )}
            </section>

            {/* EXPLORE NEXTGEN 4-GRID PORTAL */}
            <section aria-label="Feature Directory">
              <h3 style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, margin: '6px 0 10px 0', fontWeight: 800 }}>Explore NextGen</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { title: 'The Daily Dilemma', icon: Compass, tab: 'think-twice', desc: 'Blind peer polls & checks' },
                  { title: 'Smart Friends Chat', icon: MessageSquare, tab: 'friends-chat', desc: 'Local & social handoff' },
                  { title: 'Money Zone', icon: DollarSign, tab: 'money', desc: 'Rand budget simulator' },
                  { title: 'Therapy Corner', icon: HeartHandshake, tab: 'therapy', desc: 'Support & advice' }
                ].map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <article
                      key={item.title}
                      onClick={() => setActiveTab(item.tab)}
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        borderRadius: 22,
                        padding: 16,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
                      }}>
                      <div style={{ 
                        width: 38, 
                        height: 38, 
                        borderRadius: 14, 
                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(121, 40, 202, 0.15) 100%)', 
                        border: '1px solid rgba(192, 132, 252, 0.3)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(168, 85, 247, 0.2)'
                      }}>
                        <IconComponent size={20} color="#e9d5ff" />
                      </div>
                      <div>
                        <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: '#fff' }}>{item.title}</h4>
                        <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0 0' }}>{item.desc}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* 2.3 SMART FRIENDS CHAT VIEW */}
        {activeTab === 'friends-chat' && (
          <section aria-label="Smart Friends Chat" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Smart Friends Chat</h2>
                <p style={{ fontSize: 12, color: '#10b981', margin: '2px 0 0 0' }}>Chat locally or handoff to WhatsApp & Insta</p>
              </div>
              <button
                onClick={loadDeviceContacts}
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.15) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.5)',
                  color: '#34d399',
                  padding: '7px 14px',
                  borderRadius: 9999,
                  fontSize: 11,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
                  cursor: 'pointer'
                }}>
                <Contact size={14} /> Sync Contacts
              </button>
            </div>

            {selectedFriend ? (
              <article style={{ 
                background: 'linear-gradient(135deg, rgba(21, 10, 46, 0.95) 0%, rgba(11, 4, 28, 0.98) 100%)', 
                border: '1px solid rgba(16,185,129,0.35)', 
                borderRadius: 24, 
                padding: 16, 
                display: 'flex', 
                flexDirection: 'column', 
                height: 440,
                backdropFilter: 'blur(30px)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.25)'
              }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9999, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, boxShadow: '0 4px 12px rgba(168,85,247,0.3)' }}>
                      {selectedFriend.name[0]}
                    </div>
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{selectedFriend.name}</h4>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>{selectedFriend.phone}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedFriend(null)}
                    style={{ background: 'none', border: 'none', color: '#c084fc', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    Close
                  </button>
                </header>

                <nav aria-label="Social Handoff" style={{ display: 'flex', gap: 6, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <a
                    href={`https://wa.me/${selectedFriend.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Sawubona! Connecting with you from the NextGen youth wellness app.")}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      flex: 1,
                      background: 'rgba(37, 211, 102, 0.15)',
                      border: '1px solid rgba(37, 211, 102, 0.5)',
                      color: '#25d366',
                      padding: '8px 4px',
                      borderRadius: 12,
                      fontSize: 10,
                      fontWeight: 800,
                      textAlign: 'center',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4
                    }}>
                    💬 WhatsApp
                  </a>

                  <a
                    href="https://instagram.com/direct/inbox/"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      flex: 1,
                      background: 'rgba(225, 48, 108, 0.15)',
                      border: '1px solid rgba(225, 48, 108, 0.5)',
                      color: '#e1306c',
                      padding: '8px 4px',
                      borderRadius: 12,
                      fontSize: 10,
                      fontWeight: 800,
                      textAlign: 'center',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4
                    }}>
                    📸 Instagram
                  </a>

                  <a
                    href="https://m.me/"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      flex: 1,
                      background: 'rgba(0, 132, 255, 0.15)',
                      border: '1px solid rgba(0, 132, 255, 0.5)',
                      color: '#38bdf8',
                      padding: '8px 4px',
                      borderRadius: 12,
                      fontSize: 10,
                      fontWeight: 800,
                      textAlign: 'center',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4
                    }}>
                    ⚡ Messenger
                  </a>
                </nav>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 0' }}>
                  {(friendChats[selectedFriend.id] || []).length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '24px 10px', color: '#94a3b8', fontSize: 12 }}>
                      🔒 Chat locally or tap one of the social buttons above to continue this conversation on WhatsApp, Instagram, or Messenger.
                    </p>
                  ) : (
                    (friendChats[selectedFriend.id] || []).map((msg) => (
                      <div 
                        key={msg.id}
                        style={{
                          alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                          maxWidth: '80%',
                          background: msg.sender === 'me' 
                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                            : 'rgba(255,255,255,0.08)',
                          padding: '10px 14px',
                          borderRadius: 16,
                          fontSize: 12
                        }}>
                        <p style={{ margin: 0 }}>{msg.text}</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4, marginTop: 2, fontSize: 9, opacity: 0.8 }}>
                          <span>{msg.time}</span>
                          <span>✓✓</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <footer style={{ display: 'flex', gap: 6, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <input
                    type="text"
                    placeholder="Type message..."
                    value={friendMsgInput}
                    onChange={(e) => setFriendMsgInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendFriendMessage()}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 9999,
                      padding: '10px 16px',
                      color: '#fff',
                      fontSize: 12,
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={sendFriendMessage}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 9999,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}>
                    <Send size={15} />
                  </button>
                </footer>
              </article>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {deviceContacts.length === 0 ? (
                  <article style={{ 
                    background: 'linear-gradient(135deg, rgba(21, 10, 46, 0.9) 0%, rgba(12, 4, 30, 0.95) 100%)', 
                    border: '1px solid rgba(255,255,255,0.18)', 
                    borderRadius: 24, 
                    padding: 24, 
                    textAlign: 'center'
                  }}>
                    <div style={{ width: 48, height: 48, borderRadius: 9999, background: 'rgba(16,185,129,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                      <Contact size={24} color="#10b981" />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 6px 0' }}>Chat With Friends</h3>
                    <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.45, margin: '0 0 16px 0' }}>
                      Connect with your phone contacts or quickly transition conversations to WhatsApp and Instagram.
                    </p>
                    <button
                      onClick={loadDeviceContacts}
                      disabled={isLoadingContacts}
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#fff',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: 9999,
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}>
                      {isLoadingContacts ? 'Syncing...' : 'Find Friends in Contacts'}
                    </button>
                  </article>
                ) : (
                  deviceContacts.map((friend) => (
                    <article
                      key={friend.id}
                      onClick={() => setSelectedFriend(friend)}
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        borderRadius: 20,
                        padding: '14px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 9999, background: 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                          {friend.name[0]}
                        </div>
                        <div>
                          <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{friend.name}</h4>
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>{friend.phone}</span>
                        </div>
                      </div>
                      <ChevronRight size={18} color="#10b981" />
                    </article>
                  ))
                )}
              </div>
            )}
          </section>
        )}

        {/* 2.4 THERAPY CORNER VIEW */}
        {activeTab === 'therapy' && (
          <section aria-label="Therapy Corner" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <header>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Therapy Corner</h2>
              <p style={{ fontSize: 12, color: '#c084fc', margin: '2px 0 0 0' }}>Pause. Talk. Refocus. Move Forward.</p>
            </header>

            <nav aria-label="Therapy Subviews" style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', padding: 4, borderRadius: 9999, border: '1px solid rgba(255,255,255,0.18)' }}>
              <button
                onClick={() => setTherapySubView('therapists')}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: 9999,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                  background: therapySubView === 'therapists' ? 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)' : 'transparent',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}>
                <MapPin size={14} /> Therapists Near You
              </button>
              <button
                onClick={() => setTherapySubView('chat')}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: 9999,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                  background: therapySubView === 'chat' ? 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)' : 'transparent',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}>
                <MessageSquare size={14} /> Talk It Out
              </button>
            </nav>

            {therapySubView === 'therapists' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>Verified Support Services in KZN & SA</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button 
                      onClick={() => setTherapyFilter('all')}
                      style={{ background: therapyFilter === 'all' ? '#a855f7' : 'rgba(255,255,255,0.06)', border: 'none', color: '#fff', fontSize: 10, padding: '4px 10px', borderRadius: 9999, fontWeight: 700 }}>
                      All
                    </button>
                    <button 
                      onClick={() => setTherapyFilter('free')}
                      style={{ background: therapyFilter === 'free' ? '#10b981' : 'rgba(255,255,255,0.06)', border: 'none', color: '#fff', fontSize: 10, padding: '4px 10px', borderRadius: 9999, fontWeight: 700 }}>
                      100% Free
                    </button>
                  </div>
                </div>

                {filteredTherapists.map((item) => (
                  <article key={item.id} style={{ 
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)', 
                    border: '1px solid rgba(168, 85, 247, 0.3)', 
                    borderRadius: 22, 
                    padding: 16
                  }}>
                    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{ fontSize: 10, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>{item.type}</span>
                        <h4 style={{ fontSize: 15, fontWeight: 800, margin: '2px 0 4px 0', color: '#fff' }}>{item.name}</h4>
                      </div>
                      <span style={{ fontSize: 10, background: 'rgba(16, 185, 129, 0.18)', color: '#34d399', padding: '3px 10px', borderRadius: 9999, fontWeight: 800 }}>
                        {item.cost}
                      </span>
                    </header>

                    <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.45, margin: '6px 0' }}>{item.desc}</p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#94a3b8', margin: '4px 0 12px 0' }}>
                      <MapPin size={13} color="#f59e0b" />
                      <span>{item.location}</span>
                    </div>

                    <footer style={{ display: 'flex', gap: 8 }}>
                      <a 
                        href={`tel:${item.phone}`}
                        style={{
                          flex: 1,
                          background: 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)',
                          color: '#fff',
                          textDecoration: 'none',
                          padding: '9px 12px',
                          borderRadius: 9999,
                          fontSize: 11,
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6
                        }}>
                        <Phone size={13} /> Call {item.phone}
                      </a>

                      <a 
                        href={item.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.18)',
                          color: '#38bdf8',
                          textDecoration: 'none',
                          padding: '9px 14px',
                          borderRadius: 9999,
                          fontSize: 11,
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}>
                        <Compass size={13} /> Map
                      </a>
                    </footer>
                  </article>
                ))}
              </div>
            )}

            {therapySubView === 'chat' && (
              <article style={{ 
                background: 'linear-gradient(135deg, rgba(21, 10, 46, 0.95) 0%, rgba(11, 4, 28, 0.98) 100%)', 
                border: '1px solid rgba(255,255,255,0.18)', 
                borderRadius: 24, 
                padding: 16, 
                display: 'flex', 
                flexDirection: 'column', 
                height: 360
              }}>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 4 }}>
                  {chatMessages.map((m, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', 
                        maxWidth: '85%',
                        background: m.sender === 'user' ? 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)' : 'rgba(255,255,255,0.08)',
                        padding: '10px 14px',
                        borderRadius: m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        fontSize: 12,
                        lineHeight: 1.45,
                        color: '#fff',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
                      }}>
                      {m.text}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.08)', scrollbarWidth: 'none' }}>
                  {['Feeling stressed', 'School pressure', 'Find me a counsellor', 'Emergency help'].map(chip => (
                    <button
                      key={chip}
                      onClick={() => {
                        if (chip === 'Emergency help') {
                          setShowHelpModal(true);
                        } else if (chip === 'Find me a counsellor') {
                          setTherapySubView('therapists');
                        } else {
                          sendChatMessage(chip);
                        }
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.18)',
                        borderRadius: 9999,
                        color: '#e9d5ff',
                        fontSize: 11,
                        padding: '6px 14px',
                        whiteSpace: 'nowrap',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}>
                      {chip}
                    </button>
                  ))}
                </div>

                <footer style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  <input 
                    type="text" 
                    placeholder="Type a message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 9999,
                      padding: '10px 16px',
                      color: '#fff',
                      fontSize: 12,
                      outline: 'none'
                    }}
                  />
                  <button 
                    onClick={() => sendChatMessage()}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 9999,
                      background: 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      cursor: 'pointer'
                    }}>
                    <Send size={15} />
                  </button>
                </footer>
              </article>
            )}
          </section>
        )}

        {/* 2.5 DAILY STORIES VIEW */}
        {activeTab === 'daily' && (
          <section aria-label="Daily Guidance Stories" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>FREE4ALL Daily</h2>
                <p style={{ fontSize: 12, color: '#c084fc', margin: '2px 0 0 0' }}>Showing stories for Age {ageBand || 'All'}</p>
              </div>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>{filteredArticles.length} stories</span>
            </div>

            {selectedArticle ? (
              <article style={{ 
                background: 'linear-gradient(135deg, rgba(21, 10, 46, 0.95) 0%, rgba(11, 4, 28, 0.98) 100%)', 
                border: '1px solid rgba(255,255,255,0.18)', 
                borderRadius: 24, 
                padding: 18
              }}>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  style={{ background: 'none', border: 'none', color: '#c084fc', fontSize: 12, fontWeight: 700, marginBottom: 12, padding: 0, cursor: 'pointer' }}>
                  ← Back to articles
                </button>
                <span style={{ fontSize: 10, color: '#c084fc', fontWeight: 800, textTransform: 'uppercase' }}>
                  {selectedArticle.category} • {selectedArticle.readTime}
                </span>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: '6px 0 10px 0' }}>{selectedArticle.title}</h3>
                <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.55 }}>{selectedArticle.description}</p>

                <div style={{ background: 'rgba(255,255,255,0.05)', padding: 14, borderRadius: 18, margin: '14px 0' }}>
                  <h4 style={{ fontSize: 13, color: '#f59e0b', fontWeight: 800, marginBottom: 6, margin: '0 0 6px 0' }}>What does this mean for me?</h4>
                  <ul style={{ paddingLeft: 18, fontSize: 12, color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: 6, margin: 0 }}>
                    {selectedArticle.meaningPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ borderLeft: '3px solid #10b981', paddingLeft: 12 }}>
                  <span style={{ fontSize: 11, color: '#10b981', fontWeight: 800 }}>YOUR CHALLENGE</span>
                  <p style={{ fontSize: 12, color: '#e2e8f0', marginTop: 2, margin: 0 }}>{selectedArticle.challenge}</p>
                </div>
              </article>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filteredArticles.map(art => (
                  <article
                    key={art.id}
                    onClick={() => setSelectedArticle(art)}
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)', 
                      border: '1px solid rgba(255,255,255,0.16)', 
                      borderRadius: 20, 
                      padding: 16, 
                      cursor: 'pointer'
                    }}>
                    <span style={{ fontSize: 10, color: '#c084fc', fontWeight: 800 }}>{art.category} • {art.readTime}</span>
                    <h4 style={{ fontSize: 14, fontWeight: 800, margin: '4px 0' }}>{art.title}</h4>
                    <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.45, margin: 0 }}>{art.description}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 2.6 DECIDE & THE DAILY DILEMMA VIEW */}
        {activeTab === 'think-twice' && (
          <section aria-label="Decide and Daily Dilemma" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <header>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Decide & Reflect</h2>
              <p style={{ fontSize: 12, color: '#c084fc', margin: '2px 0 0 0' }}>Real choices, peer consensus, and consequence checks.</p>
            </header>

            {/* DAILY DILEMMA POLL ARTICLE */}
            <article style={{
              background: 'linear-gradient(135deg, rgba(31, 8, 64, 0.9) 0%, rgba(17, 3, 38, 0.95) 100%)',
              border: '1.5px solid rgba(168, 85, 247, 0.45)',
              borderRadius: 26,
              padding: 20,
              boxShadow: '0 20px 50px rgba(121, 40, 202, 0.35), inset 0 1px 0 rgba(255,255,255,0.3)',
              backdropFilter: 'blur(24px)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Zap size={16} color="#f59e0b" />
                  <span style={{ fontSize: 11, fontWeight: 900, color: '#f59e0b', letterSpacing: 0.8, textTransform: 'uppercase' }}>
                    {currentDilemma.dateLabel}
                  </span>
                </div>
                <span style={{ fontSize: 10, background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245,158,11,0.4)', color: '#fbbf24', padding: '3px 10px', borderRadius: 9999, fontWeight: 800 }}>
                  Blind Peer Poll
                </span>
              </div>

              <span style={{ fontSize: 11, color: '#c084fc', fontWeight: 800, display: 'block', marginTop: 8 }}>
                Topic: {currentDilemma.category}
              </span>

              <p style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.5, marginTop: 6 }}>
                "{currentDilemma.scenario}"
              </p>

              <h4 style={{ fontSize: 13, fontWeight: 800, color: '#fff', margin: '12px 0 10px 0' }}>
                👉 {currentDilemma.question}
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {currentDilemma.options.map((opt) => {
                  const isUserChoice = votedDilemmas[currentDilemma.id] === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => !hasVotedCurrent && handleVoteDilemma(currentDilemma.id, opt.id)}
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 16,
                        background: hasVotedCurrent 
                          ? (isUserChoice ? 'rgba(168, 85, 247, 0.35)' : 'rgba(255, 255, 255, 0.05)')
                          : 'rgba(255, 255, 255, 0.08)',
                        border: isUserChoice ? '1.5px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.16)',
                        padding: '13px 16px',
                        cursor: hasVotedCurrent ? 'default' : 'pointer',
                        transition: 'all 0.2s ease'
                      }}>
                      {hasVotedCurrent && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            width: `${opt.basePct}%`,
                            background: isUserChoice 
                              ? 'linear-gradient(90deg, rgba(168, 85, 247, 0.5), rgba(56, 189, 248, 0.5))' 
                              : 'rgba(255, 255, 255, 0.08)',
                            zIndex: 1
                          }}
                        />
                      )}

                      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, fontWeight: isUserChoice ? 800 : 600, color: '#fff', paddingRight: 8 }}>
                          {opt.text} {isUserChoice && " (Your Choice)"}
                        </span>

                        {hasVotedCurrent && (
                          <span style={{ fontSize: 13, fontWeight: 900, color: isUserChoice ? '#38bdf8' : '#cbd5e1' }}>
                            {opt.basePct}%
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {hasVotedCurrent ? (
                <div style={{ marginTop: 14, padding: '12px 14px', background: 'rgba(16, 185, 129, 0.15)', borderLeft: '3px solid #10b981', borderRadius: 12 }}>
                  <p style={{ fontSize: 11, color: '#a7f3d0', margin: 0, lineHeight: 1.45, fontWeight: 600 }}>
                    <strong>Peer Consensus:</strong> {currentDilemma.breakdownNote}
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 11, color: '#94a3b8' }}>
                  <Vote size={14} color="#a855f7" />
                  <span>Tap an answer to cast your vote and reveal what KZN peers chose.</span>
                </div>
              )}

              <footer style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <button
                  onClick={() => setSelectedDilemmaIndex((prev) => (prev === 0 ? 1 : 0))}
                  style={{ background: 'none', border: 'none', color: '#c084fc', fontSize: 11, fontWeight: 800, cursor: 'pointer', padding: 0 }}>
                  Switch to {selectedDilemmaIndex === 0 ? "Yesterday's Flashback" : "Today's Dilemma"} →
                </button>
              </footer>
            </article>

            {/* THINK TWICE SCENARIOS ARTICLE */}
            <article style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h3 style={{ fontSize: 12, color: '#f59e0b', fontWeight: 900, margin: '6px 0 0 0', textTransform: 'uppercase', letterSpacing: 0.6 }}>
                Think Twice: Consequence Checker
              </h3>

              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none' }}>
                {THINK_TWICE_SCENARIOS.map((sc, index) => (
                  <button
                    key={sc.id}
                    onClick={() => setSelectedScenario(sc)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 9999,
                      fontSize: 11,
                      fontWeight: 800,
                      background: selectedScenario.id === sc.id ? 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)' : 'rgba(255,255,255,0.06)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.18)',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer'
                    }}>
                    Scenario 0{index + 1}
                  </button>
                ))}
              </div>

              <div style={{ 
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)', 
                border: '1px solid rgba(255,255,255,0.18)', 
                borderRadius: 24, 
                padding: 18
              }}>
                <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 900 }}>SITUATION</span>
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: '4px 0 10px 0' }}>{selectedScenario.title}</h3>
                <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.45 }}>{selectedScenario.situation}</p>

                <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '14px 0' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
                  <div>
                    <strong style={{ color: '#94a3b8' }}>Why are you tempted?</strong>
                    <p style={{ color: '#cbd5e1', marginTop: 2, margin: 0 }}>{selectedScenario.why}</p>
                  </div>
                  <div>
                    <strong style={{ color: '#38bdf8' }}>Immediate (Now):</strong>
                    <p style={{ color: '#cbd5e1', marginTop: 2, margin: 0 }}>{selectedScenario.now}</p>
                  </div>
                  <div>
                    <strong style={{ color: '#f59e0b' }}>Later on:</strong>
                    <p style={{ color: '#cbd5e1', marginTop: 2, margin: 0 }}>{selectedScenario.later}</p>
                  </div>
                  <div style={{ background: 'rgba(244,63,94,0.12)', padding: 12, borderRadius: 14, borderLeft: '3px solid #f43f5e' }}>
                    <strong style={{ color: '#f43f5e' }}>Impact on Future Me:</strong>
                    <p style={{ color: '#fecdd3', marginTop: 2, margin: 0 }}>{selectedScenario.future}</p>
                  </div>
                </div>
              </div>
            </article>
          </section>
        )}

        {/* 2.7 MONEY ZONE VIEW */}
        {activeTab === 'money' && (
          <section aria-label="Money Zone ZAR Budget" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <header>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Money Zone</h2>
              <p style={{ fontSize: 12, color: '#c084fc', margin: '2px 0 0 0' }}>Interactive South African Rand (ZAR) budget simulator.</p>
            </header>

            <nav aria-label="Budget Presets" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none' }}>
              {BUDGET_PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => applyBudgetPreset(p)}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    padding: '8px 14px',
                    borderRadius: 9999,
                    color: '#e9d5ff',
                    fontSize: 11,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}>
                  ⚡ {p.name}
                </button>
              ))}
            </nav>

            <article style={{ 
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)', 
              border: '1px solid rgba(255,255,255,0.18)', 
              borderRadius: 24, 
              padding: 18
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#c084fc', fontWeight: 700 }}>Monthly Income (Rand)</span>
                <input 
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', color: '#10b981', padding: '6px 14px', borderRadius: 9999, width: 110, textAlign: 'right', fontWeight: 900, fontSize: 15 }}
                />
              </div>

              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.keys(budget).map((cat) => (
                  <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, textTransform: 'capitalize', color: '#cbd5e1' }}>{cat}</span>
                    <input 
                      type="number" 
                      value={budget[cat]} 
                      onChange={(e) => setBudget({ ...budget, [cat]: Number(e.target.value) })}
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '6px 12px', borderRadius: 9999, width: 90, textAlign: 'right', fontSize: 13 }}
                    />
                  </div>
                ))}
              </div>

              <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '14px 0' }} />
              <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: 14 }}>Remaining Balance:</span>
                <span style={{ fontWeight: 900, fontSize: 17, color: remaining >= 0 ? '#10b981' : '#f43f5e' }}>
                  R {remaining.toLocaleString()}
                </span>
              </footer>
            </article>
          </section>
        )}

        {/* 2.8 FUTURE ME GOALS VIEW */}
        {activeTab === 'future-me' && (
          <section aria-label="Future Me Goals" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <header>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Future Me: My Goals</h2>
              <p style={{ fontSize: 12, color: '#c084fc', margin: '2px 0 0 0' }}>Build the person you want to become through daily consistency.</p>
            </header>

            <form onSubmit={(e) => { e.preventDefault(); addGoal(); }} style={{ display: 'flex', gap: 8 }}>
              <input 
                type="text" 
                placeholder="What skill or goal are you building?"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                style={{ flex: 1, padding: '12px 18px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 9999, color: '#fff', fontSize: 13, outline: 'none' }}
              />
              <button type="submit" style={{ background: 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)', color: '#fff', border: 'none', padding: '0 18px', borderRadius: 9999, fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
                Add
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {goals.map((g) => (
                <article key={g.id} style={{ 
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)', 
                  border: '1px solid rgba(255,255,255,0.18)', 
                  borderRadius: 20, 
                  padding: 16
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{g.title}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button 
                        onClick={() => updateGoalProgress(g.id, -10)} 
                        style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: 'none', borderRadius: 6, width: 24, height: 24, fontSize: 12, cursor: 'pointer' }}>
                        -
                      </button>
                      <button 
                        onClick={() => updateGoalProgress(g.id, 10)} 
                        style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: 'none', borderRadius: 6, width: 24, height: 24, fontSize: 12, cursor: 'pointer' }}>
                        +
                      </button>
                      <span style={{ fontSize: 12, color: '#c084fc', fontWeight: 800, minWidth: 36, textAlign: 'right' }}>{g.progress}%</span>
                      <button 
                        onClick={() => deleteGoal(g.id)} 
                        style={{ background: 'none', border: 'none', color: '#64748b', marginLeft: 4, cursor: 'pointer' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 9999, overflow: 'hidden' }}>
                    <div style={{ width: `${g.progress}%`, height: '100%', background: 'linear-gradient(90deg, #7928ca, #38bdf8)' }} />
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 3. SEMANTIC FOOTER LANDMARK (OUTSIDE MAIN) */}
      <footer style={{
        maxWidth: '480px',
        margin: '0 auto',
        marginTop: 28,
        paddingTop: 20,
        paddingBottom: 90,
        paddingLeft: '16px',
        paddingRight: '16px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.9 }}>
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.5, color: '#fff' }}>
            NEXT<span style={{ color: '#a855f7' }}>GEN</span>
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#c084fc' }}>© 2026</span>
        </div>

        <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
          by Indaba Men's Corner • All rights reserved
        </p>

        <p style={{ fontSize: 10, color: '#64748b', maxWidth: 280, margin: 0, lineHeight: 1.4 }}>
          Learn from yesterday. Understand today. Build tomorrow.
        </p>
      </footer>

      {/* 4. FLOATING CURVED NAVIGATION BAR */}
      <nav aria-label="Bottom Global Navigation" style={{
        position: 'fixed',
        bottom: 14,
        left: 16,
        right: 16,
        maxWidth: 448,
        margin: '0 auto',
        height: 66,
        background: 'linear-gradient(135deg, rgba(25, 11, 52, 0.88) 0%, rgba(13, 5, 33, 0.92) 100%)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255,255,255,0.22)',
        borderRadius: 9999,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 50,
        boxShadow: '0 20px 50px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.35)'
      }}>
        {[
          { tab: 'home', icon: Home, label: 'Home' },
          { tab: 'friends-chat', icon: MessageSquare, label: 'Chat' },
          { tab: 'therapy', icon: HeartHandshake, label: 'Therapy' },
          { tab: 'think-twice', icon: Compass, label: 'Decide' },
          { tab: 'money', icon: DollarSign, label: 'Money' },
          { tab: 'future-me', icon: Sparkles, label: 'Future' }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              style={{
                background: 'none',
                border: 'none',
                color: isActive ? '#fff' : '#64748b',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                fontSize: 9,
                fontWeight: isActive ? 800 : 500,
                cursor: 'pointer'
              }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: 9999,
                background: isActive 
                  ? 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)' 
                  : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isActive ? '0 4px 18px rgba(168,85,247,0.5), inset 0 1px 0 rgba(255,255,255,0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}>
                <Icon size={17} color={isActive ? '#fff' : '#94a3b8'} />
              </div>
              <span style={{ color: isActive ? '#c084fc' : '#94a3b8' }}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 5. MODALS & OVERLAYS */}
      {showSosSetupModal && (
        <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, background: 'rgba(5, 1, 18, 0.96)', zIndex: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(20px)' }}>
          <div style={{ background: '#150a2e', border: '2px solid #ef4444', padding: 22, borderRadius: 26, maxWidth: 400, width: '100%', boxShadow: '0 16px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Radio size={20} color="#ef4444" />
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: '#fff' }}>Set Family SOS Contact</h3>
              </div>
              <X size={18} onClick={() => setShowSosSetupModal(false)} style={{ cursor: 'pointer', color: '#94a3b8' }} />
            </div>

            <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.45, marginTop: 8 }}>
              When you tap the <strong>red SOS button</strong>, the app will instantly generate your <strong>live GPS pin</strong> and prepare a dispatch message to this person.
            </p>

            <form onSubmit={handleSaveFamilyContact} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: '#c084fc', fontWeight: 700 }}>Contact Name (e.g. Mom, Dad, Sibling, Uncle)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Mom"
                  value={tempFamilyName}
                  onChange={(e) => setTempFamilyName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box', marginTop: 4 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, color: '#c084fc', fontWeight: 700 }}>Mobile Number (SMS / WhatsApp)</label>
                <input 
                  type="tel" 
                  placeholder="e.g. 082 123 4567"
                  value={tempFamilyPhone}
                  onChange={(e) => setTempFamilyPhone(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box', marginTop: 4 }}
                />
              </div>

              <button 
                type="submit"
                style={{ width: '100%', marginTop: 6, padding: '11px', background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)', border: 'none', borderRadius: 9999, color: '#fff', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(220,38,38,0.4)' }}>
                Save SOS Contact
              </button>
            </form>
          </div>
        </div>
      )}

      {showAgeOnboarding && (
        <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, background: 'rgba(5, 1, 18, 0.98)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(30px)' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(25, 10, 52, 0.95) 0%, rgba(12, 4, 30, 0.98) 100%)', border: '1px solid rgba(168, 85, 247, 0.4)', padding: 26, borderRadius: 30, maxWidth: 400, width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(121, 40, 202, 0.5), inset 0 1px 0 rgba(255,255,255,0.3)' }}>
            <div style={{ width: 50, height: 50, borderRadius: 9999, background: 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px auto', boxShadow: '0 6px 20px rgba(168,85,247,0.4)' }}>
              <UserCheck size={26} color="#fff" />
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: 0 }}>Welcome to NextGen 👋</h2>
            <p style={{ fontSize: 12, color: '#c084fc', marginTop: 4, fontWeight: 700 }}>by Indaba Men's Corner</p>
            
            <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.55, margin: '14px 0 18px 0' }}>
              To ensure all guidance, learning, and opportunities fit you best, please select your age group:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { band: '9-12', label: 'Age 9–12', desc: 'Kids & Early Youth' },
                { band: '13-15', label: 'Age 13–15', desc: 'Young Teens (Subject Choices & Focus)' },
                { band: '16-17', label: 'Age 16–17', desc: 'Older Teens (Matric & Future Me)' },
                { band: '18-25', label: 'Age 18–25', desc: 'Young Adults (Careers & Opportunities)' }
              ].map((item) => (
                <button
                  key={item.band}
                  onClick={() => handleSelectAgeGroup(item.band)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(168, 85, 247, 0.28)',
                    padding: '13px 18px',
                    borderRadius: 18,
                    color: '#fff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)'
                  }}>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{item.label}</h4>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0 0' }}>{item.desc}</p>
                  </div>
                  <ChevronRight size={16} color="#a855f7" />
                </button>
              ))}
            </div>

            <p style={{ fontSize: 10, color: '#64748b', marginTop: 16, margin: '16px 0 0 0' }}>
              NextGen is built safe for young people. Minors do not have public profiles. You can change this anytime from the ⋮ menu.
            </p>
          </div>
        </div>
      )}

      {showThenNowModal && (
        <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(25, 10, 52, 0.95) 0%, rgba(12, 4, 30, 0.98) 100%)', border: '1px solid #f59e0b', padding: 22, borderRadius: 26, maxWidth: 420, width: '100%', maxHeight: '80vh', overflowY: 'auto', backdropFilter: 'blur(30px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={20} color="#f59e0b" />
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>Then → Now → Next</h3>
              </div>
              <X size={18} onClick={() => setShowThenNowModal(false)} style={{ cursor: 'pointer', color: '#94a3b8' }} />
            </div>

            <p style={{ fontSize: 12, color: '#c084fc', marginBottom: 14 }}>
              Explore generational wisdom, lessons from the past, today's world, and ideas for the future.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {THEN_NOW_NEXT_DATA.map((t) => (
                <article key={t.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 8px 0', color: '#fff' }}>{t.title}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                    <p style={{ margin: 0 }}><strong style={{ color: '#f59e0b' }}>THEN:</strong> {t.then}</p>
                    <p style={{ margin: 0 }}><strong style={{ color: '#38bdf8' }}>NOW:</strong> {t.now}</p>
                    <p style={{ margin: 0 }}><strong style={{ color: '#10b981' }}>NEXT:</strong> {t.next}</p>
                  </div>
                </article>
              ))}
            </div>

            <button 
              onClick={() => setShowThenNowModal(false)}
              style={{ width: '100%', marginTop: 14, padding: '11px', background: 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)', border: 'none', borderRadius: 9999, color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {showOppsModal && (
        <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(25, 10, 52, 0.95) 0%, rgba(12, 4, 30, 0.98) 100%)', border: '1px solid #38bdf8', padding: 22, borderRadius: 26, maxWidth: 420, width: '100%', maxHeight: '80vh', overflowY: 'auto', backdropFilter: 'blur(30px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Briefcase size={20} color="#38bdf8" />
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>Youth Opportunities</h3>
              </div>
              <X size={18} onClick={() => setShowOppsModal(false)} style={{ cursor: 'pointer', color: '#94a3b8' }} />
            </div>

            <p style={{ fontSize: 12, color: '#c084fc', marginBottom: 14 }}>
              Discover verified bursaries, internships, learnerships, and digital-skills programmes across KwaZulu-Natal and South Africa.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {OPPORTUNITIES_DATA.map(opp => (
                <article key={opp.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 10, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>{opp.category}</span>
                    <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700 }}>{opp.stipend}</span>
                  </header>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: '4px 0 2px 0' }}>{opp.title}</h4>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{opp.org} • {opp.location} • Age {opp.age}</p>
                  <p style={{ fontSize: 12, color: '#cbd5e1', marginTop: 6, margin: 0 }}>{opp.desc}</p>
                </article>
              ))}
            </div>

            <button 
              onClick={() => setShowOppsModal(false)}
              style={{ width: '100%', marginTop: 14, padding: '11px', background: '#334155', border: 'none', borderRadius: 9999, color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {showParentsModal && (
        <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(25, 10, 52, 0.95) 0%, rgba(12, 4, 30, 0.98) 100%)', border: '1px solid #eab308', padding: 22, borderRadius: 26, maxWidth: 400, width: '100%', backdropFilter: 'blur(30px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={20} color="#eab308" />
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>For Parents & Guardians</h3>
              </div>
              <X size={18} onClick={() => setShowParentsModal(false)} style={{ cursor: 'pointer', color: '#94a3b8' }} />
            </div>

            <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.55, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p>
                <strong>Age-Aware Architecture:</strong> NextGen is designed with different age groups in mind (9–12, 13–15, 16–17, 18–25). Content and experiences are presented in an age-appropriate way.
              </p>
              <p>
                <strong>Safety First:</strong> Minors do not have public profiles, open messaging with strangers, or public data listings. Safety and responsible use remain central to everything we build.
              </p>
              <p>
                <strong>Guidance & Support:</strong> We encourage young people to involve parents, teachers, and trusted adults when making critical life and career decisions.
              </p>
            </div>

            <button 
              onClick={() => setShowParentsModal(false)}
              style={{ width: '100%', marginTop: 14, padding: '11px', background: '#334155', border: 'none', borderRadius: 9999, color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
              Understood
            </button>
          </div>
        </div>
      )}

      {showAboutModal && (
        <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(25, 10, 52, 0.95) 0%, rgba(12, 4, 30, 0.98) 100%)', border: '1px solid #a855f7', padding: 22, borderRadius: 26, maxWidth: 400, width: '100%', backdropFilter: 'blur(30px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Info size={20} color="#38bdf8" />
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>About NextGen</h3>
              </div>
              <X size={18} onClick={() => setShowAboutModal(false)} style={{ cursor: 'pointer', color: '#94a3b8' }} />
            </div>

            <p style={{ fontSize: 12, color: '#c084fc', marginTop: 6, fontWeight: 700 }}>by Indaba Men's Corner</p>
            
            <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5, marginTop: 12 }}>
              Learn more about the NextGen mission, vision, and the young people the platform is designed to support across KwaZulu-Natal and South Africa.
            </p>

            <div style={{ background: 'rgba(255,255,255,0.04)', padding: 12, borderRadius: 16, margin: '12px 0', fontSize: 12, color: '#cbd5e1' }}>
              <p style={{ margin: '0 0 6px 0' }}><strong style={{ color: '#f59e0b' }}>THEN:</strong> Learn from previous generations.</p>
              <p style={{ margin: '0 0 6px 0' }}><strong style={{ color: '#38bdf8' }}>NOW:</strong> Understand today's digital world.</p>
              <p style={{ margin: 0 }}><strong style={{ color: '#10b981' }}>NEXT:</strong> Build the skills and mindset for tomorrow.</p>
            </div>

            <button 
              onClick={() => setShowAboutModal(false)}
              style={{ width: '100%', marginTop: 12, padding: '11px', background: 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)', border: 'none', borderRadius: 9999, color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {showContactModal && (
        <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(25, 10, 52, 0.95) 0%, rgba(12, 4, 30, 0.98) 100%)', border: '1px solid #a855f7', padding: 22, borderRadius: 26, maxWidth: 400, width: '100%', backdropFilter: 'blur(30px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Mail size={20} color="#a855f7" />
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>Contact Us</h3>
              </div>
              <X size={18} onClick={() => setShowContactModal(false)} style={{ cursor: 'pointer', color: '#94a3b8' }} />
            </div>

            <p style={{ fontSize: 12, color: '#cbd5e1', marginTop: 8 }}>
              Get in touch with the NextGen team for questions, suggestions, support, or partnership opportunities.
            </p>

            <a 
              href="tel:0815325916" 
              style={{ 
                background: 'rgba(56, 189, 248, 0.15)', 
                border: '1px solid #38bdf8', 
                padding: '11px 16px', 
                borderRadius: 14, 
                color: '#38bdf8', 
                textDecoration: 'none', 
                fontSize: 13, 
                fontWeight: 800, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 8,
                marginTop: 10
              }}>
              <Phone size={16} /> 📱 Call / WhatsApp: 081 532 5916
            </a>

            {contactSent ? (
              <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', padding: 14, borderRadius: 16, marginTop: 14, textAlign: 'center' }}>
                <CheckCircle2 size={24} color="#10b981" style={{ margin: '0 auto 6px auto' }} />
                <p style={{ fontSize: 13, color: '#10b981', fontWeight: 800, margin: 0 }}>Message sent successfully!</p>
                <p style={{ fontSize: 11, color: '#cbd5e1', marginTop: 4 }}>We appreciate you connecting with us.</p>
              </div>
            ) : (
              <form onSubmit={handleSendContact} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                <input 
                  type="text" 
                  placeholder="Your Name / Nickname"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  style={{ width: '100%', padding: '11px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, color: '#fff', fontSize: 12, outline: 'none', boxSizing: 'border-box' }}
                />
                <textarea 
                  rows="3"
                  placeholder="Your feedback, question, or story..."
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  required
                  style={{ width: '100%', padding: '11px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, color: '#fff', fontSize: 12, outline: 'none', boxSizing: 'border-box', resize: 'none' }}
                />
                <button 
                  type="submit"
                  style={{ width: '100%', padding: '11px', background: 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)', border: 'none', borderRadius: 9999, color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
                  Send Message
                </button>
              </form>
            )}

            <footer style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 11, color: '#94a3b8' }}>
              <strong>Need Help?</strong> Use Contact Us or call <strong>081 532 5916</strong>.<br/>
              📧 Email: info@indabamenscorner.co.za
            </footer>
          </div>
        </div>
      )}

      {showPrivacyModal && (
        <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(25, 10, 52, 0.95) 0%, rgba(12, 4, 30, 0.98) 100%)', border: '1px solid #10b981', padding: 22, borderRadius: 26, maxWidth: 400, width: '100%', backdropFilter: 'blur(30px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={20} color="#10b981" />
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>Privacy & Safety Policy</h3>
              </div>
              <X size={18} onClick={() => setShowPrivacyModal(false)} style={{ cursor: 'pointer', color: '#94a3b8' }} />
            </div>

            <p style={{ fontSize: 12, color: '#cbd5e1', marginTop: 8 }}>
              Learn how NextGen protects young users, handles information responsibly, and promotes a safe, age-appropriate digital environment.
            </p>

            <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.55, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p>🔒 <strong>Zero Public Minors Directory:</strong> NextGen does not expose youth profiles, contact details, or location.</p>
              <p>🛡️ <strong>No Stranger Matching:</strong> We do not offer open direct messaging between strangers. Minors only chat with saved device contacts.</p>
              <p>📱 <strong>Local Confidentiality:</strong> Your reflections, journal entries, and chats are stored locally on your device.</p>
              <p>🆘 <strong>Ethical AI Guardrails:</strong> Our reflection tools do not diagnose or replace human psychologists or emergency healthcare.</p>
            </div>

            <button 
              onClick={() => setShowPrivacyModal(false)}
              style={{ width: '100%', marginTop: 14, padding: '11px', background: '#334155', border: 'none', borderRadius: 9999, color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
              I Understand
            </button>
          </div>
        </div>
      )}

      {showHelpModal && (
        <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, background: 'rgba(5, 1, 18, 0.95)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(30px)' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(25, 10, 52, 0.95) 0%, rgba(12, 4, 30, 0.98) 100%)', border: '2px solid #ef4444', padding: 22, borderRadius: 28, maxWidth: 440, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldAlert size={22} color="#ef4444" />
                <h3 style={{ color: '#ef4444', fontSize: 18, fontWeight: 900, margin: 0 }}>GET HELP & EMERGENCY</h3>
              </div>
              <X size={20} onClick={() => setShowHelpModal(false)} style={{ cursor: 'pointer', color: '#94a3b8' }} />
            </div>

            <article style={{ background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)', borderRadius: 18, padding: 16, marginBottom: 14, border: '1px solid rgba(255,255,255,0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Siren size={18} color="#fff" />
                <span style={{ fontSize: 11, fontWeight: 900, color: '#fff', letterSpacing: 0.5 }}>IMMEDIATE DANGER? CALL POLICE / EMS:</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <a 
                  href="tel:112"
                  style={{
                    flex: 1,
                    background: '#fff',
                    color: '#991b1b',
                    padding: '11px 8px',
                    borderRadius: 14,
                    textDecoration: 'none',
                    fontWeight: 900,
                    fontSize: 14,
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}>
                  <Phone size={14} /> 112 (Cell SOS)
                </a>

                <a 
                  href="tel:10111"
                  style={{
                    flex: 1,
                    background: 'rgba(30, 41, 59, 0.85)',
                    color: '#38bdf8',
                    border: '1px solid #38bdf8',
                    padding: '11px 8px',
                    borderRadius: 14,
                    textDecoration: 'none',
                    fontWeight: 900,
                    fontSize: 14,
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}>
                  <Phone size={14} /> 10111 (Police)
                </a>
              </div>
            </article>

            <nav aria-label="Crisis Categories" style={{ margin: '0 0 8px 0' }}>
              <p style={{ fontSize: 11, color: '#c084fc', fontWeight: 800, margin: '0 0 8px 0' }}>WHAT KIND OF HELP DO YOU NEED?</p>
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
                {[
                  { key: 'all', label: 'All Contacts' },
                  { key: 'sos', label: '🚨 SOS / Police' },
                  { key: 'child', label: '🧒 Child / Youth' },
                  { key: 'mental', label: '🧠 Mental / Suicide' },
                  { key: 'gbv', label: '🛡️ GBV Abuse' }
                ].map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setHelpCategory(cat.key)}
                    style={{
                      background: helpCategory === cat.key ? 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)' : 'rgba(255,255,255,0.06)',
                      color: '#fff',
                      border: '1px solid ' + (helpCategory === cat.key ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)'),
                      padding: '7px 14px',
                      borderRadius: 9999,
                      fontSize: 11,
                      fontWeight: 800,
                      whiteSpace: 'nowrap',
                      cursor: 'pointer'
                    }}>
                    {cat.label}
                  </button>
                ))}
              </div>
            </nav>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {filteredEmergencyServices.map(srv => (
                <article key={srv.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 10, background: `${srv.badgeColor}22`, color: srv.badgeColor, padding: '3px 10px', borderRadius: 9999, fontWeight: 800, border: `1px solid ${srv.badgeColor}44` }}>
                      {srv.tag}
                    </span>
                    <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700 }}>
                      {srv.tollFree ? 'Toll-Free (Free)' : 'Standard Rates'}
                    </span>
                  </header>

                  <h4 style={{ fontSize: 14, fontWeight: 800, margin: '6px 0 2px 0', color: '#fff' }}>{srv.name}</h4>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, lineHeight: 1.45 }}>{srv.desc}</p>

                  <footer style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                    <a 
                      href={`tel:${srv.phone}`}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)',
                        color: '#fff',
                        textDecoration: 'none',
                        padding: '9px 10px',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 800,
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6
                      }}>
                      <Phone size={13} /> Call {srv.phone}
                    </a>

                    {srv.ussd && (
                      <a 
                        href={`tel:${encodeURIComponent(srv.ussd)}`}
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          color: '#38bdf8',
                          textDecoration: 'none',
                          padding: '9px 12px',
                          borderRadius: 12,
                          fontSize: 11,
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}>
                        USSD {srv.ussd}
                      </a>
                    )}
                  </footer>
                </article>
              ))}
            </div>

            <button 
              onClick={() => setShowHelpModal(false)}
              style={{ width: '100%', marginTop: 14, padding: '11px', background: '#334155', border: 'none', borderRadius: 9999, color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
              Close Help Navigator
            </button>
          </div>
        </div>
      )}
    </>
  );
}

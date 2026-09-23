import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Home, BookOpen, Clock, AlertTriangle, HeartHandshake, 
  Target, DollarSign, Cpu, Briefcase, HelpCircle, 
  Search, ShieldAlert, ChevronRight, CheckCircle2, ArrowRight, 
  X, MessageSquare, Plus, Trash2, Send, ExternalLink, Sparkles,
  RefreshCw, Award, Check, MoreVertical, Info, Mail, ShieldCheck, Phone, Users, UserCheck,
  MapPin, Compass, AlertOctagon, Siren, Flame, Radio, UserPlus, MessageCircle, Contact, Download
} from 'lucide-react';
import { Preferences } from '@capacitor/preferences';
import { Geolocation } from '@capacitor/geolocation';
import { Contacts } from '@capacitor-community/contacts';

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
// SEED CONTENT & ARCHITECTURE (KZN REFINED)
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

// REFINED KZN & NATIONAL YOUTH OPPORTUNITIES
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

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  
  // AGE ONBOARDING STATE
  const [ageBand, setAgeBand] = useState(null);
  const [showAgeOnboarding, setShowAgeOnboarding] = useState(false);

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
        } catch {
          storedAge = localStorage.getItem('nextgen_ageband_v1');
          storedGoals = localStorage.getItem('nextgen_goals_v1');
          storedMood = localStorage.getItem('nextgen_mood_v1');
          storedStreak = localStorage.getItem('nextgen_streak_v1');
          storedFam = localStorage.getItem('nextgen_family_sos_v1');
          storedChats = localStorage.getItem('nextgen_friend_chats_v1');
        }

        if (storedAge) {
          setAgeBand(storedAge);
          setShowAgeOnboarding(false);
        } else {
          setShowAgeOnboarding(true);
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

  const handleSelectAgeGroup = async (selected) => {
    setAgeBand(selected);
    setShowAgeOnboarding(false);
    try {
      await Preferences.set({ key: 'nextgen_ageband_v1', value: selected });
    } catch {
      localStorage.setItem('nextgen_ageband_v1', selected);
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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a041a',
      color: '#fff',
      paddingTop: 'max(env(safe-area-inset-top), 24px)',
      paddingBottom: '140px',
      paddingLeft: '16px',
      paddingRight: '16px',
      maxWidth: '480px',
      margin: '0 auto',
      position: 'relative',
      boxSizing: 'border-box'
    }}>
      {/* 1. HEADER */}
      <header style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, color: '#fff' }}>
                NEXT<span style={{ color: '#a855f7' }}>GEN</span>
              </span>
              <span style={{ fontSize: 10, background: 'rgba(168, 85, 247, 0.25)', color: '#c084fc', padding: '2px 8px', borderRadius: 9999, fontWeight: 700 }}>
                V1
              </span>
            </div>
            <p style={{ fontSize: 11, color: '#c084fc', margin: 0 }}>by Indaba Men's Corner</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* RED FAMILY SOS BUTTON */}
            <button 
              onClick={triggerFamilySos}
              title="Send SOS with Live GPS Location"
              style={{ 
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)', 
                color: '#fff', 
                border: '2px solid #fecaca', 
                padding: '7px 11px', 
                borderRadius: 9999, 
                fontSize: 11, 
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                boxShadow: '0 0 16px rgba(220, 38, 38, 0.65)',
                cursor: 'pointer'
              }}>
              <Radio size={14} /> SOS
            </button>

            {/* GET HELP TRIGGER */}
            <button 
              onClick={() => { setShowHelpModal(true); setHelpCategory('all'); }}
              style={{ 
                background: 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)', 
                color: '#fff', 
                border: 'none', 
                padding: '7px 11px', 
                borderRadius: 9999, 
                fontSize: 11, 
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                cursor: 'pointer'
              }}>
              <ShieldAlert size={14} /> HELP
            </button>

            {/* Toolmenu Trigger */}
            <div style={{ position: 'relative' }} ref={toolMenuRef}>
              <button
                onClick={() => setShowToolMenu(!showToolMenu)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#c084fc',
                  width: 36,
                  height: 36,
                  borderRadius: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                <MoreVertical size={18} />
              </button>

              {/* Toolmenu Dropdown */}
              {showToolMenu && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: 250,
                  background: '#150a2e',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: 18,
                  padding: '6px',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.7)',
                  zIndex: 100,
                  backdropFilter: 'blur(20px)'
                }}>
                  {/* Friends Chat Navigation */}
                  <div 
                    onClick={() => { setActiveTab('friends-chat'); setShowToolMenu(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, cursor: 'pointer', background: 'rgba(16,185,129,0.12)' }}>
                    <MessageCircle size={16} color="#10b981" />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#10b981', margin: 0 }}>Free Friends Chat</p>
                      <span style={{ fontSize: 10, color: '#a7f3d0' }}>Youth messaging for contacts</span>
                    </div>
                  </div>

                  {/* Family SOS Setting */}
                  <div 
                    onClick={() => { setShowSosSetupModal(true); setShowToolMenu(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, cursor: 'pointer', background: 'rgba(239,68,68,0.12)', marginTop: 2 }}>
                    <Radio size={16} color="#ef4444" />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', margin: 0 }}>Family SOS Contact</p>
                      <span style={{ fontSize: 10, color: '#fca5a5' }}>{familyContact.phone ? `${familyContact.name} (${familyContact.phone})` : 'Tap to set contact'}</span>
                    </div>
                  </div>

                  {/* Change Age Group */}
                  <div 
                    onClick={() => { setShowAgeOnboarding(true); setShowToolMenu(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, cursor: 'pointer', background: 'rgba(168,85,247,0.1)', marginTop: 2 }}>
                    <UserCheck size={16} color="#c084fc" />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#c084fc', margin: 0 }}>Age Group: {ageBand || 'Set'}</p>
                      <span style={{ fontSize: 10, color: '#cbd5e1' }}>Change your content level</span>
                    </div>
                  </div>

                  <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '4px 6px' }} />

                  {/* Then Now Next */}
                  <div 
                    onClick={() => { setShowThenNowModal(true); setShowToolMenu(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, cursor: 'pointer', background: 'rgba(255,255,255,0.02)' }}>
                    <Clock size={16} color="#f59e0b" />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>Then → Now → Next</p>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>Generational wisdom</span>
                    </div>
                  </div>

                  {/* Opportunities */}
                  <div 
                    onClick={() => { setShowOppsModal(true); setShowToolMenu(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, cursor: 'pointer', background: 'rgba(255,255,255,0.02)', marginTop: 2 }}>
                    <Briefcase size={16} color="#38bdf8" />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>Youth Opportunities</p>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>Bursaries, TVET & skills</span>
                    </div>
                  </div>

                  {/* Parents, Guardians & Young People */}
                  <div 
                    onClick={() => { setShowParentsModal(true); setShowToolMenu(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, cursor: 'pointer', background: 'rgba(255,255,255,0.02)', marginTop: 2 }}>
                    <Users size={16} color="#eab308" />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>Parents & Guardians</p>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>Age-appropriate safety</span>
                    </div>
                  </div>

                  <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '4px 6px' }} />

                  {/* About */}
                  <div 
                    onClick={() => { setShowAboutModal(true); setShowToolMenu(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, cursor: 'pointer', background: 'rgba(255,255,255,0.02)' }}>
                    <Info size={16} color="#a855f7" />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>About NextGen</p>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>Vision & mission</span>
                    </div>
                  </div>

                  {/* Contact */}
                  <div 
                    onClick={() => { setShowContactModal(true); setShowToolMenu(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, cursor: 'pointer', background: 'rgba(255,255,255,0.02)', marginTop: 2 }}>
                    <Mail size={16} color="#ec4899" />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>Contact Us</p>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>081 532 5916 & support</span>
                    </div>
                  </div>

                  {/* Privacy & Safety */}
                  <div 
                    onClick={() => { setShowPrivacyModal(true); setShowToolMenu(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, cursor: 'pointer', background: 'rgba(255,255,255,0.02)', marginTop: 2 }}>
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

        {/* SOS STATUS NOTIFICATION BANNER */}
        {sosStatus && (
          <div style={{ background: '#b91c1c', padding: '8px 12px', borderRadius: 12, fontSize: 12, fontWeight: 700, textAlign: 'center', color: '#fff', marginBottom: 8 }}>
            🚨 {sosStatus}
          </div>
        )}

        <p style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 500, marginTop: 6, opacity: 0.9 }}>
          Learn from yesterday. Understand today. Build tomorrow.
        </p>

        {/* 2. UNIVERSAL SEARCH BOX */}
        <div style={{ position: 'relative', marginTop: 12 }}>
          <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#c084fc' }} />
          <input
            type="text"
            placeholder="Search KZN bursaries, skills, topics, advice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 18px 12px 44px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 9999,
              color: '#fff',
              fontSize: 13,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          {searchQuery && (
            <X 
              size={16} 
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#c084fc', cursor: 'pointer' }}
            />
          )}
        </div>

        {/* Search Results Dropdown Overlay */}
        {searchResults && (
          <div style={{ background: '#170b33', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: 16, marginTop: 8, padding: 8 }}>
            <p style={{ fontSize: 11, color: '#c084fc', padding: '4px 8px', margin: 0 }}>RESULTS ({searchResults.length})</p>
            {searchResults.length === 0 ? (
              <p style={{ fontSize: 13, color: '#94a3b8', padding: '8px', margin: 0 }}>No matches found for "{searchQuery}".</p>
            ) : (
              searchResults.map((res, i) => (
                <div 
                  key={i} 
                  onClick={() => { res.action(); setSearchQuery(''); }}
                  style={{ padding: '8px 12px', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', marginBottom: 4 }}>
                  <div>
                    <span style={{ fontSize: 10, color: '#38bdf8', textTransform: 'uppercase', fontWeight: 700 }}>{res.type}</span>
                    <p style={{ fontSize: 13, color: '#fff', margin: 0 }}>{res.title}</p>
                  </div>
                  <ChevronRight size={14} color="#c084fc" />
                </div>
              ))
            )}
          </div>
        )}
      </header>

      {/* 3. MAIN ROUTING */}
      <main style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* VIEW 1: HOME */}
        {activeTab === 'home' && (
          <>
            {/* SIGNATURE CARD: WILL THIS HELP FUTURE ME? */}
            <div style={{ 
              background: 'linear-gradient(135deg, #2e0854 0%, #17042f 100%)', 
              padding: 18, 
              borderRadius: 22, 
              border: '1px solid rgba(168, 85, 247, 0.35)',
              boxShadow: '0 8px 24px rgba(121, 40, 202, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={14} color="#c084fc" />
                <span style={{ fontSize: 10, fontWeight: 800, color: '#c084fc', letterSpacing: 0.5 }}>DECISION FILTER</span>
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: '6px 0 6px 0', color: '#fff' }}>Will this decision help Future Me?</h2>
              <p style={{ fontSize: 12, color: '#e2e8f0', lineHeight: 1.4, opacity: 0.9 }}>
                Before you make a move today, pause and picture where it leaves you tomorrow.
              </p>
              
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
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
                      padding: '8px 4px',
                      borderRadius: 9999,
                      border: 'none',
                      fontSize: 11,
                      fontWeight: 700,
                      background: futureMeChoice?.val === item.val ? '#fff' : 'rgba(255,255,255,0.1)',
                      color: futureMeChoice?.val === item.val ? '#120926' : '#fff',
                      cursor: 'pointer'
                    }}>
                    {item.label}
                  </button>
                ))}
              </div>

              {futureMeChoice && (
                <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: 12, borderLeft: '3px solid #38bdf8' }}>
                  <p style={{ fontSize: 12, color: '#38bdf8', margin: 0, fontWeight: 600 }}>{futureMeChoice.feedback}</p>
                </div>
              )}
            </div>

            {/* QUICK FRIENDS CHAT BANNER */}
            <div 
              onClick={() => setActiveTab('friends-chat')}
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.1) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: 18,
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageCircle size={20} color="#fff" />
                </div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#fff' }}>Free Friends Chat</h4>
                  <p style={{ fontSize: 11, color: '#a7f3d0', margin: 0 }}>Connect with friends using NextGen</p>
                </div>
              </div>
              <ChevronRight size={18} color="#10b981" />
            </div>

            {/* 30-DAY HABIT STREAK CARD */}
            <div style={{ background: '#150a2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 800 }}>30-DAY CHALLENGE</span>
                <h4 style={{ fontSize: 14, fontWeight: 700, margin: '2px 0' }}>Daily Focus Streak</h4>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>🔥 {habitStreak} days in a row</p>
              </div>

              <button
                onClick={handleHabitCheckIn}
                style={{
                  background: completedToday ? '#10b981' : 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 14px',
                  borderRadius: 9999,
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  cursor: 'pointer'
                }}>
                {completedToday ? <><Check size={14} /> Done</> : '+ Check In'}
              </button>
            </div>

            {/* HORIZONTAL MOOD CHIP CAROUSEL */}
            <div>
              <p style={{ fontSize: 12, color: '#c084fc', fontWeight: 600, marginBottom: 8 }}>How are you feeling right now?</p>
              <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6 }}>
                {[
                  { label: 'Happy', emoji: '😊' },
                  { label: 'Calm', emoji: '🌿' },
                  { label: 'Stressed', emoji: '⚡' },
                  { label: 'Overwhelmed', emoji: '🌪️' },
                  { label: 'I need help', emoji: '🆘' }
                ].map((m) => (
                  <div
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
                      minWidth: 94,
                      padding: '12px 10px',
                      borderRadius: 18,
                      background: checkedInMood === m.label ? 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)' : 'rgba(255,255,255,0.06)',
                      border: '1px solid ' + (checkedInMood === m.label ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)'),
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                      flexShrink: 0
                    }}>
                    <span style={{ fontSize: 22 }}>{m.emoji}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{m.label}</span>
                  </div>
                ))}
              </div>

              {showGrounding && (
                <div style={{ background: '#1c1038', border: '1px solid #a855f7', borderRadius: 16, padding: 14, marginTop: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#38bdf8' }}>5-4-3-2-1 GROUNDING TECHNIQUE</span>
                    <X size={16} onClick={() => setShowGrounding(false)} style={{ cursor: 'pointer', color: '#94a3b8' }} />
                  </div>
                  <p style={{ fontSize: 12, color: '#cbd5e1', marginTop: 6, lineHeight: 1.4 }}>
                    Pause for 60 seconds and look around you:<br/>
                    👁️ <strong>5 things</strong> you can see around the room<br/>
                    ✋ <strong>4 things</strong> you can physically touch<br/>
                    👂 <strong>3 sounds</strong> you can hear<br/>
                    👃 <strong>2 scents</strong> you can smell<br/>
                    🌟 <strong>1 thing</strong> you appreciate about yourself today
                  </p>
                </div>
              )}
            </div>

            {/* CORE ACTION TILES */}
            <h3 style={{ fontSize: 12, color: '#c084fc', textTransform: 'uppercase', letterSpacing: 0.5, margin: '4px 0 0 0' }}>Daily Focus</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { title: 'FREE4ALL Daily', icon: BookOpen, tab: 'daily', desc: 'Today\'s youth news' },
                { title: 'Think Twice', icon: AlertTriangle, tab: 'think-twice', desc: 'Consequence checker' },
                { title: 'Money Zone', icon: DollarSign, tab: 'money', desc: 'Rand budget simulator' },
                { title: 'Therapy Corner', icon: HeartHandshake, tab: 'therapy', desc: 'Local therapists & chat' }
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.tab}
                    onClick={() => setActiveTab(item.tab)}
                    style={{
                      background: '#150a2e',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 18,
                      padding: 14,
                      cursor: 'pointer'
                    }}>
                    <div style={{ width: 34, height: 34, borderRadius: 12, background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconComponent size={18} color="#c084fc" />
                    </div>
                    <h4 style={{ fontSize: 13, fontWeight: 700, marginTop: 8, marginBottom: 2 }}>{item.title}</h4>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* VIEW 2: FRIENDS CHAT */}
        {activeTab === 'friends-chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Friends Chat</h2>
                <p style={{ fontSize: 12, color: '#10b981', margin: '2px 0 0 0' }}>Data-Free Style Youth Messaging</p>
              </div>
              <button
                onClick={loadDeviceContacts}
                style={{
                  background: 'rgba(16,185,129,0.15)',
                  border: '1px solid #10b981',
                  color: '#10b981',
                  padding: '6px 12px',
                  borderRadius: 9999,
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  cursor: 'pointer'
                }}>
                <Contact size={14} /> Sync Contacts
              </button>
            </div>

            {selectedFriend ? (
              <div style={{ background: '#150a2e', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', height: 380 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9999, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
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
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 0' }}>
                  {(friendChats[selectedFriend.id] || []).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px 10px', color: '#94a3b8', fontSize: 12 }}>
                      🔒 Messages with {selectedFriend.name} are stored locally. Say sawubona!
                    </div>
                  ) : (
                    (friendChats[selectedFriend.id] || []).map((msg) => (
                      <div 
                        key={msg.id}
                        style={{
                          alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                          maxWidth: '80%',
                          background: msg.sender === 'me' ? '#059669' : 'rgba(255,255,255,0.08)',
                          padding: '8px 12px',
                          borderRadius: 14,
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

                <div style={{ display: 'flex', gap: 6, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <input
                    type="text"
                    placeholder="Type message..."
                    value={friendMsgInput}
                    onChange={(e) => setFriendMsgInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendFriendMessage()}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 9999,
                      padding: '10px 14px',
                      color: '#fff',
                      fontSize: 12,
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={sendFriendMessage}
                    style={{
                      width: 38,
                      height: 38,
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
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {deviceContacts.length === 0 ? (
                  <div style={{ background: '#150a2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 20, textAlign: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 9999, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto' }}>
                      <Contact size={22} color="#10b981" />
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px 0' }}>Chat With Friends</h3>
                    <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.4, margin: '0 0 14px 0' }}>
                      NextGen matches you with people in your phone contacts so teens stay safe from strangers.
                    </p>
                    <button
                      onClick={loadDeviceContacts}
                      disabled={isLoadingContacts}
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: 9999,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}>
                      {isLoadingContacts ? 'Syncing...' : 'Find Friends in Contacts'}
                    </button>
                  </div>
                ) : (
                  deviceContacts.map((friend) => (
                    <div
                      key={friend.id}
                      onClick={() => setSelectedFriend(friend)}
                      style={{
                        background: '#150a2e',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 16,
                        padding: '12px 14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9999, background: 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                          {friend.name[0]}
                        </div>
                        <div>
                          <h4 style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>{friend.name}</h4>
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>{friend.phone}</span>
                        </div>
                      </div>
                      <ChevronRight size={16} color="#10b981" />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: THERAPY CORNER */}
        {activeTab === 'therapy' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Therapy Corner</h2>
              <p style={{ fontSize: 12, color: '#c084fc', margin: '2px 0 0 0' }}>Pause. Talk. Refocus. Move Forward.</p>
            </div>

            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', padding: 4, borderRadius: 9999, border: '1px solid rgba(255,255,255,0.1)' }}>
              <button
                onClick={() => setTherapySubView('therapists')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
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
                  padding: '8px 12px',
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
            </div>

            {therapySubView === 'therapists' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>Verified Support Services in KZN & SA</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button 
                      onClick={() => setTherapyFilter('all')}
                      style={{ background: therapyFilter === 'all' ? '#a855f7' : 'rgba(255,255,255,0.06)', border: 'none', color: '#fff', fontSize: 10, padding: '4px 8px', borderRadius: 9999 }}>
                      All
                    </button>
                    <button 
                      onClick={() => setTherapyFilter('free')}
                      style={{ background: therapyFilter === 'free' ? '#10b981' : 'rgba(255,255,255,0.06)', border: 'none', color: '#fff', fontSize: 10, padding: '4px 8px', borderRadius: 9999 }}>
                      100% Free
                    </button>
                  </div>
                </div>

                {filteredTherapists.map((item) => (
                  <div key={item.id} style={{ background: '#150a2e', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: 18, padding: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{ fontSize: 10, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>{item.type}</span>
                        <h4 style={{ fontSize: 15, fontWeight: 700, margin: '2px 0 4px 0', color: '#fff' }}>{item.name}</h4>
                      </div>
                      <span style={{ fontSize: 10, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '3px 8px', borderRadius: 9999, fontWeight: 700 }}>
                        {item.cost}
                      </span>
                    </div>

                    <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.4, margin: '6px 0' }}>{item.desc}</p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#94a3b8', margin: '4px 0 10px 0' }}>
                      <MapPin size={13} color="#f59e0b" />
                      <span>{item.location}</span>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <a 
                        href={`tel:${item.phone}`}
                        style={{
                          flex: 1,
                          background: 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)',
                          color: '#fff',
                          textDecoration: 'none',
                          padding: '8px 12px',
                          borderRadius: 9999,
                          fontSize: 11,
                          fontWeight: 700,
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
                          color: '#38bdf8',
                          textDecoration: 'none',
                          padding: '8px 14px',
                          borderRadius: 9999,
                          fontSize: 11,
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}>
                        <Compass size={13} /> View Map
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {therapySubView === 'chat' && (
              <div style={{ background: '#150a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', height: 340 }}>
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
                        lineHeight: 1.4,
                        color: '#fff'
                      }}>
                      {m.text}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
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
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: 9999,
                        color: '#c084fc',
                        fontSize: 11,
                        padding: '5px 12px',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer'
                      }}>
                      {chip}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  <input 
                    type="text" 
                    placeholder="Type a message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
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
                      width: 38,
                      height: 38,
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
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: DAILY */}
        {activeTab === 'daily' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>FREE4ALL Daily</h2>
                <p style={{ fontSize: 12, color: '#c084fc', margin: '2px 0 0 0' }}>Showing stories for Age {ageBand || 'All'}</p>
              </div>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>{filteredArticles.length} stories</span>
            </div>

            {selectedArticle ? (
              <div style={{ background: '#150a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 16 }}>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  style={{ background: 'none', border: 'none', color: '#c084fc', fontSize: 12, fontWeight: 700, marginBottom: 12, padding: 0, cursor: 'pointer' }}>
                  ← Back to articles
                </button>
                <span style={{ fontSize: 10, color: '#c084fc', fontWeight: 800, textTransform: 'uppercase' }}>
                  {selectedArticle.category} • {selectedArticle.readTime}
                </span>
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: '6px 0 10px 0' }}>{selectedArticle.title}</h3>
                <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>{selectedArticle.description}</p>

                <div style={{ background: 'rgba(255,255,255,0.05)', padding: 14, borderRadius: 16, margin: '14px 0' }}>
                  <h4 style={{ fontSize: 13, color: '#f59e0b', fontWeight: 700, marginBottom: 6, margin: '0 0 6px 0' }}>What does this mean for me?</h4>
                  <ul style={{ paddingLeft: 18, fontSize: 12, color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: 6, margin: 0 }}>
                    {selectedArticle.meaningPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ borderLeft: '3px solid #10b981', paddingLeft: 10 }}>
                  <span style={{ fontSize: 11, color: '#10b981', fontWeight: 800 }}>YOUR CHALLENGE</span>
                  <p style={{ fontSize: 12, color: '#e2e8f0', marginTop: 2, margin: 0 }}>{selectedArticle.challenge}</p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filteredArticles.map(art => (
                  <div
                    key={art.id}
                    onClick={() => setSelectedArticle(art)}
                    style={{ background: '#150a2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 14, cursor: 'pointer' }}>
                    <span style={{ fontSize: 10, color: '#c084fc', fontWeight: 700 }}>{art.category} • {art.readTime}</span>
                    <h4 style={{ fontSize: 14, fontWeight: 700, margin: '4px 0' }}>{art.title}</h4>
                    <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.4, margin: 0 }}>{art.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: THINK TWICE */}
        {activeTab === 'think-twice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Think Twice</h2>
            <p style={{ fontSize: 12, color: '#c084fc', margin: '2px 0 0 0' }}>Pause. Question. Understand consequences before acting.</p>

            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
              {THINK_TWICE_SCENARIOS.map((sc, index) => (
                <button
                  key={sc.id}
                  onClick={() => setSelectedScenario(sc)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 9999,
                    fontSize: 11,
                    fontWeight: 700,
                    background: selectedScenario.id === sc.id ? 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)' : 'rgba(255,255,255,0.06)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}>
                  Scenario 0{index + 1}
                </button>
              ))}
            </div>

            <div style={{ background: '#150a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 16 }}>
              <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 800 }}>SITUATION</span>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: '4px 0 10px 0' }}>{selectedScenario.title}</h3>
              <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.4 }}>{selectedScenario.situation}</p>

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
                <div style={{ background: 'rgba(244,63,94,0.1)', padding: 10, borderRadius: 12, borderLeft: '3px solid #f43f5e' }}>
                  <strong style={{ color: '#f43f5e' }}>Impact on Future Me:</strong>
                  <p style={{ color: '#fecdd3', marginTop: 2, margin: 0 }}>{selectedScenario.future}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: MONEY ZONE */}
        {activeTab === 'money' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Money Zone</h2>
            <p style={{ fontSize: 12, color: '#c084fc', margin: '2px 0 0 0' }}>Interactive South African Rand (ZAR) budget simulator.</p>

            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
              {BUDGET_PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => applyBudgetPreset(p)}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    padding: '6px 12px',
                    borderRadius: 9999,
                    color: '#c084fc',
                    fontSize: 11,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}>
                  ⚡ {p.name}
                </button>
              ))}
            </div>

            <div style={{ background: '#150a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#c084fc' }}>Monthly Income (Rand)</span>
                <input 
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#10b981', padding: '6px 12px', borderRadius: 9999, width: 110, textAlign: 'right', fontWeight: 800, fontSize: 15 }}
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
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 10px', borderRadius: 9999, width: 90, textAlign: 'right', fontSize: 13 }}
                    />
                  </div>
                ))}
              </div>

              <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '14px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Remaining Balance:</span>
                <span style={{ fontWeight: 800, fontSize: 16, color: remaining >= 0 ? '#10b981' : '#f43f5e' }}>
                  R {remaining.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 7: FUTURE ME */}
        {activeTab === 'future-me' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Future Me: My Goals</h2>
            <p style={{ fontSize: 12, color: '#c084fc', margin: '2px 0 0 0' }}>Build the person you want to become through daily consistency.</p>

            <div style={{ display: 'flex', gap: 8 }}>
              <input 
                type="text" 
                placeholder="What skill or goal are you building?"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                style={{ flex: 1, padding: '10px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9999, color: '#fff', fontSize: 13, outline: 'none' }}
              />
              <button onClick={addGoal} style={{ background: 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)', color: '#fff', border: 'none', padding: '0 16px', borderRadius: 9999, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                Add
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {goals.map((g) => (
                <div key={g.id} style={{ background: '#150a2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{g.title}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button 
                        onClick={() => updateGoalProgress(g.id, -10)} 
                        style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: 4, width: 22, height: 22, fontSize: 12, cursor: 'pointer' }}>
                        -
                      </button>
                      <button 
                        onClick={() => updateGoalProgress(g.id, 10)} 
                        style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: 4, width: 22, height: 22, fontSize: 12, cursor: 'pointer' }}>
                        +
                      </button>
                      <span style={{ fontSize: 12, color: '#c084fc', fontWeight: 700, minWidth: 36, textAlign: 'right' }}>{g.progress}%</span>
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
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. FOOTER */}
        <footer style={{
          marginTop: 28,
          paddingTop: 20,
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
      </main>

      {/* MODAL: FAMILY SOS CONTACT */}
      {showSosSetupModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5, 1, 18, 0.96)', zIndex: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(20px)' }}>
          <div style={{ background: '#150a2e', border: '2px solid #ef4444', padding: 22, borderRadius: 24, maxWidth: 400, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Radio size={20} color="#ef4444" />
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: '#fff' }}>Set Family SOS Contact</h3>
              </div>
              <X size={18} onClick={() => setShowSosSetupModal(false)} style={{ cursor: 'pointer', color: '#94a3b8' }} />
            </div>

            <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.4, marginTop: 8 }}>
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
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box', marginTop: 4 }}
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
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box', marginTop: 4 }}
                />
              </div>

              <button 
                type="submit"
                style={{ width: '100%', marginTop: 6, padding: '11px', background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)', border: 'none', borderRadius: 9999, color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
                Save SOS Contact
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 0: FIRST-TIME AGE SELECTION ONBOARDING GATE */}
      {showAgeOnboarding && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5, 1, 18, 0.98)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(20px)' }}>
          <div style={{ background: '#150a2e', border: '1px solid #a855f7', padding: 24, borderRadius: 28, maxWidth: 400, width: '100%', textAlign: 'center', boxShadow: '0 16px 40px rgba(121, 40, 202, 0.4)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 9999, background: 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
              <UserCheck size={24} color="#fff" />
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>Welcome to NextGen 👋</h2>
            <p style={{ fontSize: 12, color: '#c084fc', marginTop: 4, fontWeight: 600 }}>by Indaba Men's Corner</p>
            
            <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5, margin: '14px 0 18px 0' }}>
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
                    border: '1px solid rgba(168, 85, 247, 0.25)',
                    padding: '12px 16px',
                    borderRadius: 16,
                    color: '#fff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
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

      {/* MODAL 1: THEN NOW NEXT */}
      {showThenNowModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#150a2e', border: '1px solid #f59e0b', padding: 20, borderRadius: 24, maxWidth: 420, width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
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
                <div key={t.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 12 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 8px 0', color: '#fff' }}>{t.title}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                    <p style={{ margin: 0 }}><strong style={{ color: '#f59e0b' }}>THEN:</strong> {t.then}</p>
                    <p style={{ margin: 0 }}><strong style={{ color: '#38bdf8' }}>NOW:</strong> {t.now}</p>
                    <p style={{ margin: 0 }}><strong style={{ color: '#10b981' }}>NEXT:</strong> {t.next}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setShowThenNowModal(false)}
              style={{ width: '100%', marginTop: 14, padding: '10px', background: 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)', border: 'none', borderRadius: 9999, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: YOUTH OPPORTUNITIES (ENRICHED WITH KZN BURSARIES) */}
      {showOppsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#150a2e', border: '1px solid #38bdf8', padding: 20, borderRadius: 24, maxWidth: 420, width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
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
                <div key={opp.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 10, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>{opp.category}</span>
                    <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700 }}>{opp.stipend}</span>
                  </div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: '4px 0 2px 0' }}>{opp.title}</h4>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{opp.org} • {opp.location} • Age {opp.age}</p>
                  <p style={{ fontSize: 12, color: '#cbd5e1', marginTop: 6, margin: 0 }}>{opp.desc}</p>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setShowOppsModal(false)}
              style={{ width: '100%', marginTop: 14, padding: '10px', background: '#334155', border: 'none', borderRadius: 9999, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: PARENTS & GUARDIANS */}
      {showParentsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#150a2e', border: '1px solid #eab308', padding: 22, borderRadius: 24, maxWidth: 400, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={20} color="#eab308" />
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>For Parents & Guardians</h3>
              </div>
              <X size={18} onClick={() => setShowParentsModal(false)} style={{ cursor: 'pointer', color: '#94a3b8' }} />
            </div>

            <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
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
              style={{ width: '100%', marginTop: 14, padding: '10px', background: '#334155', border: 'none', borderRadius: 9999, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
              Understood
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4: ABOUT NEXTGEN */}
      {showAboutModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#150a2e', border: '1px solid #a855f7', padding: 22, borderRadius: 24, maxWidth: 400, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Info size={20} color="#38bdf8" />
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>About NextGen</h3>
              </div>
              <X size={18} onClick={() => setShowAboutModal(false)} style={{ cursor: 'pointer', color: '#94a3b8' }} />
            </div>

            <p style={{ fontSize: 12, color: '#c084fc', marginTop: 6, fontWeight: 600 }}>by Indaba Men's Corner</p>
            
            <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5, marginTop: 12 }}>
              Learn more about the NextGen mission, vision, and the young people the platform is designed to support across KwaZulu-Natal and South Africa.
            </p>

            <div style={{ background: 'rgba(255,255,255,0.04)', padding: 12, borderRadius: 14, margin: '12px 0', fontSize: 12, color: '#cbd5e1' }}>
              <p style={{ margin: '0 0 6px 0' }}><strong style={{ color: '#f59e0b' }}>THEN:</strong> Learn from previous generations.</p>
              <p style={{ margin: '0 0 6px 0' }}><strong style={{ color: '#38bdf8' }}>NOW:</strong> Understand today's digital world.</p>
              <p style={{ margin: 0 }}><strong style={{ color: '#10b981' }}>NEXT:</strong> Build the skills and mindset for tomorrow.</p>
            </div>

            <button 
              onClick={() => setShowAboutModal(false)}
              style={{ width: '100%', marginTop: 12, padding: '10px', background: 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)', border: 'none', borderRadius: 9999, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL 5: CONTACT US */}
      {showContactModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#150a2e', border: '1px solid #a855f7', padding: 22, borderRadius: 24, maxWidth: 400, width: '100%' }}>
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
                background: 'rgba(56, 189, 248, 0.12)', 
                border: '1px solid #38bdf8', 
                padding: '10px 14px', 
                borderRadius: 12, 
                color: '#38bdf8', 
                textDecoration: 'none', 
                fontSize: 13, 
                fontWeight: 700, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 8,
                marginTop: 10
              }}>
              <Phone size={16} /> 📱 Call / WhatsApp: 081 532 5916
            </a>

            {contactSent ? (
              <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', padding: 14, borderRadius: 14, marginTop: 14, textAlign: 'center' }}>
                <CheckCircle2 size={24} color="#10b981" style={{ margin: '0 auto 6px auto' }} />
                <p style={{ fontSize: 13, color: '#10b981', fontWeight: 700, margin: 0 }}>Message sent successfully!</p>
                <p style={{ fontSize: 11, color: '#cbd5e1', marginTop: 4 }}>We appreciate you connecting with us.</p>
              </div>
            ) : (
              <form onSubmit={handleSendContact} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                <input 
                  type="text" 
                  placeholder="Your Name / Nickname"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: '#fff', fontSize: 12, outline: 'none', boxSizing: 'border-box' }}
                />
                <textarea 
                  rows="3"
                  placeholder="Your feedback, question, or story..."
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: '#fff', fontSize: 12, outline: 'none', boxSizing: 'border-box', resize: 'none' }}
                />
                <button 
                  type="submit"
                  style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)', border: 'none', borderRadius: 9999, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                  Send Message
                </button>
              </form>
            )}

            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 11, color: '#94a3b8' }}>
              <strong>Need Help?</strong> Use Contact Us or call <strong>081 532 5916</strong>.<br/>
              📧 Email: info@indabamenscorner.co.za
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: PRIVACY & SAFETY POLICY */}
      {showPrivacyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#150a2e', border: '1px solid #10b981', padding: 22, borderRadius: 24, maxWidth: 400, width: '100%' }}>
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

            <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p>🔒 <strong>Zero Public Minors Directory:</strong> NextGen does not expose youth profiles, contact details, or location.</p>
              <p>🛡️ <strong>No Stranger Matching:</strong> We do not offer open direct messaging between strangers. Minors only chat with saved device contacts.</p>
              <p>📱 <strong>Local Confidentiality:</strong> Your reflections, journal entries, and chats are stored locally on your device.</p>
              <p>🆘 <strong>Ethical AI Guardrails:</strong> Our reflection tools do not diagnose or replace human psychologists or emergency healthcare.</p>
            </div>

            <button 
              onClick={() => setShowPrivacyModal(false)}
              style={{ width: '100%', marginTop: 14, padding: '10px', background: '#334155', border: 'none', borderRadius: 9999, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* MODAL 7: GET HELP & SOS */}
      {showHelpModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5, 1, 18, 0.95)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(20px)' }}>
          <div style={{ background: '#150a2e', border: '2px solid #ef4444', padding: 20, borderRadius: 24, maxWidth: 440, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldAlert size={22} color="#ef4444" />
                <h3 style={{ color: '#ef4444', fontSize: 18, fontWeight: 800, margin: 0 }}>GET HELP & EMERGENCY</h3>
              </div>
              <X size={20} onClick={() => setShowHelpModal(false)} style={{ cursor: 'pointer', color: '#94a3b8' }} />
            </div>

            <div style={{ background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)', borderRadius: 16, padding: 14, marginBottom: 14, border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Siren size={18} color="#fff" />
                <span style={{ fontSize: 11, fontWeight: 900, color: '#fff', letterSpacing: 0.5 }}>IMMEDIATE DANGER? CALL POLICE / EMS:</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <a 
                  href="tel:112"
                  style={{
                    flex: 1,
                    background: '#fff',
                    color: '#991b1b',
                    padding: '10px 8px',
                    borderRadius: 12,
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
                    background: '#1e293b',
                    color: '#38bdf8',
                    border: '1px solid #38bdf8',
                    padding: '10px 8px',
                    borderRadius: 12,
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
            </div>

            <p style={{ fontSize: 11, color: '#c084fc', fontWeight: 700, margin: '0 0 6px 0' }}>WHAT KIND OF HELP DO YOU NEED?</p>
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
                    border: '1px solid ' + (helpCategory === cat.key ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'),
                    padding: '6px 12px',
                    borderRadius: 9999,
                    fontSize: 11,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}>
                  {cat.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {filteredEmergencyServices.map(srv => (
                <div key={srv.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 10, background: `${srv.badgeColor}22`, color: srv.badgeColor, padding: '2px 8px', borderRadius: 9999, fontWeight: 800 }}>
                      {srv.tag}
                    </span>
                    <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700 }}>
                      {srv.tollFree ? 'Toll-Free (Free)' : 'Standard Rates'}
                    </span>
                  </div>

                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: '6px 0 2px 0', color: '#fff' }}>{srv.name}</h4>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>{srv.desc}</p>

                  <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                    <a 
                      href={`tel:${srv.phone}`}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)',
                        color: '#fff',
                        textDecoration: 'none',
                        padding: '8px 10px',
                        borderRadius: 10,
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
                          padding: '8px 12px',
                          borderRadius: 10,
                          fontSize: 11,
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}>
                        USSD {srv.ussd}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setShowHelpModal(false)}
              style={{ width: '100%', marginTop: 14, padding: '10px', background: '#334155', border: 'none', borderRadius: 9999, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
              Close Help Navigator
            </button>
          </div>
        </div>
      )}

      {/* 5. FLOATING CURVED BOTTOM NAVIGATION */}
      <nav style={{
        position: 'fixed',
        bottom: 12,
        left: 16,
        right: 16,
        maxWidth: 448,
        margin: '0 auto',
        height: 62,
        background: 'rgba(18, 9, 38, 0.92)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 9999,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 50,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
      }}>
        {[
          { tab: 'home', icon: Home, label: 'Home' },
          { tab: 'friends-chat', icon: MessageCircle, label: 'Chat' },
          { tab: 'therapy', icon: HeartHandshake, label: 'Therapy' },
          { tab: 'think-twice', icon: AlertTriangle, label: 'Decide' },
          { tab: 'money', icon: DollarSign, label: 'Money' },
          { tab: 'future-me', icon: Target, label: 'Future' }
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
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer'
              }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 9999,
                background: isActive ? 'linear-gradient(135deg, #7928ca 0%, #a855f7 100%)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={16} color={isActive ? '#fff' : '#94a3b8'} />
              </div>
              <span style={{ color: isActive ? '#c084fc' : '#94a3b8' }}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
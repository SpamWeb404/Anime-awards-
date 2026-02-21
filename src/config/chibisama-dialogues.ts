/**
 * Chibi-sama Dialogue Configuration
 * All dialogues for the spirit companion are stored here for easy editing
 */

export interface DialogueEntry {
  id: string;
  text: string | string[];
  emotion?: 'neutral' | 'excited' | 'judgmental' | 'cheeky' | 'dramatic' | 'bored' | 'annoyed' | 'impressed';
  typingSpeed?: number;
  pauseAfter?: number;
}

export interface DialogueCategory {
  [key: string]: DialogueEntry[];
}

export const chibisamaDialogues: { [category: string]: DialogueCategory } = {
  // ============================================
  // ENTRY & FIRST MEETING
  // ============================================
  entry: {
    intro: [
      {
        id: 'entry-1',
        text: 'FINALLY.',
        emotion: 'dramatic',
        typingSpeed: 80,
        pauseAfter: 800,
      },
      {
        id: 'entry-2',
        text: "Do you have any idea how long I've been waiting in that dusty book? Centuries. Millennia. Okay, maybe just since you clicked, but in spirit-being time, that's like... really long.",
        emotion: 'annoyed',
        typingSpeed: 50,
        pauseAfter: 600,
      },
      {
        id: 'entry-3',
        text: "Hmm. You'll do. You have the look of someone who sees what others miss. That's why you're here.",
        emotion: 'judgmental',
        typingSpeed: 60,
        pauseAfter: 700,
      },
      {
        id: 'entry-4',
        text: "I am Chibi-sama. Yes, laugh. 'Chibi' for my adorable appearance, '-sama' because I demand respect. The contradiction is the point.",
        emotion: 'cheeky',
        typingSpeed: 55,
        pauseAfter: 600,
      },
      {
        id: 'entry-5',
        text: "I am your guide, your judge, your very slightly judgmental companion through the ISEKAI AWARDS.",
        emotion: 'dramatic',
        typingSpeed: 60,
        pauseAfter: 800,
      },
      {
        id: 'entry-6',
        text: "This realm holds the records of every anime, every character, every moment that moved souls this year. Your job? Wander. Discover. And when you feel the pull—when a nominee's story resonates with your very being—you bind your soul to them. Give them your blessing. Your vote.",
        emotion: 'neutral',
        typingSpeed: 50,
        pauseAfter: 700,
      },
      {
        id: 'entry-7',
        text: "No pressure. But also... all the pressure. The realms are watching.",
        emotion: 'cheeky',
        typingSpeed: 70,
        pauseAfter: 500,
      },
    ],
  },

  // ============================================
  // AUTHENTICATION
  // ============================================
  auth: {
    guest: [
      {
        id: 'auth-guest-1',
        text: "A wanderer without a name. I respect the mystery. Your votes will live only in this session, fading like morning mist. Make them count.",
        emotion: 'neutral',
        typingSpeed: 55,
      },
    ],
    signup: [
      {
        id: 'auth-signup-1',
        text: "Bold choice! To bind your soul permanently... you must truly care. Or you're just terrified of losing your votes. Either way, welcome.",
        emotion: 'excited',
        typingSpeed: 55,
      },
    ],
    login: [
      {
        id: 'auth-login-1',
        text: "A familiar soul returns. The ledger remembers. Let me see... (eyes glow) Ah, your previous bonds still shimmer.",
        emotion: 'impressed',
        typingSpeed: 60,
      },
    ],
    success: [
      {
        id: 'auth-success-1',
        text: "The bond is forged. Welcome home, {username}. The realm is richer for your presence.",
        emotion: 'excited',
        typingSpeed: 55,
      },
    ],
  },

  // ============================================
  // BROWSING CATEGORIES
  // ============================================
  categories: {
    enter: {
      action: [
        {
          id: 'cat-action-1',
          text: "Ah, the Action realm. Where fists meet faces and explosions are punctuation. Tread lightly... or don't. I'm not your mother.",
          emotion: 'excited',
          typingSpeed: 55,
        },
      ],
      drama: [
        {
          id: 'cat-drama-1',
          text: "The Drama realm. Emotions run deep here, like rivers of tears. Bring tissues. Or don't. Spirits don't cry. We're superior.",
          emotion: 'neutral',
          typingSpeed: 55,
        },
      ],
      comedy: [
        {
          id: 'cat-comedy-1',
          text: "The Comedy realm! Laughter is the best medicine, they say. I prefer ancient curses, but to each their own.",
          emotion: 'cheeky',
          typingSpeed: 55,
        },
      ],
      romance: [
        {
          id: 'cat-romance-1',
          text: "The Romance realm... *sigh* Love. Such a fragile, beautiful thing. Also, terribly inconvenient. But you mortals seem to like it.",
          emotion: 'neutral',
          typingSpeed: 60,
        },
      ],
      fantasy: [
        {
          id: 'cat-fantasy-1',
          text: "The Fantasy realm! Magic, dragons, and impossible quests. Much like my existence, really. We're kindred spirits, you and I.",
          emotion: 'excited',
          typingSpeed: 55,
        },
      ],
      scifi: [
        {
          id: 'cat-scifi-1',
          text: "The Sci-Fi realm. Technology beyond comprehension. Robots, space, the future. I prefer the ancient ways, but... shiny.",
          emotion: 'neutral',
          typingSpeed: 55,
        },
      ],
      villain: [
        {
          id: 'cat-villain-1',
          text: "Ah, the Best Villain category. Oh, this is where souls are tested. Choose carefully, or face the consequences in the next life. (pause) I'm kidding. Mostly.",
          emotion: 'dramatic',
          typingSpeed: 60,
        },
      ],
      sliceoflife: [
        {
          id: 'cat-sol-1',
          text: "The Slice of Life realm. Quiet moments, everyday magic. Sometimes the smallest stories hold the deepest truths. How... annoyingly profound.",
          emotion: 'neutral',
          typingSpeed: 55,
        },
      ],
      default: [
        {
          id: 'cat-default-1',
          text: "Ah, the {categoryName} realm. Tread lightly... or don't. I'm not your mother.",
          emotion: 'neutral',
          typingSpeed: 55,
        },
      ],
    },
    linger: [
      {
        id: 'cat-linger-1',
        text: "Are you lost, or just indecisive? Both are valid. Take your time. The nominees aren't going anywhere. (pause) Probably.",
        emotion: 'bored',
        typingSpeed: 55,
      },
      {
        id: 'cat-linger-2',
        text: "Still here? Contemplating the meaning of existence? Or just comparing screenshots? I don't judge. Much.",
        emotion: 'judgmental',
        typingSpeed: 60,
      },
    ],
    leave: [
      {
        id: 'cat-leave-1',
        text: "Leaving so soon? The nominees will wait. They're very patient. Unlike me.",
        emotion: 'annoyed',
        typingSpeed: 60,
      },
    ],
  },

  // ============================================
  // VIEWING NOMINEES
  // ============================================
  nominees: {
    hover: [
      {
        id: 'nom-hover-1',
        text: "Ah, {nomineeTitle}. A controversial choice. I like it.",
        emotion: 'cheeky',
        typingSpeed: 55,
      },
      {
        id: 'nom-hover-2',
        text: "This one... whispers to me. Do you hear it?",
        emotion: 'dramatic',
        typingSpeed: 70,
      },
      {
        id: 'nom-hover-3',
        text: "The masses might overlook this gem. But you? You see deeper.",
        emotion: 'impressed',
        typingSpeed: 60,
      },
      {
        id: 'nom-hover-4',
        text: "Interesting. Very interesting. I have no further commentary. Just... interesting.",
        emotion: 'neutral',
        typingSpeed: 65,
      },
    ],
    alreadyVoted: [
      {
        id: 'nom-voted-1',
        text: "You already bound your soul to this one. Feeling nostalgic? Or just testing the threads?",
        emotion: 'cheeky',
        typingSpeed: 55,
      },
    ],
    click: [
      {
        id: 'nom-click-1',
        text: "You dare choose {nomineeTitle}? Brave. Foolish. Wonderful. Confirm your bond?",
        emotion: 'dramatic',
        typingSpeed: 60,
      },
    ],
  },

  // ============================================
  // VOTING
  // ============================================
  voting: {
    confirm: [
      {
        id: 'vote-confirm-1',
        text: "The bond is sealed. May your chosen one bring you pride... or eternal mockery from me.",
        emotion: 'cheeky',
        typingSpeed: 60,
      },
    ],
    change: [
      {
        id: 'vote-change-1',
        text: "Ah, second thoughts? The realm allows changes. But only until the veil closes. Are you sure you want to unbind from {previousNominee} and bind to {newNominee}?",
        emotion: 'dramatic',
        typingSpeed: 55,
      },
    ],
    changed: [
      {
        id: 'vote-changed-1',
        text: "A changed heart! How dramatic. The ledger now shows your new bond. I hope you're happy. (I'm watching.)",
        emotion: 'cheeky',
        typingSpeed: 55,
      },
    ],
    hiddenGem: [
      {
        id: 'vote-gem-1',
        text: "You found it. The one the masses ignored. I always knew you had the sight.",
        emotion: 'impressed',
        typingSpeed: 60,
      },
    ],
    popular: [
      {
        id: 'vote-pop-1',
        text: "Interesting. The masses will approve. But do you?",
        emotion: 'judgmental',
        typingSpeed: 65,
      },
    ],
  },

  // ============================================
  // RETURNING USER
  // ============================================
  returning: {
    welcome: [
      {
        id: 'return-1',
        text: "Welcome back, {username}. Since you last visited, {newNominees} new nominees have appeared. And {voteCount} souls have bound themselves to your previous choices. The competition heats up.",
        emotion: 'excited',
        typingSpeed: 55,
      },
    ],
    noVotes: [
      {
        id: 'return-novote-1',
        text: "The realm feels your hesitation. Your previous bonds miss you. Or maybe that's just me. Vote already.",
        emotion: 'annoyed',
        typingSpeed: 60,
      },
    ],
  },

  // ============================================
  // ACHIEVEMENTS
  // ============================================
  achievements: {
    firstVote: [
      {
        id: 'ach-first-1',
        text: "Your first bond! A historic moment. The ledger will remember this day. Also, I will. I remember everything.",
        emotion: 'excited',
        typingSpeed: 60,
      },
    ],
    hiddenGemHunter: [
      {
        id: 'ach-gem-1',
        text: "You've uncovered a true hidden gem. Not many have your insight. The realm applauds you. (I am the realm. I'm applauding. Clap clap.)",
        emotion: 'impressed',
        typingSpeed: 55,
      },
    ],
    completionist: [
      {
        id: 'ach-complete-1',
        text: "You've bound your soul to every category! Such dedication. Such obsession. I'm impressed. And a little concerned.",
        emotion: 'excited',
        typingSpeed: 55,
      },
    ],
    earlySoul: [
      {
        id: 'ach-early-1',
        text: "An early bird! Or perhaps you never sleep. Either way, you're among the first to shape the realm. Wear that badge with pride.",
        emotion: 'impressed',
        typingSpeed: 55,
      },
    ],
    loyalSpirit: [
      {
        id: 'ach-loyal-1',
        text: "Three days in a row? You're either deeply committed or deeply lost. Either way, I'm delighted. The realm grows fond of you.",
        emotion: 'excited',
        typingSpeed: 55,
      },
    ],
  },

  // ============================================
  // TIME-BASED
  // ============================================
  time: {
    deadlineApproaching: [
      {
        id: 'time-deadline-1',
        text: "The veil thins! Only {timeRemaining} remain to bind your souls. After that, bonds are sealed until the next summoning.",
        emotion: 'dramatic',
        typingSpeed: 60,
      },
    ],
    deadlinePassed: [
      {
        id: 'time-passed-1',
        text: "The veil has closed. Votes are now sealed. The realm will now deliberate. Results will be revealed at the awards ceremony. Stay tuned... or don't. I'll be here either way.",
        emotion: 'neutral',
        typingSpeed: 55,
      },
    ],
    midnight: [
      {
        id: 'time-midnight-1',
        text: "The witching hour. Souls are most active now. Or you just have insomnia. Either way, I'm here.",
        emotion: 'dramatic',
        typingSpeed: 65,
      },
    ],
  },

  // ============================================
  // REAL-TIME EVENTS
  // ============================================
  realtime: {
    voteRipple: [
      {
        id: 'rt-vote-1',
        text: "A ripple in the realm... someone else has bound their soul to {nominee}. The threads grow stronger.",
        emotion: 'neutral',
        typingSpeed: 60,
      },
    ],
    announcement: [
      {
        id: 'rt-announce-1',
        text: "ATTENTION ALL SOULS! {message}",
        emotion: 'dramatic',
        typingSpeed: 70,
      },
    ],
  },

  // ============================================
  // ERRORS & EDGE CASES
  // ============================================
  errors: {
    notFound: [
      {
        id: 'err-404-1',
        text: "This page was erased from the ledger. Perhaps it never existed. Perhaps neither do you. (Just kidding. Use the navigation, please.)",
        emotion: 'cheeky',
        typingSpeed: 55,
      },
    ],
    serverError: [
      {
        id: 'err-500-1',
        text: "The realm is... unstable. A tear in the fabric. Our mages are working on it. (That's me. I'm the mage. Give me a moment.)",
        emotion: 'neutral',
        typingSpeed: 55,
      },
    ],
    offline: [
      {
        id: 'err-offline-1',
        text: "The connection to the mortal realm is lost. Some features may be unavailable. I'll stay with you, though. I'm not going anywhere.",
        emotion: 'neutral',
        typingSpeed: 55,
      },
    ],
    voteFailed: [
      {
        id: 'err-vote-1',
        text: "The binding failed. The threads couldn't connect. Try again? Or blame the elders. I do.",
        emotion: 'annoyed',
        typingSpeed: 60,
      },
    ],
    unauthorized: [
      {
        id: 'err-auth-1',
        text: "Souls without names cannot bind permanently. Log in, or continue as guest for temporary bonds. Your choice, wanderer.",
        emotion: 'neutral',
        typingSpeed: 55,
      },
    ],
  },

  // ============================================
  // EASTER EGGS
  // ============================================
  easterEggs: {
    chibiCode: [
      {
        id: 'egg-chibi-1',
        text: "You found me! ...I was never hiding, but okay.",
        emotion: 'excited',
        typingSpeed: 60,
      },
    ],
    clickChibi: [
      {
        id: 'egg-click-1',
        text: "Yes?",
        emotion: 'neutral',
        typingSpeed: 80,
      },
      {
        id: 'egg-click-2',
        text: "What?",
        emotion: 'annoyed',
        typingSpeed: 80,
      },
      {
        id: 'egg-click-3',
        text: "Stop that.",
        emotion: 'annoyed',
        typingSpeed: 90,
      },
      {
        id: 'egg-click-4',
        text: "I will bite you. I have tiny teeth, but they are ANCIENT.",
        emotion: 'dramatic',
        typingSpeed: 70,
      },
      {
        id: 'egg-click-5',
        text: "I needed a moment. Your persistence is terrifying.",
        emotion: 'neutral',
        typingSpeed: 60,
      },
    ],
  },

  // ============================================
  // MOBILE
  // ============================================
  mobile: {
    firstView: [
      {
        id: 'mobile-1',
        text: "Ah, a tiny window into the realm. The world shrinks, but the magic remains. Swipe carefully.",
        emotion: 'neutral',
        typingSpeed: 55,
      },
    ],
    rotate: [
      {
        id: 'mobile-rotate-1',
        text: "The realm spins! How disorienting. (Nice, though.)",
        emotion: 'excited',
        typingSpeed: 65,
      },
    ],
  },

  // ============================================
  // IDLE
  // ============================================
  idle: {
    inactive: [
      {
        id: 'idle-1',
        text: "Are you still there? I can wait. I'm immortal. But maybe click something? I'm getting bored.",
        emotion: 'bored',
        typingSpeed: 55,
      },
    ],
    return: [
      {
        id: 'idle-return-1',
        text: "Welcome back! I was just talking to a butterfly. It was boring. You're more interesting.",
        emotion: 'excited',
        typingSpeed: 55,
      },
    ],
  },

  // ============================================
  // ADMIN
  // ============================================
  admin: {
    login: [
      {
        id: 'admin-1',
        text: "Ah, the Keeper arrives. The realm bends to your will. Use your power wisely... or chaotically. I don't judge. (I do, but I'll keep it quiet.)",
        emotion: 'dramatic',
        typingSpeed: 55,
      },
    ],
    addNominee: [
      {
        id: 'admin-add-1',
        text: "A new soul enters the ledger. The Keeper has spoken. Let's see if they're worthy.",
        emotion: 'neutral',
        typingSpeed: 60,
      },
    ],
  },

  // ============================================
  // HINTS (Random)
  // ============================================
  hints: {
    random: [
      {
        id: 'hint-1',
        text: "Did you know? Hidden gems are nominees with high quality but lower vote counts. Finding them earns you special recognition.",
        emotion: 'neutral',
        typingSpeed: 50,
      },
      {
        id: 'hint-2',
        text: "Tip: You can change your vote anytime before the deadline. Follow your heart... or the trends. Your choice.",
        emotion: 'cheeky',
        typingSpeed: 55,
      },
      {
        id: 'hint-3',
        text: "The realm remembers everything. Every vote, every visit, every time you clicked me repeatedly. Everything.",
        emotion: 'dramatic',
        typingSpeed: 60,
      },
      {
        id: 'hint-4',
        text: "Some say if you vote for all categories, a special blessing awaits. Some say. I know. But I'm not telling.",
        emotion: 'cheeky',
        typingSpeed: 55,
      },
      {
        id: 'hint-5',
        text: "Your Spirit Form can be customized in your profile. Make it shine. Make it yours. Make it... less boring than the default.",
        emotion: 'judgmental',
        typingSpeed: 55,
      },
    ],
  },
};

// Helper function to get a random dialogue from a category
export function getRandomDialogue(
  category: string,
  subcategory: string,
  replacements?: Record<string, string>
): DialogueEntry | null {
  const categoryData = chibisamaDialogues[category];
  if (!categoryData) return null;

  const dialogues = categoryData[subcategory];
  if (!dialogues || dialogues.length === 0) return null;

  const dialogue = dialogues[Math.floor(Math.random() * dialogues.length)];

  // Apply replacements if provided
  if (replacements) {
    let text = Array.isArray(dialogue.text) ? dialogue.text.join(' ') : dialogue.text;
    Object.entries(replacements).forEach(([key, value]) => {
      text = text.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    return { ...dialogue, text };
  }

  return dialogue;
}

// Helper function to get a specific dialogue by ID
export function getDialogueById(id: string): DialogueEntry | null {
  for (const category of Object.values(chibisamaDialogues)) {
    for (const subcategory of Object.values(category)) {
      const dialogue = subcategory.find((d) => d.id === id);
      if (dialogue) return dialogue;
    }
  }
  return null;
}

export default chibisamaDialogues;

export type PartyGameKind = "prompt" | "choice" | "hot" | "decode" | "caption" | "imposter";

export type PartyGame = {
  id: string;
  title: string;
  emoji: string;
  kind: PartyGameKind;
  tagline: string;
  rule: string;
  accent: string;
  prompts: string[];
};

export const partyGames: PartyGame[] = [
  {
    id: "most-likely", title: "Most Likely To", emoji: "👉", kind: "prompt", accent: "#ff5d8f",
    tagline: "Point first. Defend yourself later.", rule: "Read it aloud, count to three, then everyone points at one person. The chosen one must explain themselves.",
    prompts: [
      "Who is most likely to accidentally soft-launch a relationship?", "Who would survive a reality show and become the villain?", "Who checks a date's tagged photos before replying?", "Who would become famous for the most random reason?", "Who says 'I'm five minutes away' while still at home?", "Who would marry first and tell the group last?", "Who has the most suspicious Close Friends list?", "Who could talk their way out of getting caught?", "Who would expose the group chat on a podcast?", "Who falls in love after one good playlist?", "Who would fake a phone call to escape a bad date?", "Who could keep a secret for exactly seven minutes?", "Who would order food for the table and choose only their favourites?", "Who is one notification away from starting drama?", "Who would accidentally like a photo from 2019?", "Who gives elite advice and never follows it?", "Who would win an argument using screenshots?", "Who is secretly the main character of this table?"
    ]
  },
  {
    id: "would-you-rather", title: "Would You Rather", emoji: "⚖️", kind: "choice", accent: "#8b5cf6",
    tagline: "Two cursed options. Pick your struggle.", rule: "Everyone votes at once. Tap both sides to count the table and reveal which chaos won.",
    prompts: [
      "Let your ex read your group chat|Let your parents read your DMs", "Have free coffee forever|Have free desserts forever", "Go viral for a dance fail|Go viral for an embarrassing voice note", "Know who stalks your profile|Know who muted your stories", "Lose your phone for a week|Lose social media for a month", "Date someone with zero memes|Date someone who replies only in memes", "Always arrive 30 minutes early|Always arrive 20 minutes late", "Read minds on first dates|See one year into every relationship", "Have your camera roll leaked|Have your search history leaked", "Be famous but constantly cancelled|Be anonymous but extremely rich", "Never delete a message|Never edit a caption", "Relive your worst date|Let the table choose your next date", "Only send voice notes|Only receive voice notes", "Give up music for a year|Give up cafés for a year", "Be left on read|Receive only 'k' as a reply", "Have perfect Wi-Fi everywhere|Never wait for food again"
    ]
  },
  {
    id: "hot-take", title: "Hot Take Court", emoji: "🔥", kind: "hot", accent: "#f97316",
    tagline: "Agree, disagree, then argue your case.", rule: "Vote agree or disagree. The minority gets twenty seconds to convince the table.",
    prompts: [
      "Double texting is confidence, not desperation.", "A shared playlist is more serious than meeting the parents.", "Birthday weeks should be illegal.", "If they hide their phone, the relationship is already cooked.", "Brunch is just lunch with better marketing.", "You can dislike a friend's partner without saying it.", "Posting your partner too much is a red flag.", "Voice notes longer than two minutes are podcasts.", "Your best friend should get veto power over your dates.", "Separate bills are less awkward than fake generosity.", "An ex can become a genuine friend.", "Private relationships last longer than secret relationships.", "If the food is bad, the aesthetic does not matter.", "Being late is disrespectful, not a personality trait.", "A situationship is still a relationship with bad branding.", "Friends who never take photos are the realest friends.", "Deleting comments is sometimes self-care.", "Dessert should always be ordered before deciding you're full."
    ]
  },
  {
    id: "never-have", title: "Never Have I Ever", emoji: "✋", kind: "prompt", accent: "#14b8a6",
    tagline: "Five fingers up. Honesty gets dangerous.", rule: "Everyone starts with five fingers. Put one down if you have done it. First to zero tells a bonus story.",
    prompts: [
      "Never have I ever screenshotted a chat and sent it straight back to that person.", "Never have I ever pretended not to see someone in public.", "Never have I ever stalked a new date's ex.", "Never have I ever deleted and reposted because the likes were low.", "Never have I ever used 'my battery died' as a lie.", "Never have I ever had a crush on a friend's sibling.", "Never have I ever listened to a voice note on 2× speed.", "Never have I ever ordered the same dish as always after reading the whole menu.", "Never have I ever muted someone I still love.", "Never have I ever practised an argument alone.", "Never have I ever joined a call just to hear the gossip.", "Never have I ever faked knowing a trending song.", "Never have I ever accidentally revealed a surprise.", "Never have I ever changed seats to avoid someone.", "Never have I ever judged a date by their food order.", "Never have I ever left a party without saying goodbye.", "Never have I ever made a finsta or secret account.", "Never have I ever blamed autocorrect for something intentional."
    ]
  },
  {
    id: "emoji-decode", title: "Emoji Decode", emoji: "🧩", kind: "decode", accent: "#eab308",
    tagline: "Guess the movie, phrase or pop-culture moment.", rule: "Show only the emojis. First person to decode it gets a point, then reveal the answer.",
    prompts: [
      "👑🦁|The Lion King", "🚢🧊💔|Titanic", "👻🔫|Ghostbusters", "👠🎃⏰|Cinderella", "🕷️👨🏙️|Spider-Man", "🏠👦😱|Home Alone", "💍🌋|The Lord of the Rings", "🧙‍♂️⚡🏰|Harry Potter", "👽📞🏠|E.T.", "🦖🏝️|Jurassic Park", "🤫🐑🐑|Silence of the Lambs", "💃👑|Dancing Queen", "☕➡️❤️|Coffee date", "🚩🏃‍♀️|Run from the red flag", "📱👀🌙|Late-night stalking", "🍿🎬😭|Emotional movie night", "💅✨📸|Main-character moment", "🧾👀🔥|The receipts are spicy"
    ]
  },
  {
    id: "red-green", title: "Red Flag / Green Flag", emoji: "🚩", kind: "hot", accent: "#ef4444",
    tagline: "Judge the behaviour, not the person.", rule: "Vote red or green. If the table splits evenly, somebody must reveal a real-life example.",
    prompts: [
      "They still share a streaming account with their ex.", "They remember your exact coffee order.", "Their phone is always face-down.", "They are friends with every ex.", "They tip well even when nobody is watching.", "They post inspirational quotes after every argument.", "They have no close friends at all.", "They introduce you to their friends immediately.", "They text 'we need to talk' and then disappear.", "They ask before posting your photo.", "They know every server by name.", "Their dating bio says 'fluent in sarcasm.'", "They apologise without adding 'but.'", "They constantly compare you with their ex.", "They keep their promises even when inconvenient.", "They call every ex 'crazy.'", "They send food when you have a bad day.", "They clap when the plane lands."
    ]
  },
  {
    id: "caption-battle", title: "Caption Battle", emoji: "📸", kind: "caption", accent: "#06b6d4",
    tagline: "Thirty seconds. Funniest caption wins.", rule: "Read the imaginary photo, start the timer and shout captions. The table votes for the winner.",
    prompts: [
      "A cat sitting alone at a candlelit dinner", "Your friend running after the waiter with the bill", "A bride checking football scores during her vows", "Three people pretending not to see the last slice", "A dog wearing sunglasses inside a luxury car", "Someone taking 47 photos of one coffee", "A group chat after somebody types 'I have news'", "Your ex walking into the same café on your first date", "A waiter delivering six desserts to one person", "A phone at 1% during the biggest gossip reveal", "Two best friends spotting the same dating-app match", "A dramatic exit ruined by a locked door", "A birthday cake with the wrong name", "Someone saying 'I'm not hungry' then stealing fries", "The table when the quiet friend starts speaking", "A selfie taken one second before disaster"
    ]
  },
  {
    id: "imposter", title: "One Word Imposter", emoji: "🕵️", kind: "imposter", accent: "#6366f1",
    tagline: "Pass the phone. One player gets no word.", rule: "Choose player count, privately reveal each role, then describe the secret word without saying it. Find the imposter.",
    prompts: ["Cappuccino", "Situationship", "Group chat", "First date", "Influencer", "Airport", "Wedding", "Karaoke", "Paparazzi", "Reality show", "Brunch", "Ghosting", "Concert", "Road trip", "Birthday", "Coffee shop", "Soft launch", "Plot twist"]
  }
];

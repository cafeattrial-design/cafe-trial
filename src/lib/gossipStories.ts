export type GossipQuestion = {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type GossipStory = {
  id: string;
  category: "Breakup" | "Cheating" | "Friendship" | "Workplace" | "Wedding" | "Dating";
  emoji: string;
  title: string;
  hook: string;
  story: string;
  clues: string[];
  questions: GossipQuestion[];
  community?: boolean;
  chat?: { speaker: string; text: string; reaction?: boolean }[];
};

const q = (prompt: string, options: string[], answer: number, explanation: string): GossipQuestion => ({
  prompt,
  options,
  answer,
  explanation
});

// Original, fictional micro-dramas. They use no real people or copied posts.
export const gossipStories: GossipStory[] = [
  {
    id: "soft-launch-double-booking", category: "Dating", emoji: "📱", title: "The Soft Launch That Wasn't Exclusive",
    hook: "One cropped sleeve. Two matching watches. Three group chats in flames.",
    story: "A café regular had been soft-launching a mystery date for six weeks: a hand near the pasta, a shoulder in a lift mirror, never a face. Her flatmate noticed the same silver watch and tiny lightning tattoo in another person's weekend carousel. Both posters thought they were exclusive. The mystery date insisted the photos were old—until the café receipt in both shots showed the same Saturday and table number.",
    clues: ["Matching silver watch", "Lightning tattoo", "Same dated café receipt"],
    questions: [q("What proved the pictures were taken on the same day?", ["The weather", "The café receipt", "The pasta", "The lift mirror"], 1, "The visible receipt carried the same Saturday and table number."), q("How many people thought the date was exclusive?", ["One", "Two", "Three", "Nobody"], 1, "Both posters believed they were exclusive."), q("Which detail first linked the mystery date?", ["A silver watch and tattoo", "A red cap", "A voice note", "A playlist"], 0, "The matching watch and tattoo started the investigation.")]
  },
  {
    id: "breakup-playlist", category: "Breakup", emoji: "🎧", title: "The Breakup Playlist Leak",
    hook: "The relationship ended quietly. The collaborative playlist did not.",
    story: "After a calm mutual breakup, one person renamed their shared playlist 'Songs I Survived You To.' Friends assumed it was private until the ex added one final track: a twelve-minute meditation called Letting Go of Other People's Passwords. That exposed the real issue. They had never logged out of each other's music accounts, and both had been editing the playlist all week while pretending not to care.",
    clues: ["Renamed shared playlist", "Final meditation track", "Both accounts still logged in"],
    questions: [q("What exposed that the ex still had access?", ["A concert ticket", "A new profile photo", "A meditation track", "A blocked number"], 2, "The ex added the pointed final meditation track."), q("What were both people secretly doing?", ["Planning a trip", "Editing the playlist", "Calling the landlord", "Deleting photos"], 1, "Both kept editing the shared playlist."), q("How was the breakup described?", ["Public and messy", "Calm and mutual", "Fake", "Long-distance"], 1, "It began as a calm mutual breakup.")]
  },
  {
    id: "airdrop-alibi", category: "Cheating", emoji: "🛫", title: "The AirDrop Alibi",
    hook: "A holiday photo arrived from a stranger—and ruined a very confident lie.",
    story: "Someone said a work trip had been extended by two days. Their partner believed it until an airport stranger accidentally AirDropped a group selfie. In the background stood the traveller beside an ex, wearing the supposedly lost green jacket. The traveller claimed it was a chance meeting, but the ex was holding a handmade sign with their nickname and flight number.",
    clues: ["Accidental group selfie", "Supposedly lost jacket", "Personalised airport sign"],
    questions: [q("What item was the traveller wearing?", ["A red scarf", "A green jacket", "A blue cap", "A black suit"], 1, "It was the same green jacket they said was lost."), q("Why did the meeting look planned?", ["They shared luggage", "The ex held a personalised sign", "They wore matching shoes", "The flight was late"], 1, "The sign included a nickname and flight number."), q("How did the partner receive the evidence?", ["Email", "AirDrop", "Courier", "Livestream"], 1, "A stranger accidentally AirDropped the selfie.")]
  },
  {
    id: "close-friends", category: "Friendship", emoji: "👁️", title: "Close Friends, Closer Screenshots",
    hook: "The green circle was exclusive. The screenshot distribution was not.",
    story: "A creator posted a rant to twelve Close Friends about a surprise party being badly planned. Within nine minutes, the organiser received a screenshot. Suspicion fell on the newest friend, but the screenshot included a low-battery banner and a tiny calendar alert. Only the creator's oldest friend had complained about that exact calendar reminder five minutes earlier.",
    clues: ["Nine-minute leak", "Low-battery banner", "Matching calendar reminder"],
    questions: [q("Who was wrongly suspected first?", ["The organiser", "The newest friend", "The oldest friend", "The caterer"], 1, "Everyone initially blamed the newest friend."), q("Which clue identified the actual screenshot source?", ["A location pin", "A calendar alert", "A typo", "A reflection"], 1, "The calendar reminder matched the oldest friend's phone."), q("How many people saw the original rant?", ["Eight", "Ten", "Twelve", "Twenty"], 2, "It went to twelve Close Friends.")]
  },
  {
    id: "wedding-table", category: "Wedding", emoji: "💒", title: "Table Seven Knew Too Much",
    hook: "A seating chart moved once. An engagement nearly moved with it.",
    story: "At a rehearsal dinner, an ex was quietly shifted from table twelve to table seven. The groom said it was a printer error. But table seven's place cards were freshly handwritten, and the ex's vegetarian meal had already been specially moved there in the caterer's system two days earlier. The bride's cousin eventually admitted the groom had requested the change to keep the ex close to the university group.",
    clues: ["Handwritten place card", "Meal moved two days earlier", "Cousin knew the request"],
    questions: [q("What dietary detail had been moved in advance?", ["A gluten-free cake", "A vegetarian meal", "A nut-free starter", "A vegan dessert"], 1, "The ex's vegetarian meal was reassigned two days earlier."), q("Who admitted knowing about the request?", ["The caterer", "The bride's cousin", "The ex", "The photographer"], 1, "The bride's cousin revealed the groom requested it."), q("Which table received the ex?", ["Five", "Seven", "Ten", "Twelve"], 1, "The ex was moved to table seven.")]
  },
  {
    id: "office-mug", category: "Workplace", emoji: "☕", title: "The Promotion Mug Mystery",
    hook: "The announcement was confidential. The mug was aggressively specific.",
    story: "Before a promotion was announced, a colleague arrived with a mug reading 'World's Okayest Manager.' They claimed it was random. Later, the team found a gift-shop receipt timestamped eight minutes after the private leadership call. The colleague was not on that call—but their desk neighbour was, and had borrowed their charger during it.",
    clues: ["Manager mug", "Receipt timestamp", "Desk neighbour joined private call"],
    questions: [q("What message was on the mug?", ["Boss Mode", "World's Okayest Manager", "Ask Me Tomorrow", "Promoted-ish"], 1, "The mug was oddly specific about management."), q("When was it purchased?", ["Before the call", "Eight minutes after the call", "The next day", "A week earlier"], 1, "The timestamp was eight minutes after the private call."), q("Who had access to the confidential news?", ["The barista", "The desk neighbour", "The delivery driver", "The whole team"], 1, "The desk neighbour was on the leadership call.")]
  },
  {
    id: "shared-notes", category: "Dating", emoji: "📝", title: "The Shared Notes App Audition",
    hook: "Three dates got the same thoughtful message—down to the same typo.",
    story: "Three people compared dating stories at brunch and discovered they had received identical 'I have never felt this understood' paragraphs. Each message contained the typo 'definately' and arrived at 10:14 p.m. on different Thursdays. One person still defended the sender until a shared Notes link accidentally appeared, titled 'Deep Text v4 — rotate weekly.'",
    clues: ["Identical paragraph", "Same typo", "Template note title"],
    questions: [q("What typo appeared in every message?", ["Recieve", "Definately", "Tommorow", "Untill"], 1, "Every copied paragraph used 'definately.'"), q("What was the note called?", ["Date ideas", "Deep Text v4 — rotate weekly", "Thursday thoughts", "Brunch list"], 1, "The title made the rotation plan obvious."), q("When did the messages arrive?", ["Friday mornings", "Different Thursdays at 10:14 p.m.", "Sunday noon", "Every day at midnight"], 1, "The sender reused the slot on different Thursdays.")]
  },
  {
    id: "plant-custody", category: "Breakup", emoji: "🪴", title: "The Plant Custody Plot Twist",
    hook: "They fought over a monstera neither of them had bought.",
    story: "During a breakup, both people demanded custody of a huge monstera, each insisting it was an anniversary gift. A friend checked the faded tag under the pot and found the previous tenant's flat number. The landlord confirmed the plant came with the apartment. The exes stopped arguing—then jointly asked the landlord whether the plant could get its own visitation schedule.",
    clues: ["Faded pot tag", "Previous tenant's number", "Landlord confirmation"],
    questions: [q("Who originally owned the plant?", ["One ex", "The previous tenant", "The landlord's sister", "A neighbour"], 1, "The tag traced it to the previous tenant."), q("What kind of plant was it?", ["Cactus", "Monstera", "Bonsai", "Fern"], 1, "They were fighting over a large monstera."), q("What solved the argument?", ["A photo album", "The tag under the pot", "A bank statement", "A delivery text"], 1, "The faded tag revealed the flat number.")]
  },
  {
    id: "second-phone", category: "Cheating", emoji: "📲", title: "The Second Phone Was a First Clue",
    hook: "A hidden phone buzzed. The contact name made everything worse—and then better.",
    story: "A hidden phone buzzed inside a winter boot during summer. The screen showed repeated calls from 'Do Not Answer.' Convinced it was cheating, the partner confronted them at dinner. The phone actually belonged to a younger sibling hiding a surprise job search from strict parents. 'Do Not Answer' was the recruiter, saved that way to avoid family questions.",
    clues: ["Phone hidden in winter boot", "Recruiter calls", "Sibling's secret job search"],
    questions: [q("Where was the phone hidden?", ["A cereal box", "A winter boot", "A desk drawer", "A flowerpot"], 1, "It buzzed inside a winter boot."), q("Who did the phone belong to?", ["An ex", "A younger sibling", "A colleague", "The landlord"], 1, "The sibling was privately job hunting."), q("Who was 'Do Not Answer'?", ["A recruiter", "A date", "A teacher", "A neighbour"], 0, "The contact was the recruiter's number.")]
  },
  {
    id: "birthday-cake", category: "Friendship", emoji: "🎂", title: "The Birthday Cake Copy-Paste",
    hook: "Two best friends. One custom cake. Exactly the same private joke.",
    story: "Two birthday parties on opposite sides of town received identical custom cakes with the same niche quote. Each birthday person believed the quote was an inside joke shared only with one mutual friend. The bakery later posted both orders, revealing that the mutual friend used a saved order template and forgot to change the inscription—or the delivery instructions saying 'for my one true bestie.'",
    clues: ["Identical niche quote", "Bakery post", "Unedited delivery note"],
    questions: [q("Who revealed both orders?", ["A guest", "The bakery", "A driver", "A sibling"], 1, "The bakery's post showed the duplicated cakes."), q("What phrase remained in the instructions?", ["No candles", "For my one true bestie", "Deliver quietly", "Extra frosting"], 1, "The template still called both people the one true bestie."), q("Why did the duplication happen?", ["A hacked account", "A saved template", "A twin baker", "A wrong address"], 1, "The friend reused an order template.")]
  },
  {
    id: "mute-button", category: "Workplace", emoji: "🎤", title: "The Mute Button Betrayal",
    hook: "The meeting was muted. The smart speaker in the next room was not.",
    story: "During a remote team call, a manager muted themselves before commenting on everyone's excuses. No one on the call heard it. Unfortunately, the same laptop was casting audio to a smart speaker in the shared office kitchen, where half the team was eating lunch. The manager only realised when the office playlist changed itself to 'Everybody Hurts.'",
    clues: ["Muted video call", "Connected kitchen speaker", "Very pointed song choice"],
    questions: [q("Where did the private comments play?", ["A taxi", "The office kitchen", "A lift", "A café"], 1, "Audio was still casting to the kitchen speaker."), q("Which song exposed the situation?", ["Happy", "Everybody Hurts", "Respect", "Sorry"], 1, "Someone answered with 'Everybody Hurts.'"), q("Who was in the kitchen?", ["Clients", "Half the team", "Only the manager", "Nobody"], 1, "Half the team heard it over lunch.")]
  },
  {
    id: "ring-light", category: "Dating", emoji: "💡", title: "The Ring Light Reflection",
    hook: "A 'quiet night alone' featured one suspiciously familiar silhouette.",
    story: "A date cancelled because they needed a quiet night alone, then posted a mirror selfie. In the ring-light reflection was a second silhouette holding a distinctive star-shaped phone charm. It looked scandalous until a mutual friend identified the charm as belonging to the date's cousin, a makeup artist helping record an audition tape.",
    clues: ["Cancelled date", "Reflected silhouette", "Star phone charm"],
    questions: [q("What identified the second person?", ["A hat", "A star-shaped phone charm", "A tattoo", "A bracelet"], 1, "The phone charm belonged to the cousin."), q("Why was the cousin there?", ["To plan a party", "To film an audition tape", "To borrow money", "To collect a parcel"], 1, "The makeup-artist cousin was helping with an audition."), q("Where was the clue visible?", ["In a window", "In the ring-light reflection", "On a receipt", "In a taxi"], 1, "The silhouette appeared in the reflected ring light.")]
  },
  {
    id: "venue-password", category: "Wedding", emoji: "🔐", title: "The Venue Wi-Fi Confession",
    hook: "The wedding Wi-Fi password was cute, romantic, and completely wrong.",
    story: "Guests were told the venue Wi-Fi password was the couple's first-date location plus the year. It failed for everyone except the groom's university friends, who quietly used a different café name. The bride asked why. It turned out the groom had recycled the proposal story from an old relationship, and his friends had remembered the original café.",
    clues: ["Failed official password", "Friends knew another café", "Recycled proposal story"],
    questions: [q("Who knew the working password?", ["The caterers", "The groom's university friends", "The bride's cousins", "The band"], 1, "His university friends remembered the original café."), q("What was the password based on?", ["A pet name", "A first-date location and year", "A birthday", "A song title"], 1, "It combined the supposed first-date venue with the year."), q("What had been recycled?", ["The rings", "The proposal story", "The vows", "The guest list"], 1, "The groom reused a story from an old relationship.")]
  },
  {
    id: "food-delivery", category: "Cheating", emoji: "🥡", title: "The Dumpling Delivery Detective",
    hook: "The order history said dinner for one. The cutlery request said otherwise.",
    story: "Someone insisted they spent Friday alone gaming. Their food app showed one noodle bowl, which seemed convincing. But the saved order note requested two sets of chopsticks, one mild sauce and one extra-hot. The twist: they were not on a secret date. Their supposedly estranged best friend had visited, and both had hidden the reconciliation from a stubborn group chat.",
    clues: ["One noodle bowl", "Two chopstick sets", "Secret friendship reunion"],
    questions: [q("What contradicted the dinner-for-one story?", ["Two drinks", "Two chopstick sets", "A second bowl", "A cake"], 1, "The order note requested two sets."), q("Who actually visited?", ["An ex", "An estranged best friend", "A colleague", "A cousin"], 1, "It was a hidden friendship reconciliation."), q("Why hide the visit?", ["A surprise party", "A stubborn group chat", "A work policy", "A missed train"], 1, "Neither wanted the group chat to know yet.")]
  },
  {
    id: "voice-note", category: "Friendship", emoji: "🎤", title: "The 1.5× Voice Note Disaster",
    hook: "A two-minute rant was forwarded to the exact person it was about.",
    story: "A friend recorded a long voice note about someone always playing messages at 1.5× speed. While forwarding it to another chat, they sent it to the subject instead. The subject replied after exactly eighty seconds—the precise shortened runtime at 1.5×—with only: 'Efficient feedback, thanks.' They later made up over coffee and a strict no-forwarding pact.",
    clues: ["Two-minute recording", "Eighty-second reply", "1.5× playback"],
    questions: [q("How long was the original note?", ["One minute", "Two minutes", "Three minutes", "Five minutes"], 1, "The rant ran for two minutes."), q("When did the subject reply?", ["After 30 seconds", "After 80 seconds", "After 2 minutes", "The next day"], 1, "Eighty seconds matched the faster playback time."), q("How did they resolve it?", ["They blocked each other", "Coffee and a no-forwarding pact", "A public apology video", "They did not"], 1, "They made up and agreed not to forward notes.")]
  },
  {
    id: "calendar-colour", category: "Workplace", emoji: "📅", title: "The Colour-Coded Calendar Coup",
    hook: "A secret interview was hidden in plain sight as 'dentist.' The colour gave it away.",
    story: "A teammate claimed three dentist appointments in one month. Nobody questioned it until a screen share showed every real medical event in blue while all job interviews were purple. The newest 'dentist' block was purple and linked to a competitor's meeting room. The team kept the secret—and gifted them purple cupcakes on their last day.",
    clues: ["Calendar colour system", "Purple appointment", "Competitor meeting-room link"],
    questions: [q("What colour marked job interviews?", ["Blue", "Green", "Purple", "Orange"], 2, "Purple was the interview category."), q("What did the teammate call the appointments?", ["Dentist visits", "Gym sessions", "Client calls", "Lunches"], 0, "They disguised them as dentist appointments."), q("What farewell gift did the team choose?", ["Blue balloons", "Purple cupcakes", "A new calendar", "A toothbrush"], 1, "The cupcakes referenced the purple calendar clue.")]
  },
  {
    id: "borrowed-dress", category: "Wedding", emoji: "👗", title: "The Borrowed Dress Boomerang",
    hook: "A bridesmaid dress disappeared in 2023 and returned in someone else's engagement post.",
    story: "A bridesmaid said a borrowed designer dress had been ruined at the dry cleaner. Two years later, it appeared in the background of her sister's engagement photos, altered into a shorter outfit. The original owner recognised a hand-sewn pearl replacing a lost button. The sister had no idea it was borrowed and returned it with a replacement dress plus an apology brunch.",
    clues: ["Engagement photo background", "Hand-sewn pearl button", "Sister unaware"],
    questions: [q("What made the dress unmistakable?", ["A coffee stain", "A pearl replacement button", "A torn sleeve", "A label"], 1, "The owner had personally sewn on that pearl."), q("What had happened to the dress?", ["It was dyed", "It was shortened", "It was sold", "It was framed"], 1, "It had been altered into a shorter outfit."), q("Did the sister know it was borrowed?", ["Yes", "No", "Only later that day", "The story never says"], 1, "The sister was unaware and made amends.")]
  },
  {
    id: "shared-ride", category: "Breakup", emoji: "🚕", title: "The Shared Ride Receipt",
    hook: "They claimed the relationship ended Monday. Tuesday's ride receipt had two stops.",
    story: "One person announced a Monday breakup and asked friends to pick sides immediately. A shared taxi receipt from Tuesday showed pickups at both exes' buildings and a final stop at their favourite cinema. Friends expected a secret reunion. In reality, they had booked non-refundable anniversary tickets months earlier and agreed to attend as friends—then argued through the entire film.",
    clues: ["Tuesday ride receipt", "Two pickups", "Non-refundable cinema tickets"],
    questions: [q("Where did the ride end?", ["An airport", "Their favourite cinema", "A restaurant", "A new flat"], 1, "The final stop was their favourite cinema."), q("Why did they still go together?", ["They reconciled", "The tickets were non-refundable", "Their friends forced them", "They worked there"], 1, "The anniversary tickets could not be refunded."), q("When was the breakup announced?", ["Monday", "Tuesday", "Friday", "Sunday"], 0, "The announcement came on Monday.")]
  },
  {
    id: "dating-dog", category: "Dating", emoji: "🐶", title: "The Dog With Two Dating Profiles",
    hook: "The same golden retriever was apparently owned by two different 'single dads.'",
    story: "Two friends matched with different profiles using the same golden retriever photo. Both bios said 'dog dad to Mango.' They suspected one person running two accounts. A reverse image search led to a local dog café: Mango was the resident dog, and both daters had independently borrowed him for profile photos. The café added a sign: 'Mango is not your son.'",
    clues: ["Same dog photo", "Reverse image search", "Resident café dog"],
    questions: [q("What was the dog's name?", ["Milo", "Mango", "Mocha", "Max"], 1, "Both profiles called him Mango."), q("Who actually owned Mango?", ["Both daters", "The dog café", "One friend's neighbour", "Nobody"], 1, "Mango was the café's resident dog."), q("How was the truth found?", ["A vet bill", "A reverse image search", "A microchip scan", "A confession"], 1, "The photo search led back to the café.")]
  },
  {
    id: "anonymous-flowers", category: "Cheating", emoji: "💐", title: "The Anonymous Flowers Mix-Up",
    hook: "A romantic bouquet arrived without a name—but with a loyalty number.",
    story: "A bouquet arrived at work with a card saying 'same time next week.' The recipient's partner panicked. The florist would not reveal the buyer, but the receipt showed the recipient's own loyalty points had been used. It was a scheduled self-gift they set up months ago during a wellness challenge and completely forgot about.",
    clues: ["Anonymous card", "Recipient's loyalty points", "Old self-care schedule"],
    questions: [q("Whose loyalty points paid for the flowers?", ["The partner's", "The recipient's", "A colleague's", "The florist's"], 1, "Their own account funded the bouquet."), q("Why were flowers arriving weekly?", ["A secret admirer", "A wellness challenge", "A client contract", "A wedding plan"], 1, "They had scheduled recurring self-gifts."), q("Where did the bouquet arrive?", ["At home", "At work", "At a restaurant", "At the airport"], 1, "It appeared at the recipient's workplace.")]
  },
  {
    id: "group-gift", category: "Friendship", emoji: "🎁", title: "The Group Gift Spreadsheet",
    hook: "Everyone paid equally. One hidden spreadsheet column strongly disagreed.",
    story: "A friend collected equal contributions for an expensive birthday gift. During a screen share, the group spotted a hidden column labelled 'admin fee' beside the organiser's name. The organiser had deducted money for wrapping, delivery and three cab rides—but the gift had free shipping and was handed over in its original box. The fee eventually funded apology fries for everyone.",
    clues: ["Hidden admin-fee column", "Free shipping", "Unwrapped original box"],
    questions: [q("What was the hidden column called?", ["Late fee", "Admin fee", "Tax", "Secret Santa"], 1, "The spreadsheet labelled it 'admin fee.'"), q("What disproved the delivery expense?", ["A coupon", "The gift had free shipping", "A driver called", "The shop closed"], 1, "Shipping cost nothing."), q("How was the money finally used?", ["Cake", "Apology fries", "A second gift", "Refund fees"], 1, "The suspicious fee bought fries for the group.")]
  },
  {
    id: "last-slice", category: "Workplace", emoji: "🍕", title: "The Case of the Vanishing Last Slice",
    hook: "The office thief left no crumbs—just a fitness notification.",
    story: "For four Fridays, the last slice of team pizza vanished from the fridge after everyone left. A fake note claiming the box was under camera surveillance changed nothing. The mystery ended when a colleague's smartwatch congratulated them for a 2 a.m. kitchen walk while they were presenting weekly sleep data. They confessed to late-night deploy snacks and replaced the next order.",
    clues: ["Four Friday thefts", "2 a.m. kitchen walk", "Public sleep-data screen"],
    questions: [q("What exposed the snack thief?", ["Security footage", "A smartwatch notification", "Fingerprints", "A delivery app"], 1, "Their watch logged the late-night kitchen walk."), q("When did the walk happen?", ["2 a.m.", "2 p.m.", "Midday", "8 p.m."], 0, "The notification showed 2 a.m."), q("How did they make amends?", ["They resigned", "They replaced the next pizza order", "They bought a camera", "They denied it"], 1, "They paid for the next team order.")]
  }
];

import type { GossipQuestion, GossipStory } from "./gossipStories";

type Category = GossipStory["category"];
type Quiz = [string, string[], number, string];

function tea(
  id: string,
  category: Category,
  emoji: string,
  title: string,
  hook: string,
  drop: string,
  reaction: string,
  twist: string,
  receipt: string,
  clues: string[],
  quiz: Quiz[]
): GossipStory {
  const questions: GossipQuestion[] = quiz.map(([prompt, options, answer, explanation]) => ({ prompt, options, answer, explanation }));
  return {
    id, category, emoji, title, hook,
    story: `${drop} ${twist} ${receipt}`,
    clues,
    questions,
    chat: [
      { speaker: "Ria", text: `BESTIE. ${hook}` },
      { speaker: "Ria", text: drop },
      { speaker: "You", text: reaction, reaction: true },
      { speaker: "Ria", text: twist },
      { speaker: "You", text: "NO. Show me the receipts right now.", reaction: true },
      { speaker: "Ria", text: receipt }
    ]
  };
}

// A fictional entertainment universe: celebrity-sized chaos without claims about real people.
export const viralTeaStories: GossipStory[] = [
  tea("secret-wedding-nails", "Wedding", "💍", "The Wedding Nobody Was Supposed to See", "the biggest pop girl may have secretly married on Tuesday.",
    "She posted a casual studio selfie, but fans zoomed in and found fresh bridal nails plus a second ring.", "WAIT—on a random TUESDAY?", "Her team called it a styling test. Then the luxury villa's chef posted a deleted story saying 'congratulations N + K.'", "The final receipt? Her producer accidentally uploaded a folder named WEDDING MASTER AUDIO.", ["Second ring", "Deleted chef story", "Wedding audio folder"],
    [["What made the studio selfie suspicious?", ["A new microphone", "Bridal nails and a second ring", "A white sofa", "A bouquet"], 1, "The nails and second ring started the spiral."], ["What initials appeared in the chef's post?", ["N + K", "A + J", "M + T", "R + S"], 0, "The deleted congratulations named N + K."], ["What was the leaked folder called?", ["Album Deluxe", "Wedding Master Audio", "Villa Mix", "Tuesday Takes"], 1, "That upload turned speculation into a full group-chat emergency."]]),

  tea("bachelor-party-double-invite", "Dating", "🏈", "The Bachelor Party Plus-One War", "a star athlete's bachelor weekend has two guest lists—and his fiancée is on neither.",
    "The public story says it is a boys-only golf trip. A club promoter leaked a VIP list containing three of his exes.", "THREE? That is not golf, that is a reunion special.", "His best friend denied it, then unfollowed the promoter and changed the villa booking from twelve guests to sixteen.", "A florist posted sixteen welcome boxes: twelve black ribbons and four very specific pink ones.", ["Leaked VIP list", "Villa guest count", "Sixteen welcome boxes"],
    [["How many exes were on the leaked list?", ["One", "Two", "Three", "Four"], 2, "Three exes appeared on the promoter's list."], ["How did the booking change?", ["12 to 16", "8 to 10", "16 to 12", "20 to 24"], 0, "The villa suddenly gained four guests."], ["What exposed the extra guests?", ["Golf clubs", "Pink-ribbon welcome boxes", "Flight tickets", "Matching hats"], 1, "The four pink-ribbon boxes matched the four added places."]]),

  tea("podcast-feud-draft", "Friendship", "🎙️", "The Podcast Feud Voice Note", "two best-friend podcasters have been fake-laughing through a feud for six months.",
    "One host announced a surprise solo show. The other liked a comment saying 'finally free' at 2:03 a.m., then unliked it.", "I KNEW those ad-read smiles were forced.", "Both blamed a hacked account—until their editor uploaded an episode draft with forty-seven minutes marked CUT: FIGHT ABOUT MONEY.", "A leaked voice note ends with one host saying, 'Keep my name out of your rebrand.'", ["2:03 a.m. like", "Cut fight segment", "Leaked voice note"],
    [["What did the suspicious comment say?", ["Finally free", "New era", "Good luck", "Tell the truth"], 0, "The brief like was on 'finally free.'"], ["How long was the cut argument?", ["17 minutes", "27 minutes", "47 minutes", "60 minutes"], 2, "The editor's draft showed forty-seven missing minutes."], ["What were they fighting about?", ["A guest", "Money", "A holiday", "Merch colours"], 1, "The draft label explicitly mentioned money."]]),

  tea("villa-hard-launch", "Dating", "🌴", "The Hard Launch With the Wrong Reflection", "an actor went Instagram-official, but the villa mirror featured somebody else's luggage.",
    "The carousel looked romantic: breakfast, pool, matching robes. Slide six reflected a suitcase monogrammed with the actor's ex's initials.", "Delete the app. Romance is cancelled.", "The new partner said the suitcase belonged to hotel staff. Unfortunately, the ex posted an airport selfie with the same neon luggage strap.", "Flight trackers then placed all three in the same tiny island airport within twenty minutes.", ["Monogrammed suitcase", "Neon luggage strap", "Matching airport times"],
    [["Where was the suitcase spotted?", ["At breakfast", "In a mirror reflection", "On the beach", "In a taxi"], 1, "Slide six's mirror caught it."], ["What matched the ex's selfie?", ["A hat", "A neon luggage strap", "A robe", "A passport cover"], 1, "The same neon strap appeared on the luggage."], ["How close were their airport arrivals?", ["20 minutes", "Two hours", "One day", "One week"], 0, "All three reached the small airport within twenty minutes."]]),

  tea("sponsored-apology", "Workplace", "📱", "The Apology Video Had a Brand Deal", "a creator monetized an apology before anyone knew what she was apologizing for.",
    "She uploaded a tearful video with no ads, then viewers noticed a skincare bottle perfectly facing the camera in every cut.", "Please tell me the tears were not sponsored.", "The brand denied involvement, but its campaign calendar briefly listed 'Accountability Era — 8 p.m.'", "The video's captions file contained the line: pause for emotion, hold serum beside cheek.", ["Product-facing camera", "Campaign calendar", "Caption direction"],
    [["What product stayed visible?", ["A perfume", "A skincare bottle", "A handbag", "A candle"], 1, "The bottle faced camera in every cut."], ["What was the campaign called?", ["Fresh Start", "Accountability Era", "Night Routine", "No Filter"], 1, "The calendar used 'Accountability Era.'"], ["What did the caption file instruct?", ["Cut the ad", "Hold serum beside cheek", "Call the manager", "Remove tears"], 1, "The direction choreographed the emotional product placement."]]),

  tea("family-name-drop", "Friendship", "🎤", "The Famous Family Name Drop", "a chart-topping singer removed her surname and her family noticed with the rest of us.",
    "Her festival screens showed only her first name. Dad posted 'proud of you always' while her brother posted a photo of a burning family tree.", "That family group chat is absolutely unusable.", "Her publicist called it cleaner branding. Then the singer trademarked the new single name in categories including memoirs and documentary films.", "A cousin commented 'chapter one tells EVERYTHING' before deleting the comment.", ["One-name festival screen", "Burning family-tree post", "Memoir trademark"],
    [["Who posted the burning family tree?", ["Her father", "Her brother", "Her cousin", "Her publicist"], 1, "The brother chose the dramatic visual."], ["What did the trademark cover?", ["Only music", "Memoirs and documentaries", "Restaurants", "Jewellery"], 1, "The categories suggested a much bigger reveal."], ["What did the cousin tease?", ["A duet", "Chapter one", "A wedding", "A tour"], 1, "The deleted comment claimed chapter one told everything."]]),

  tea("reality-couple-notes", "Breakup", "📺", "The Reality Couple's Matching Statements", "the internet's favourite reality couple broke up using the exact same Notes-app typo.",
    "They posted 'with heavy harts' at the same second and insisted the decision was mutual.", "Not the synchronized typo. Their PR intern is exhausted.", "Twenty minutes later she archived every couple photo; he launched a breakup-merch hoodie reading HEAVY HARTS.", "The merch domain had been registered eleven days before the 'sudden' split.", ["Matching typo", "Instant breakup merch", "Old domain registration"],
    [["What typo appeared in both statements?", ["Heavy harts", "Mutal choice", "Seperate ways", "Privasy please"], 0, "Both posts used the same misspelling."], ["What did he launch?", ["A podcast", "A hoodie", "A dating app", "A song"], 1, "The typo immediately became merch."], ["When was the domain registered?", ["That morning", "11 days earlier", "One month later", "During filming"], 1, "The domain predated the supposedly sudden breakup."]]),

  tea("fake-sold-out", "Workplace", "👜", "The Sold-Out Bag That Never Sold", "a fashion creator's 'sold-out in 90 seconds' launch still had every bag in the warehouse.",
    "She cried on live thanking fans for changing her life. A warehouse employee accidentally filmed shelves stacked to the ceiling behind a dance video.", "So what exactly sold out—the truth?", "Her team said those were returns. But every box had tomorrow's scheduled shipping label and sequential order numbers.", "The website code was found using a timer that changed SOLD OUT to RESTOCKED automatically.", ["Full warehouse shelves", "Future shipping labels", "Automatic sell-out timer"],
    [["How fast did the brand claim to sell out?", ["30 seconds", "90 seconds", "Nine minutes", "One hour"], 1, "The headline claim was ninety seconds."], ["Why were the boxes not returns?", ["They were unopened", "They had future labels", "They were the wrong colour", "They had no logos"], 1, "Tomorrow's labels exposed the explanation."], ["What controlled the website message?", ["A customer poll", "An automatic timer", "The warehouse", "A livestream"], 1, "Code switched the scarcity messages on schedule."]]),

  tea("award-seat-swap", "Dating", "🏆", "The Award-Show Seat Swap", "a singer's ex was moved six rows just before cameras went live.",
    "The official chart placed the ex beside the singer's new partner. Five minutes before broadcast, three assistants rushed over and switched every name card.", "Imagine needing choreography for your love triangle.", "The network blamed sightlines. A rehearsal clip showed the singer refusing to perform unless the ex was moved out of the reaction-camera frame.", "The ex still appeared during the song—standing directly behind the host.", ["Swapped name cards", "Rehearsal ultimatum", "Host-camera appearance"],
    [["Where was the ex originally seated?", ["Beside the new partner", "Behind the stage", "With the band", "In row one"], 0, "The original chart created maximum awkwardness."], ["What reason did the network give?", ["Security", "Sightlines", "A broken chair", "Late arrival"], 1, "The official excuse was sightlines."], ["Where did the ex finally appear?", ["Backstage", "Behind the host", "At the bar", "Outside"], 1, "The camera found the ex anyway."]]),

  tea("wedding-nda-menu", "Wedding", "🥂", "The Billionaire Wedding NDA Menu", "guests signed NDAs, then the tasting menu exposed the entire relationship timeline.",
    "Every course was named after a secret milestone, including 'The Paris Second Chance' dated while one partner was publicly with someone else.", "The soup just confirmed an overlap?", "Staff collected menus, but one guest had already scanned the QR version into their phone wallet.", "The archived menu showed the couple's 'first kiss' happened four months before the public breakup.", ["Milestone course names", "Saved QR menu", "Four-month overlap"],
    [["Which course raised the alarm?", ["The Paris Second Chance", "The First Date", "Midnight Cake", "Forever Soup"], 0, "That course carried the suspicious date."], ["How was the menu preserved?", ["A photograph", "A phone-wallet QR copy", "A waiter", "A printed invitation"], 1, "The digital menu survived collection."], ["How large was the apparent overlap?", ["Four days", "Four weeks", "Four months", "Four years"], 2, "The dates were four months apart."]]),

  tea("dj-secret-set", "Breakup", "🎧", "The DJ's Secret Set Was a Public Breakup", "a surprise club set ended with an unreleased voice note from the DJ's ex.",
    "Midway through the final track, the music stopped and a voice said, 'You promised this would stay private.'", "I would evaporate on the dance floor.", "The DJ claimed it was fictional sampling. The ex posted the original chat waveform showing the exact same seven-second clip.", "Then the club's screen flashed TRACK 12: RECEIPTS, exported three weeks before their breakup announcement.", ["Private voice sample", "Matching waveform", "Receipts export date"],
    [["How long was the matching clip?", ["Five seconds", "Seven seconds", "Twelve seconds", "One minute"], 1, "The waveform matched seven seconds exactly."], ["What was track twelve called?", ["Closure", "Receipts", "Private", "Final Call"], 1, "The screen labelled it RECEIPTS."], ["When was it exported?", ["After the announcement", "Three weeks before it", "That night", "A year earlier"], 1, "The track was prepared well before the public breakup."]]),

  tea("beauty-copy-apology", "Friendship", "💄", "Two Beauty Founders, One Apology", "rival founders posted word-for-word apologies—including the same accidental lunch order.",
    "Both carousels ended with 'add avocado, dressing on side,' pasted below the accountability statement.", "The crisis manager copied the salad too? Incredible.", "Each founder insisted she wrote her own post. Metadata showed both graphics came from a designer file titled CLIENTS_USE_SAME_SAFE_APOLOGY.", "The designer then liked a comment asking whether accountability came with free delivery.", ["Matching lunch order", "Shared design metadata", "Designer's suspicious like"],
    [["What food instruction leaked into both posts?", ["No onions", "Add avocado, dressing on side", "Extra fries", "Oat milk"], 1, "The same lunch line survived both copy-pastes."], ["What did the file name reveal?", ["A shared apology template", "A product launch", "A merger", "A new logo"], 0, "Both graphics came from one safe-apology template."], ["Who liked the delivery joke?", ["One founder", "The designer", "A customer", "The courier"], 1, "The designer's like quietly confirmed the chaos."]]),

  tea("streamer-ring-receipt", "Dating", "💎", "The Engagement Ring Return Receipt", "a streamer announced an engagement while the ring's return receipt was visible on his second monitor.",
    "During the live, chat zoomed in on an email subject reading RETURN APPROVED — OVAL RING.", "Please close your tabs before proposing to four million people.", "He said it was an old gift. His fiancée's ring disappeared from every post the next morning.", "A jewellery employee then commented 'size six replacement ships Friday' and immediately deleted it.", ["Return email", "Missing ring", "Deleted replacement comment"],
    [["Where was the email visible?", ["On his phone", "On a second monitor", "In a reflection", "On the ring box"], 1, "The live showed the second screen."], ["What ring shape appeared in the subject?", ["Pear", "Oval", "Square", "Heart"], 1, "The return email specified an oval ring."], ["When would the replacement ship?", ["Monday", "Friday", "Next month", "It already shipped"], 1, "The deleted comment promised Friday."]]),

  tea("staged-breakup-walk", "Breakup", "📸", "The Breakup Pap Walk Call Sheet", "two actors looked 'accidentally heartbroken' outside the same café for three straight days.",
    "Every outlet called the photos candid. Fans noticed the actors wore the same outfits, but swapped coffee cups for different angles.", "Heartbreak continuity is my new favourite genre.", "Their teams denied staging. A photographer's public calendar listed BREAKUP WALK — DAY 3, wardrobe notes included.", "The café receipt showed production bought forty empty takeaway cups before sunrise.", ["Repeated outfits", "Photographer calendar", "Forty empty cups"],
    [["How many days did the pap walks run?", ["Two", "Three", "Five", "Seven"], 1, "The storyline ran three days."], ["What did the calendar call day three?", ["Coffee pickup", "Breakup Walk", "Press day", "Location test"], 1, "The public listing used BREAKUP WALK."], ["What did production buy?", ["Forty empty cups", "Ten breakfasts", "A camera", "Matching coats"], 0, "The café receipt showed forty prop-like cups."]]),

  tea("girl-group-reunion", "Friendship", "🎶", "The Reunion Countdown Sabotage", "a beloved girl group teased a reunion, then one member replaced the countdown with a clown emoji.",
    "Fans assumed she was joking. Her bandmates removed her tag from every poster within six minutes.", "Six minutes? They were READY to untag.", "Management blamed a scheduling conflict. A leaked stage plan showed her name replaced by 'special hologram moment.'", "She responded by going live from the rehearsal studio next door while the others practised.", ["Clown countdown", "Rapid untagging", "Hologram stage plan"],
    [["What replaced the countdown?", ["A broken heart", "A clown emoji", "A question mark", "A lock"], 1, "The clown instantly changed the mood."], ["How quickly was she untagged?", ["Six minutes", "One hour", "One day", "One week"], 0, "The posters changed within six minutes."], ["What replaced her on the stage plan?", ["A guest singer", "A hologram moment", "A dance break", "An empty spotlight"], 1, "The plan downgraded her to a hologram."]]),

  tea("stolen-recipe", "Workplace", "🍝", "The Viral Recipe Was in Grandma's Notebook", "a celebrity chef claimed a life-changing family recipe that belonged to somebody else's grandmother.",
    "A food creator recognized the exact unusual measurement: 'two blue cups of flour and one angry pinch.'", "Not the copyrighted angry pinch.", "The chef called it coincidence. The creator showed a notebook photo posted online eight years earlier—with the chef's old account in the likes.", "His cookbook draft even changed 'Grandma Leela' to 'my nonna' using tracked changes.", ["Angry-pinch phrase", "Eight-year-old like", "Tracked name change"],
    [["What unusual phrase matched?", ["A happy spoon", "One angry pinch", "Two red bowls", "A secret shake"], 1, "That wording was uniquely memorable."], ["How old was the original post?", ["Two years", "Five years", "Eight years", "Ten years"], 2, "The notebook photo had been online for eight years."], ["What name was changed in the draft?", ["Grandma Leela", "Aunt Mira", "Chef Nina", "Mama Rose"], 0, "Tracked changes exposed the borrowed family attribution."]]),

  tea("dating-show-chat", "Cheating", "🌹", "The Dating-Show Winner Had a Backup Chat", "the season winner was celebrating while his 'Plan B' group chat appeared on screen.",
    "During the finale livestream, a notification read PLAN B — SHE SAID YES??", "The punctuation alone is guilty.", "He said it was fantasy-football chat. A former contestant posted a screenshot showing five eliminated dates inside it.", "The pinned message read: whoever leaves next, meet at the airport hotel.", ["Plan B notification", "Eliminated contestants", "Pinned airport message"],
    [["What was the chat called?", ["Final Five", "Plan B", "Airport Crew", "Fantasy League"], 1, "PLAN B appeared live on screen."], ["How many eliminated dates were inside?", ["Three", "Four", "Five", "Seven"], 2, "The screenshot showed five former contestants."], ["Where did the pinned message suggest meeting?", ["A studio", "An airport hotel", "A restaurant", "The mansion"], 1, "The backup reunion point was the airport hotel."]]),

  tea("nepo-close-friends", "Workplace", "👀", "The Nepo-Baby Close Friends Lecture", "an actor posted that success takes zero connections—to a Close Friends list full of casting directors.",
    "The motivational rant said 'stop blaming access.' A screenshot leaked with eighty-seven green-circle viewers.", "The irony has its own management team.", "He denied curating the list. Someone screen-recorded it: two studio heads, four producers, his agent, and his famous mother.", "His mother replied with a heart and 'so proud since I made the call.'", ["87-person Close Friends", "Industry-heavy viewer list", "Mother's accidental confession"],
    [["How many people saw the private rant?", ["47", "67", "87", "107"], 2, "The green-circle list contained eighty-seven viewers."], ["Who appeared on the list?", ["Only school friends", "Studio heads and producers", "Restaurant staff", "Sports agents"], 1, "The supposedly organic network was extremely industry-heavy."], ["What did his mother say she did?", ["Bought tickets", "Made the call", "Read the script", "Styled him"], 1, "Her proud comment supplied the final receipt."]]),

  tea("tour-hotel-key", "Cheating", "🗝️", "The Tour Hotel Key With Two Names", "a singer denied dating a dancer, then thanked the hotel for a welcome card addressed to both of them.",
    "She posted the suite tour too quickly. On the desk: one key envelope, two names, and 'happy anniversary.'", "Anniversary of WHAT exactly? Rehearsal?", "Her team said the hotel confused guests. The dancer uploaded breakfast with the same suite number reflected in a silver teapot.", "Fans found the hotel had also delivered a one-year cake—not a tour-opening cake.", ["Two-name key envelope", "Reflected suite number", "One-year cake"],
    [["What was written on the hotel envelope?", ["Happy birthday", "Happy anniversary", "Welcome home", "Opening night"], 1, "The envelope used anniversary language."], ["Where was the suite number reflected?", ["A window", "A silver teapot", "A mirror", "A phone"], 1, "The breakfast post caught it in the teapot."], ["What kind of cake arrived?", ["One-year cake", "Tour cake", "Birthday cake", "Wedding cake"], 0, "The cake marked one year together."]]),

  tea("private-jet-set", "Workplace", "✈️", "The Private Jet Was a Photo Set", "a luxury creator's 'flight to Milan' never left the warehouse district.",
    "She posted champagne at 30,000 feet. Viewers heard a reversing truck beep and noticed the same cloud outside for forty minutes.", "Not turbulence caused by a delivery van.", "Her manager insisted the audio was added later. A local studio listed the exact jet interior for hourly rental.", "The creator's geotag briefly showed Soundstage 4, eleven kilometres from her apartment.", ["Reversing truck audio", "Rental jet listing", "Soundstage geotag"],
    [["What sound ruined the illusion?", ["A train horn", "A reversing truck", "A dog bark", "An alarm"], 1, "A warehouse truck could be heard behind the luxury scene."], ["How was the jet rented?", ["By the day", "By the hour", "By the mile", "For one week"], 1, "The studio offered the interior hourly."], ["Which location flashed in the geotag?", ["Milan Airport", "Soundstage 4", "Terminal Two", "Runway Eleven"], 1, "The accidental geotag placed her near home."]]),

  tea("surprise-album-ex", "Breakup", "💿", "The Surprise Album Was an Ex's Voice Memo", "a superstar's secret album opens with the ex everyone was told never mattered.",
    "Fans recognized a laugh in track one from a five-year-old deleted vlog. The label called it a royalty-free sample.", "Royalty-free? That laugh has survived three relationships.", "The ex posted a waveform and invoice showing the singer bought the memo for exactly one rupee 'for legal clarity.'", "Track seven is titled ONE RUPEE CLOSURE and was added after the invoice date.", ["Recognizable laugh", "One-rupee invoice", "Track-seven title"],
    [["Where did fans recognize the laugh from?", ["A movie", "A deleted vlog", "A podcast ad", "A concert"], 1, "The same laugh lived in an old vlog."], ["How much was paid for the memo?", ["One rupee", "One hundred rupees", "Nothing", "One dollar"], 0, "The tiny payment created a legal paper trail."], ["What was track seven called?", ["Cheap Goodbye", "One Rupee Closure", "Legal Clarity", "Track Seven"], 1, "The title directly referenced the invoice."]])
];

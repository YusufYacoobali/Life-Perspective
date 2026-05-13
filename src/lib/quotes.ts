export interface Quote {
  text: string;
  author: string;
}

export const QUOTES: Quote[] = [
  { text: 'The trouble is, you think you have time.', author: 'Jack Kornfield' },
  { text: 'Lost time is never found again.', author: 'Benjamin Franklin' },
  { text: 'The key is in not spending time, but in investing it.', author: 'Stephen R. Covey' },
  { text: 'Your time is limited, so do not waste it living someone else\'s life.', author: 'Steve Jobs' },
  { text: 'Time is what we want most, but what we use worst.', author: 'William Penn' },
  { text: 'The bad news is time flies. The good news is you\'re the pilot.', author: 'Michael Altshuler' },
  { text: 'In the end, it\'s not the years in your life that count. It\'s the life in your years.', author: 'Edward J. Stieglitz' },
  { text: 'Time is the most valuable thing a man can spend.', author: 'Theophrastus' },
  { text: 'Dost thou love life? Then do not squander time, for that is the stuff life is made of.', author: 'Benjamin Franklin' },
  { text: 'The two most powerful warriors are patience and time.', author: 'Leo Tolstoy' },
  { text: 'Time you enjoy wasting is not wasted time.', author: 'Marthe Troly-Curtin' },
  { text: 'Until you value yourself, you will not value your time.', author: 'M. Scott Peck' },
  { text: 'The future is something which everyone reaches at the rate of sixty minutes an hour.', author: 'C.S. Lewis' },
  { text: 'Life is short. Do stuff that matters.', author: 'Siqi Chen' },
  { text: 'The present moment is all you ever have.', author: 'Eckhart Tolle' },
  { text: 'How we spend our days is, of course, how we spend our lives.', author: 'Annie Dillard' },
  { text: 'Don\'t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' },
  { text: 'It\'s not that I\'m so smart, it\'s just that I stay with problems longer.', author: 'Albert Einstein' },
  { text: 'To realize the value of one year, ask a student who has failed a grade.', author: 'Marc Levy' },
  { text: 'To realize the value of one month, ask a mother who has given birth to a premature baby.', author: 'Marc Levy' },
  { text: 'To realize the value of one week, ask the editor of a weekly newspaper.', author: 'Marc Levy' },
  { text: 'To realize the value of one day, ask someone who has just had a car accident.', author: 'Marc Levy' },
  { text: 'To realize the value of one hour, ask the lovers who are waiting to meet.', author: 'Marc Levy' },
  { text: 'You must master your time rather than becoming a slave to the constant flow of events.', author: 'Brian Tracy' },
  { text: 'Time is the scarcest resource. Unless it is managed, nothing else can be managed.', author: 'Peter Drucker' },
  { text: 'The shorter our time, the greater our capacity for living.', author: 'Albert Camus' },
  { text: 'One day you will wake up and there won\'t be any more time to do the things you\'ve always wanted.', author: 'Paulo Coelho' },
  { text: 'Guard well your spare moments. They are like uncut diamonds.', author: 'Ralph Waldo Emerson' },
  { text: 'The purpose of life is to live it, to taste experience to the utmost.', author: 'Eleanor Roosevelt' },
  { text: 'Life is not measured by the number of breaths you take, but by every moment that takes your breath away.', author: 'Vicki Corona' },
];

export function getDailyQuote(): Quote {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return QUOTES[dayOfYear % QUOTES.length];
}

export function getRandomQuote(): Quote {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

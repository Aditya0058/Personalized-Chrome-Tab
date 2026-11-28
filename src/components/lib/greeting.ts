export type TimeSlot =
  | 'lateNight'
  | 'earlyMorning'
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'night';

export interface Greeting {
  text: string;
  punct: ',' | '?' | '!';
}

/**
 * Time slots (local browser time):
 *   00–04  lateNight     — still awake
 *   05–06  earlyMorning  — rising
 *   07–11  morning
 *   12–16  afternoon
 *   17–20  evening
 *   21–23  night         — winding down
 */
export function getTimeSlot(date = new Date()): TimeSlot {
  const h = date.getHours();
  if (h < 5) return 'lateNight';
  if (h < 7) return 'earlyMorning';
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  if (h < 21) return 'evening';
  return 'night';
}

const GREETINGS: Record<TimeSlot, Greeting[]> = {
  lateNight: [
    { text: 'Still up', punct: '?' },
    { text: 'Burning the midnight oil', punct: ',' },
    { text: 'Night owl hours', punct: ',' },
    { text: 'Working late', punct: '?' },
  ],
  earlyMorning: [
    { text: 'Rise and shine', punct: ',' },
    { text: 'Up before the sun', punct: ',' },
    { text: 'Early bird', punct: ',' },
  ],
  morning: [
    { text: 'Good morning', punct: ',' },
    { text: 'Top of the morning', punct: ',' },
    { text: 'Morning', punct: ',' },
  ],
  afternoon: [
    { text: 'Good afternoon', punct: ',' },
    { text: 'Hope your day is going well', punct: ',' },
    { text: 'Afternoon', punct: ',' },
  ],
  evening: [
    { text: 'Good evening', punct: ',' },
    { text: 'Hope you had a good one', punct: ',' },
    { text: 'Evening', punct: ',' },
  ],
  night: [
    { text: 'Good night', punct: ',' },
    { text: 'Winding down', punct: '?' },
    { text: 'Time to rest', punct: ',' },
  ],
};

export function getGreeting(date = new Date()): Greeting {
  const slot = getTimeSlot(date);
  const pool = GREETINGS[slot];
  // Seed by calendar day → stable across re-renders, changes day-to-day
  const daySeed = Math.floor(date.getTime() / 86_400_000);
  return pool[daySeed % pool.length];
}
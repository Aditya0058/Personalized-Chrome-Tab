import { useEffect, useState } from 'react';
import { getGreeting, type Greeting } from './greeting';

export function useGreeting(): Greeting {
  // Lazy init — computes once on mount, not on every render
  const [greeting, setGreeting] = useState<Greeting>(() => getGreeting());

  useEffect(() => {
    // Re-check every minute — cheap, and picks up slot changes
    // (morning → afternoon at 12:00, etc.)
    const id = setInterval(() => setGreeting(getGreeting()), 60_000);
    return () => clearInterval(id);
  }, []);

  return greeting;
}
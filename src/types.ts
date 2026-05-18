export type EventCategory = 'Concert' | 'Festival' | 'Exhibition' | 'Social' | 'Other';

export interface Event {
  id: string;
  eventName: string;
  date: string; // DD.MM.YYYY
  time: string;
  venue: string;
  category: EventCategory;
  description: string;
  source?: string;
}

export interface ExtractionResult {
  events: Omit<Event, 'id'>[];
}

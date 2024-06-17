"use client";

interface EventDetailsProps {
  event: {
    title: string;
    date: string;
    venue: string;
    details: string;
    imageUrl?: string;
  };
}

export const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  return (
    <div>
      <h1>{event.title}</h1>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      <p>Venue: {event.venue}</p>
      <p>Details: {event.details}</p>
      {event.imageUrl && <img src={event.imageUrl} alt={event.title} />}
    </div>
  );
};

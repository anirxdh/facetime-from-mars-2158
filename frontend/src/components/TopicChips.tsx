"use client";

import { useState, useEffect, useCallback } from "react";

const ALL_TOPICS = [
  "Ask about Mars food",
  "What's school like?",
  "Tell me about Pixel",
  "Mars sunsets",
  "Low-grav basketball",
  "What's RedFeed?",
];

function pickRandom(count: number): string[] {
  const shuffled = [...ALL_TOPICS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

interface TopicChipsProps {
  onSelect: (text: string) => void;
}

export function TopicChips({ onSelect }: TopicChipsProps) {
  const [topics, setTopics] = useState<string[]>([]);

  // Pick 3 random topics on mount and reshuffle when component remounts
  useEffect(() => {
    setTopics(pickRandom(3));
  }, []);

  const handleClick = useCallback(
    (topic: string) => {
      onSelect(topic);
      // Reshuffle after selecting so next time they see new topics
      setTopics(pickRandom(3));
    },
    [onSelect]
  );

  if (topics.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {topics.map((topic, i) => (
        <button
          key={topic}
          onClick={() => handleClick(topic)}
          className="topic-chip px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wide
            bg-orange-500/8 text-orange-300/70 border border-orange-400/15
            hover:bg-orange-500/15 hover:text-orange-200 hover:border-orange-400/30
            transition-colors duration-200 cursor-pointer"
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          {topic}
        </button>
      ))}
    </div>
  );
}

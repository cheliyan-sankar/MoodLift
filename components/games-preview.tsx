'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Game = {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  color_from: string;
  color_to: string;
  cover_image_url?: string;
};

const GAME_ROUTES: { [key: string]: string } = {
  'diaphragmatic breathing': '/games/diaphragmatic-breathing',
  'box breathing': '/games/box-breathing',
  '4-7-8 breathing': '/games/four-seven-eight-breathing',
  'alternate nostril breathing': '/games/alternate-nostril-breathing',
  'posture and body reset': '/games/posture-reset',
  'describe the room technique': '/games/describe-room',
  'name the moment technique': '/games/name-the-moment',
  'self-soothing (dbt technique)': '/games/self-soothing',
  'cognitive grounding': '/games/cognitive-grounding',
  'physical grounding': '/games/physical-grounding',
};

export function GamesPreview() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setGames(data || []);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGameRoute = (title: string) => {
    return GAME_ROUTES[title.toLowerCase()] || '/';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
          <Card key={i} className="h-48 sm:h-56 bg-gradient-to-br from-gray-100 to-gray-50 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {games.map(game => (
          <Card
            key={game.id}
            className="group hover:shadow-xl transition-all duration-300 overflow-hidden h-full hover:scale-105 transform"
          >
            {game.cover_image_url ? (
              <div className="h-24 sm:h-28 md:h-32 relative overflow-hidden">
                <img
                  src={game.cover_image_url}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                />
              </div>
            ) : (
              <div
                className="h-24 sm:h-28 md:h-32 bg-gradient-to-br relative overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${game.color_from} 0%, ${game.color_to} 100%)`,
                }}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
              </div>
            )}
            <CardContent className="p-3 sm:p-4 md:p-5 flex flex-col h-full justify-between">
              <div>
                <h3 className="font-bold text-primary line-clamp-2 mb-2 text-xs sm:text-sm md:text-base">{game.title}</h3>
                <p className="text-xs text-muted-foreground mb-2 inline-block px-2 py-1 bg-gray-100 rounded-full">
                  {game.category}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3">
                  {game.description}
                </p>
              </div>
              <Link href={getGameRoute(game.title)} className="w-full">
                <Button size="sm" className="w-full sm:w-auto bg-gradient-to-r text-xs sm:text-sm md:text-base from-primary to-accent hover:opacity-90 text-xs sm:text-sm">
                  Start
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Link href="/discover">
          <Button size="lg" variant="outline" className="border-2 text-xs sm:text-sm md:text-base">
            View All Activities & Favorites
          </Button>
        </Link>
      </div>
    </div>
  );
}

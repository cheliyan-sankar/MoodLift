'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pin, BookOpen, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

type FavoriteItem = {
  id: string;
  title: string;
  description?: string;
  author?: string;
  type: 'game' | 'book';
  color: string;
  icon?: string;
  genre?: string;
  category?: string;
  cover_image_url?: string;
};

export function FavoritesSection() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data: favoritesData, error: favError } = await supabase
        .from('user_favorites')
        .select('item_id, item_type')
        .eq('user_id', user.id);

      if (favError) throw favError;

      const gameIds = favoritesData?.filter(f => f.item_type === 'game').map(f => f.item_id) || [];
      const bookIds = favoritesData?.filter(f => f.item_type === 'book').map(f => f.item_id) || [];

      const items: FavoriteItem[] = [];

      if (gameIds.length > 0) {
        const { data: gamesData } = await supabase
          .from('games')
          .select('*')
          .in('id', gameIds);

        if (gamesData) {
          items.push(
            ...gamesData.map((game) => ({
              id: game.id,
              title: game.title,
              description: game.description,
              type: 'game' as const,
              color: game.color_from,
              icon: game.icon,
              category: game.category,
            }))
          );
        }
      }

      if (bookIds.length > 0) {
        const { data: booksData } = await supabase
          .from('books')
          .select('*')
          .in('id', bookIds);

        if (booksData) {
          items.push(
            ...booksData.map((book) => ({
              id: book.id,
              title: book.title,
              description: book.description,
              author: book.author,
              type: 'book' as const,
              color: book.cover_color,
              genre: book.genre,
              cover_image_url: book.cover_image_url,
            }))
          );
        }
      }

      setFavorites(items);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (itemId: string, itemType: 'game' | 'book') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('item_type', itemType)
        .eq('item_id', itemId);

      if (error) throw error;

      setFavorites(favorites.filter(f => f.id !== itemId));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const getIconComponent = (iconName?: string) => {
    const icons: { [key: string]: string } = {
      brain: '🧠',
      'flower-2': '🌸',
      lightbulb: '💡',
      target: '🎯',
      heart: '❤️',
      'book-open': '📖',
    };
    return icons[iconName || ''] || '🎮';
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Card className="border-2">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#3C1F71' }} />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (favorites.length === 0) {
    return (
      <Card className="border-2 bg-gradient-to-br from-gray-50 to-white">
        <CardContent className="p-6 sm:p-8 md:p-12 text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Favorites Yet</h3>
          <p className="text-gray-500">
            Start pinning games and books to see them here!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {favorites.map((item, index) => (
        <Card
          key={item.id}
          className="group relative border-2 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden animate-in fade-in-50 slide-in-from-bottom-4"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeFromFavorites(item.id, item.type)}
            className="absolute top-2 right-2 z-10 text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
            aria-label="Remove from favorites"
          >
            <Pin className="w-4 h-4 fill-current rotate-45" />
          </Button>

          {item.type === 'game' ? (
            <div
              className="h-20 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundColor: item.color }}
            >
              <div className="text-4xl transition-transform duration-300 group-hover:scale-110">
                {getIconComponent(item.icon)}
              </div>
            </div>
          ) : item.cover_image_url ? (
            <div className="relative h-20 overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <img
                src={item.cover_image_url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className="h-20 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundColor: item.color }}
            >
              <BookOpen className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110" />
            </div>
          )}

          <CardContent className="p-4">
            <h4 className="font-bold text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {item.title}
            </h4>
            {item.author && (
              <p className="text-xs text-gray-600 mb-1">by {item.author}</p>
            )}
            <p className="text-xs text-gray-500 line-clamp-2 mb-2">
              {item.description}
            </p>
            <span
              className="inline-block text-xs font-semibold px-2 py-1 rounded-full"
              style={{
                backgroundColor: `${item.color}20`,
                color: item.color,
              }}
            >
              {item.category || item.genre}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

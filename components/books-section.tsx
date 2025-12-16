'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pin, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_color: string;
  genre: string;
  cover_image_url?: string;
};

export function BooksSection() {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [pinnedBooks, setPinnedBooks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
    if (user) {
      fetchPinnedBooks();
    }
  }, [user]);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPinnedBooks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('item_id')
        .eq('user_id', user.id)
        .eq('item_type', 'book');

      if (error) throw error;
      setPinnedBooks(new Set(data?.map(f => f.item_id) || []));
    } catch (error) {
      console.error('Error fetching pinned books:', error);
    }
  };

  const togglePin = async (bookId: string) => {
    if (!user) return;

    try {
      const isPinned = pinnedBooks.has(bookId);

      if (isPinned) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('item_type', 'book')
          .eq('item_id', bookId);

        if (error) throw error;

        const newPinned = new Set(pinnedBooks);
        newPinned.delete(bookId);
        setPinnedBooks(newPinned);
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            item_type: 'book',
            item_id: bookId,
          });

        if (error) throw error;

        const newPinned = new Set(pinnedBooks);
        newPinned.add(bookId);
        setPinnedBooks(newPinned);
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="border-2 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg" />
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {books.map((book, index) => {
        const isPinned = pinnedBooks.has(book.id);
        return (
          <Link key={book.id} href={`/books/${book.id}`}>
            <Card
              className="group relative border-2 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden animate-in fade-in-50 slide-in-from-bottom-4 cursor-pointer h-full"
              style={{ animationDelay: `${index * 100}ms` }}
            >
            {user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => togglePin(book.id)}
                className={`absolute top-4 right-4 z-10 transition-all duration-300 ${
                  isPinned
                    ? 'text-white bg-white/20 backdrop-blur-sm hover:bg-white/30'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-white/50 backdrop-blur-sm'
                }`}
                aria-label={isPinned ? 'Unpin book' : 'Pin book'}
              >
                <Pin
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isPinned ? 'fill-current rotate-45' : ''
                  }`}
                />
              </Button>
            )}

            {book.cover_image_url ? (
              <div className="relative h-48 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <img
                  src={book.cover_image_url}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className="relative h-48 flex items-center justify-center p-6 transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundColor: book.cover_color }}
              >
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-4 border-2 border-white rounded-lg" />
                </div>
                <div className="relative z-10 text-center">
                  <BookOpen className="w-16 h-16 text-white mx-auto mb-3 transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="text-white font-bold text-lg line-clamp-2">
                    {book.title}
                  </h3>
                </div>
              </div>
            )}

            <CardContent className="p-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                by {book.author}
              </p>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {book.description}
              </p>
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: `${book.cover_color}20`,
                    color: book.cover_color,
                  }}
                >
                  {book.genre}
                </span>
              </div>
            </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

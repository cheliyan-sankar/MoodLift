'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Save, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Book {
  id: string;
  title: string;
  author: string;
  cover_image_url?: string;
  recommended_by?: string;
  recommendation_reason?: string;
  amazon_affiliate_link?: string;
  flipkart_affiliate_link?: string;
}

export default function BooksCoversAdmin() {
  const { user } = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    checkAdminAndFetch();
  }, [user]);

  const checkAdminAndFetch = async () => {
    if (!user) {
      router.push('/admin/login');
      return;
    }

    try {
      const response = await fetch('/api/admin/check-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await response.json();
      if (!data.isAdmin) {
        router.push('/admin/login');
        return;
      }

      await fetchBooks();
    } catch (err) {
      setError('Failed to verify admin access');
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/admin/books');
      const data = await response.json();
      setBooks(data.books || []);
      if (data.books?.length > 0) {
        setSelectedBook(data.books[0]);
      }
    } catch (err) {
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const uploadCoverImage = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/assets', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      return data.asset?.url || data.url || null;
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload image');
      return null;
    }
  };

  const handleSave = async () => {
    if (!selectedBook) return;

    setSaving(true);
    setError('');

    try {
      const response = await fetch('/api/admin/books', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedBook),
      });

      if (!response.ok) throw new Error('Failed to save');

      setSuccess('Book cover updated successfully!');
      await fetchBooks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save book cover');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Manage Books Details</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Books List */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Books</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                {books.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => setSelectedBook(book)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition ${
                      selectedBook?.id === book.id
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="font-medium text-sm">{book.title}</div>
                    <div className="text-xs text-gray-600">{book.author}</div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Edit Form */}
          <div className="md:col-span-2">
            {selectedBook && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{selectedBook.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Cover Image</label>
                    <div className="flex gap-4 items-start">
                      <Input
                        value={selectedBook.cover_image_url || ''}
                        onChange={(e) =>
                          setSelectedBook({
                            ...selectedBook,
                            cover_image_url: e.target.value,
                          })
                        }
                        placeholder="https://example.com/image.jpg"
                        className="flex-1"
                      />
                      <div
                        className="border-2 border-dashed rounded-lg p-3 text-center cursor-pointer w-36 h-12 flex items-center justify-center"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = async (e: any) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const url = await uploadCoverImage(file);
                            if (url) setSelectedBook({ ...selectedBook, cover_image_url: url });
                          };
                          input.click();
                        }}
                      >
                        Upload
                      </div>
                    </div>
                  </div>

                  {selectedBook.cover_image_url && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Preview</label>
                      <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={selectedBook.cover_image_url}
                          alt={selectedBook.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-lg mb-4">Recommendation Information</h3>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Recommended By (Name/Organization)</label>
                      <Input
                        value={selectedBook.recommended_by || ''}
                        onChange={(e) =>
                          setSelectedBook({
                            ...selectedBook,
                            recommended_by: e.target.value,
                          })
                        }
                        placeholder="e.g., Dr. Sarah Johnson, Mental Health Expert"
                        className="w-full"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Recommendation Reason</label>
                      <textarea
                        value={selectedBook.recommendation_reason || ''}
                        onChange={(e) =>
                          setSelectedBook({
                            ...selectedBook,
                            recommendation_reason: e.target.value,
                          })
                        }
                        placeholder="Why this book is recommended..."
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-lg mb-4">Affiliate Links</h3>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Amazon Affiliate Link</label>
                      <Input
                        value={selectedBook.amazon_affiliate_link || ''}
                        onChange={(e) =>
                          setSelectedBook({
                            ...selectedBook,
                            amazon_affiliate_link: e.target.value,
                          })
                        }
                        placeholder="https://amazon.in/dp/..."
                        className="w-full"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Flipkart Affiliate Link</label>
                      <Input
                        value={selectedBook.flipkart_affiliate_link || ''}
                        onChange={(e) =>
                          setSelectedBook({
                            ...selectedBook,
                            flipkart_affiliate_link: e.target.value,
                          })
                        }
                        placeholder="https://flipkart.com/..."
                        className="w-full"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save All Changes'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

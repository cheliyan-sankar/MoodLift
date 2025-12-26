'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Trash2, Edit2 } from 'lucide-react';
import Link from 'next/link';
import { AppFooter } from '@/components/app-footer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DEFAULT_FAQS, type DefaultFaqPage } from '@/lib/default-faqs';

interface FAQ {
  id: string;
  page: string;
  question: string;
  answer: string;
  sort_order: number;
  active: boolean;
}

const PAGES = [
  { value: 'home', label: 'Home Page' },
  { value: 'games', label: 'Games Page' },
  { value: 'discover', label: 'Discover Page' },
  { value: 'assessment', label: 'Assessment Page' },
];

export default function FAQsManagement() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [seededPages, setSeededPages] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    sort_order: 0,
  });

  useEffect(() => {
    fetchFaqs();
  }, [selectedPage]);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/faqs?page=${selectedPage}`);
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const message = data?.error || 'Failed to load FAQs';
        console.error('Error fetching FAQs:', message);
        alert(message);
        setFaqs([]);
        return;
      }
      const nextFaqs = (data.data || []) as FAQ[];
      setFaqs(nextFaqs);

      // If DB is empty for this page, seed with the defaults used on the public site.
      if (nextFaqs.length === 0 && !seededPages[selectedPage]) {
        const defaults = DEFAULT_FAQS[selectedPage as DefaultFaqPage];
        if (defaults && defaults.length > 0) {
          setSeededPages((prev) => ({ ...prev, [selectedPage]: true }));
          const seedRes = await fetch('/api/admin/faqs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: defaults.map((it) => ({
                page: selectedPage,
                question: it.question,
                answer: it.answer,
                sort_order: it.sort_order,
                active: true,
              })),
            }),
          });

          if (!seedRes.ok) {
            const seedData = await seedRes.json().catch(() => null);
            const message = seedData?.error || 'Failed to seed default FAQs';
            console.error('Error seeding FAQs:', message);
            alert(message);
            return;
          }

          // Re-fetch to show seeded FAQs
          const seededRes = await fetch(`/api/admin/faqs?page=${selectedPage}`);
          const seededData = await seededRes.json();
          setFaqs((seededData.data || []) as FAQ[]);
        }
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.question || !formData.answer) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const normalizedSortOrder = Number.isFinite(formData.sort_order)
        ? formData.sort_order
        : 0;

      const url = '/api/admin/faqs';
      const method = editingFaq ? 'PUT' : 'POST';
      const body = editingFaq
        ? {
            id: editingFaq.id,
            page: selectedPage,
            ...formData,
            sort_order: normalizedSortOrder,
            active: true,
          }
        : {
            page: selectedPage,
            ...formData,
            sort_order: normalizedSortOrder,
            active: true,
          };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const message = data?.error || 'Failed to save FAQ';
        console.error('Error saving FAQ:', message);
        alert(message);
        return;
      }

      setFormData({ question: '', answer: '', sort_order: 0 });
      setEditingFaq(null);
      setIsDialogOpen(false);
      fetchFaqs();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      alert('Failed to save FAQ');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      sort_order: faq.sort_order,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/faqs?id=${id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const message = data?.error || 'Failed to delete FAQ';
        console.error('Error deleting FAQ:', message);
        alert(message);
        return;
      }
      fetchFaqs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      alert('Failed to delete FAQ');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingFaq(null);
    setFormData({ question: '', answer: '', sort_order: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/20 to-accent/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/admin/dashboard">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Manage FAQs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap mb-6">
              {PAGES.map((page) => (
                <Button
                  key={page.value}
                  variant={selectedPage === page.value ? 'default' : 'outline'}
                  onClick={() => setSelectedPage(page.value)}
                >
                  {page.label}
                </Button>
              ))}
            </div>

            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-to-r from-primary to-accent mb-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New FAQ
            </Button>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : faqs.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-muted-foreground">No FAQs added for this page yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <Card key={faq.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-primary mb-2">{faq.question}</h3>
                          <p className="text-gray-700 text-sm mb-3">{faq.answer}</p>
                          <p className="text-xs text-muted-foreground">Order: {faq.sort_order}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(faq)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(faq.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* FAQ Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</DialogTitle>
            <DialogDescription>
              Add or edit a FAQ for the {PAGES.find((p) => p.value === selectedPage)?.label}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-primary mb-2 block">Question</label>
              <input
                type="text"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Enter FAQ question"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-primary mb-2 block">Answer</label>
              <textarea
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Enter FAQ answer"
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-primary mb-2 block">Sort Order</label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  setFormData({
                    ...formData,
                    sort_order: nextValue === '' ? 0 : Number.parseInt(nextValue, 10),
                  });
                }}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-primary to-accent"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save FAQ'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <AppFooter />
    </div>
  );
}

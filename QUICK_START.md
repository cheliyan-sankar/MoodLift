# Quick Start Guide: Games & Books Features

## For Developers

### Running the Application

1. **Start the development server** (already running automatically):
   ```bash
   npm run dev
   ```

2. **Access the new features**:
   - Home page: `http://localhost:3000`
   - Discover page: `http://localhost:3000/discover`

3. **View the database**:
   - Check Supabase dashboard for tables: `games`, `books`, `user_favorites`

### Testing the Features

1. **Create a test account**:
   - Click "Login" button on home page
   - Switch to "Sign Up" tab
   - Enter test credentials
   - Sign up

2. **Access Discover page**:
   - Click "Discover" in navigation (appears after login)
   - You'll see three sections: Favorites, Games, Books

3. **Test pinning**:
   - Hover over any game or book card
   - Click the pin icon in top-right corner
   - Watch it animate (rotates 45°, fills with color)
   - Check Favorites section - item appears there

4. **Test unpinning**:
   - Click pin icon again to unpin
   - Or click pin in Favorites section
   - Item removes with smooth animation

### Code Structure

```
Discover Page (/app/discover/page.tsx)
├── Test Assessment Section
├── Favorites Section (components/favorites-section.tsx)
│   └── Fetches all user's pinned items
├── Games Section (components/games-section.tsx)
│   └── Displays 6 games with pin buttons
└── Books Section (components/books-section.tsx)
    └── Displays 6 books with pin buttons
```

### Key Functions

**Pin a game:**
```typescript
await supabase.from('user_favorites').insert({
  user_id: user.id,
  item_type: 'game',
  item_id: gameId,
});
```

**Unpin a game:**
```typescript
await supabase.from('user_favorites').delete()
  .eq('user_id', user.id)
  .eq('item_type', 'game')
  .eq('item_id', gameId);
```

**Fetch favorites:**
```typescript
const { data } = await supabase
  .from('user_favorites')
  .select('item_id, item_type')
  .eq('user_id', user.id);
```

### Customization

**Add a new game:**
```sql
INSERT INTO games (title, description, category, icon, color_from, color_to)
VALUES ('New Game', 'Description', 'Category', 'icon-name', '#FF0000', '#00FF00');
```

**Add a new book:**
```sql
INSERT INTO books (title, author, description, cover_color, genre)
VALUES ('New Book', 'Author Name', 'Description', '#3C1F71', 'Genre');
```

**Change animation timing:**
```typescript
// In component file, find:
style={{ animationDelay: `${index * 100}ms` }}

// Change 100 to desired milliseconds:
style={{ animationDelay: `${index * 50}ms` }} // Faster
style={{ animationDelay: `${index * 200}ms` }} // Slower
```

**Change grid columns:**
```typescript
// In component, find:
className="grid md:grid-cols-3 gap-6"

// Change number:
className="grid md:grid-cols-4 gap-6" // 4 columns
className="grid md:grid-cols-2 gap-6" // 2 columns
```

### Debugging

**Check if user is authenticated:**
```typescript
const { user } = useAuth();
console.log('Current user:', user);
```

**Check pinned items:**
```typescript
console.log('Pinned games:', pinnedGames);
console.log('Pinned books:', pinnedBooks);
```

**Check database records:**
```sql
-- View all favorites
SELECT * FROM user_favorites;

-- View for specific user
SELECT * FROM user_favorites WHERE user_id = 'user-uuid';
```

### Common Issues

**Issue**: Pin button doesn't work
**Solution**: Ensure user is logged in. Check browser console for errors.

**Issue**: Favorites section empty after pinning
**Solution**: Check RLS policies. Verify `user_id` matches authenticated user.

**Issue**: Cards not animating
**Solution**: Check browser console for CSS errors. Ensure Tailwind config includes animations.

**Issue**: Build fails
**Solution**: Run `npm run build` and check error messages. Ensure all imports are correct.

## For Users

### How to Use

1. **Log in to your account**
   - Click "Login" button in top navigation
   - Enter your credentials or sign up

2. **Navigate to Discover**
   - Click "Discover" link in navigation
   - You'll see wellness games and book recommendations

3. **Pin your favorites**
   - Browse through games and books
   - Click the pin icon (📌) on cards you like
   - Pinned items appear in "Your Favorites" section

4. **Manage favorites**
   - View all favorites at the top of Discover page
   - Click pin icon again to remove from favorites
   - Favorites sync across devices

5. **Explore content**
   - Hover over cards to see animations
   - Read descriptions to find what interests you
   - Use categories/genres to filter mentally

### Tips

- Pin items you want quick access to
- Check Favorites section regularly for inspiration
- Mix games and books for balanced wellness
- Remove items that no longer resonate

## Visual Guide

### Card States

**Normal State:**
- Flat card with border
- Gray pin icon (not filled)
- No shadow

**Hover State:**
- Card lifts up slightly
- Larger shadow appears
- Icon scales larger
- Smooth animation

**Pinned State:**
- Pin icon fills with color
- Icon rotates 45 degrees
- Appears in Favorites section
- White backdrop on pin button

### Animations

**On Page Load:**
- Cards fade in one by one
- Slide up from bottom
- Staggered timing (waterfall effect)

**On Hover:**
- Card moves up
- Shadow intensifies
- Icon zooms slightly
- Duration: 300ms

**On Pin Click:**
- Icon rotates 45°
- Fills with color
- Immediate feedback
- State saves to database

## Troubleshooting

### For Developers

**Problem**: TypeScript errors
```bash
npm run typecheck
```
Fix type errors shown in output.

**Problem**: Build fails
```bash
npm run build
```
Check error messages, fix imports/syntax.

**Problem**: Database queries fail
- Check Supabase dashboard
- Verify RLS policies
- Check environment variables

### For Users

**Problem**: Can't see Discover page
- Solution: Log in to your account first

**Problem**: Pin button doesn't work
- Solution: Refresh page, try logging out and back in

**Problem**: Favorites not saving
- Solution: Check internet connection, try again

## Resources

- Main docs: `GAMES_BOOKS_IMPLEMENTATION.md`
- Animation guide: `ANIMATION_GUIDE.md`
- Summary: `IMPLEMENTATION_SUMMARY.md`
- Supabase docs: https://supabase.com/docs
- Next.js docs: https://nextjs.org/docs
- Tailwind docs: https://tailwindcss.com/docs

## Support

For issues or questions:
1. Check browser console for errors
2. Review documentation files
3. Check Supabase dashboard for data
4. Verify authentication state
5. Test in different browser

---

**Quick Links:**
- Home: `/`
- Discover: `/discover`
- Dashboard: `/dashboard`
- Progress: `/progress`
- Assessment: `/assessment`

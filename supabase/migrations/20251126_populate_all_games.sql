/*
  # Populate All Games and Activities
  
  Insert all 10 games into the games table:
  - 4 Breathing Exercises
  - 6 Grounding Techniques
*/

-- Clear existing games if any
DELETE FROM games;

-- Insert all games
INSERT INTO games (title, description, category, icon, color_from, color_to) VALUES
  -- Breathing Exercises
  ('Diaphragmatic Breathing', 'Deep belly breathing technique to reduce stress and anxiety naturally', 'Breathing', 'heart', '#06B6D4', '#3B82F6'),
  ('Box Breathing', 'Navy SEAL breathing technique for staying calm under pressure with 4-4-4-4 pattern', 'Breathing', 'target', '#3B82F6', '#8B5CF6'),
  ('4-7-8 Breathing', 'Dr. Andrew Weil breathing technique - natural tranquilizer for the nervous system', 'Breathing', 'heart', '#8B5CF6', '#EC4899'),
  ('Alternate Nostril Breathing', 'Ancient yogic breathing technique that balances brain hemispheres and promotes deep relaxation', 'Breathing', 'flower-2', '#06B6D4', '#3B82F6'),
  
  -- Grounding Techniques
  ('Posture and Body Reset', 'Reset your body alignment and release physical tension through guided posture corrections and stretches.', 'Grounding', 'heart', '#06B6D4', '#3B82F6'),
  ('Describe the Room Technique', 'Ground yourself by engaging all five senses to connect with your immediate environment.', 'Grounding', 'eyes', '#10B981', '#34D399'),
  ('Name the Moment Technique', 'Practice self-reassurance with compassionate affirmations to acknowledge and soothe your emotions.', 'Grounding', 'heart', '#F59E0B', '#FB923C'),
  ('Self-Soothing (DBT Technique)', 'Use comfortable sensations like soft textures and calming scents to activate your parasympathetic nervous system.', 'Grounding', 'flower-2', '#EC4899', '#F43F5E'),
  ('Cognitive Grounding', 'Engage your mind with mental exercises like counting and naming to shift focus and ground yourself.', 'Grounding', 'brain', '#8B5CF6', '#A78BFA'),
  ('Physical Grounding', 'Use physical sensations like temperature changes and texture to anchor yourself to the present moment.', 'Grounding', 'activity', '#14B8A6', '#06B6D4');

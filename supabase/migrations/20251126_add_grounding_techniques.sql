/*
  # Add 6 Grounding Techniques to Games Table
  
  Adding mental health and grounding exercises:
  1. Posture and Body Reset
  2. Describe the Room Technique
  3. Name the Moment Technique
  4. Self-Soothing (DBT Technique)
  5. Cognitive Grounding
  6. Physical Grounding
*/

INSERT INTO games (title, description, category, icon, color_from, color_to) VALUES
  ('Posture and Body Reset', 'Reset your body alignment and release physical tension through guided posture corrections and stretches.', 'Grounding', 'heart', '#06B6D4', '#3B82F6'),
  ('Describe the Room Technique', 'Ground yourself by engaging all five senses to connect with your immediate environment.', 'Grounding', 'eyes', '#10B981', '#34D399'),
  ('Name the Moment Technique', 'Practice self-reassurance with compassionate affirmations to acknowledge and soothe your emotions.', 'Grounding', 'heart', '#F59E0B', '#FB923C'),
  ('Self-Soothing (DBT Technique)', 'Use comfortable sensations like soft textures and calming scents to activate your parasympathetic nervous system.', 'Grounding', 'flower-2', '#EC4899', '#F43F5E'),
  ('Cognitive Grounding', 'Engage your mind with mental exercises like counting and naming to shift focus and ground yourself.', 'Grounding', 'brain', '#8B5CF6', '#A78BFA'),
  ('Physical Grounding', 'Use physical sensations like temperature changes and texture to anchor yourself to the present moment.', 'Grounding', 'activity', '#14B8A6', '#06B6D4')
ON CONFLICT (title) DO NOTHING;

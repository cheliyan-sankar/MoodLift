import { supabase } from './supabase';

export async function setupProgressTables() {
  try {
    // Create game_sessions table
    const gameSessionsResult = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS game_sessions (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL,
          game_title TEXT NOT NULL,
          score NUMERIC DEFAULT 0,
          duration NUMERIC,
          mood_before NUMERIC,
          mood_after NUMERIC,
          completed_at TIMESTAMP DEFAULT NOW(),
          created_at TIMESTAMP DEFAULT NOW(),
          FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
        );
        
        CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_sessions(user_id);
        CREATE INDEX IF NOT EXISTS idx_game_sessions_completed_at ON game_sessions(completed_at);
      `,
    });
    
    if (gameSessionsResult.error) {
      console.log('Note: game_sessions table may need to be created manually in Supabase dashboard');
    }

    // Create assessment_results table
    const assessmentResultsResult = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS assessment_results (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL,
          score NUMERIC NOT NULL,
          insights TEXT,
          completed_at TIMESTAMP DEFAULT NOW(),
          created_at TIMESTAMP DEFAULT NOW(),
          FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
        );
        
        CREATE INDEX IF NOT EXISTS idx_assessment_results_user_id ON assessment_results(user_id);
        CREATE INDEX IF NOT EXISTS idx_assessment_results_completed_at ON assessment_results(completed_at);
      `,
    });
    
    if (assessmentResultsResult.error) {
      console.log('Note: assessment_results table may need to be created manually in Supabase dashboard');
    }
  } catch (error) {
    console.error('Error setting up tables:', error);
  }
}

// Call this on app initialization
export function initializeDatabase() {
  if (typeof window !== 'undefined') {
    // Only run on client side if needed
    setupProgressTables();
  }
}

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Response {
  question: string;
  answer: string;
}

interface RequestBody {
  responses: Response[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { responses }: RequestBody = await req.json();

    if (!responses || responses.length === 0) {
      return new Response(
        JSON.stringify({ error: "No responses provided" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const analysis = analyzeMood(responses);

    return new Response(
      JSON.stringify(analysis),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function analyzeMood(responses: Response[]) {
  let score = 0;
  const keywords = {
    positive: ["great", "good", "excellent", "happy", "energetic", "motivated", "calm", "relaxed", "confident"],
    neutral: ["okay", "fine", "alright", "moderate", "average", "normal"],
    negative: ["bad", "poor", "tired", "stressed", "anxious", "sad", "overwhelmed", "worried", "difficult"]
  };

  responses.forEach((response) => {
    const answer = response.answer.toLowerCase();
    
    if (keywords.positive.some(word => answer.includes(word))) {
      score += 20;
    } else if (keywords.neutral.some(word => answer.includes(word))) {
      score += 10;
    } else if (keywords.negative.some(word => answer.includes(word))) {
      score += 5;
    } else {
      score += 12;
    }
  });

  score = Math.min(100, score);

  let moodResult = "";
  let recommendations: string[] = [];

  if (score >= 80) {
    moodResult = "Excellent";
    recommendations = [
      "Your mood is very positive! Keep up the great habits.",
      "Continue practicing gratitude and mindfulness.",
      "Share your positive energy with others.",
      "Maintain your current self-care routine."
    ];
  } else if (score >= 60) {
    moodResult = "Good";
    recommendations = [
      "You're doing well overall. Keep building on this momentum.",
      "Try adding one new wellness activity to your routine.",
      "Practice deep breathing exercises daily.",
      "Spend time outdoors when possible."
    ];
  } else if (score >= 40) {
    moodResult = "Moderate";
    recommendations = [
      "Your mood could use some attention. Try our Calm Breath exercise.",
      "Consider journaling about your feelings.",
      "Reach out to friends or family for support.",
      "Engage in physical activity, even a short walk helps."
    ];
  } else {
    moodResult = "Needs Support";
    recommendations = [
      "Your responses suggest you may benefit from extra support.",
      "Try our Gratitude Garden to shift your perspective.",
      "Practice mindfulness exercises regularly.",
      "Consider talking to a mental health professional.",
      "Remember: It's okay to ask for help."
    ];
  }

  return {
    moodResult,
    moodScore: score,
    recommendations,
    timestamp: new Date().toISOString()
  };
}
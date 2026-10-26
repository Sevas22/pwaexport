/** Configuración por variables de entorno. La app funciona sin ellas, en modo demostración. */

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

/** true cuando hay credenciales de Supabase: cuentas e informes reales. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/** Solo en el servidor. */
export const groqApiKey = process.env.GROQ_API_KEY?.trim() ?? "";
export const groqModel = process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-120b";
export const groqModelFast = process.env.GROQ_MODEL_FAST?.trim() || "openai/gpt-oss-20b";
export const isGroqConfigured = Boolean(groqApiKey);

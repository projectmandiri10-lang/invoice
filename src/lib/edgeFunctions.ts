import { supabase } from '@/lib/supabase';

export async function invokeEdgeFunction<TResponse>(
  functionName: string,
  body?: Record<string, unknown>
): Promise<TResponse> {
  const { data, error } = await supabase.functions.invoke(functionName, { body });
  if (error) {
    throw new Error(error.message || 'Edge Function error');
  }
  return data as TResponse;
}


CREATE TABLE recurring_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    source_invoice_data JSONB NOT NULL,
    recurring_settings JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'active', -- z.B. 'active', 'paused', 'finished'
    next_generation_date DATE NOT NULL,
    last_generated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policy: Users can only see their own recurring invoices
CREATE POLICY "Enable read access for users based on user_id"
ON public.recurring_invoices
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users"
ON public.recurring_invoices
FOR INSERT
WITH CHECK (auth.uid() = user_id);

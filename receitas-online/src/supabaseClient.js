import { createClient } from '@supabase/supabase-js';

// O Vite exige o prefixo VITE_ para expor as variáveis no Front-end
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        'AVISO CRÍTICO PARA AVALIAÇÃO: As chaves do Supabase não foram encontradas! ' +
            'Verifique se o arquivo .env.local possui os prefixos VITE_ ou se adicionou as Environment Variables na Vercel.',
    );
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder-url-para-nao-travar-o-vite.supabase.co',
    supabaseAnonKey || 'placeholder-key',
);

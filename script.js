import { createClient } from '@supabase/supabase-js';
import { isAdminRequest } from './_auth.js';

// A service role key só existe aqui no servidor — nunca é exposta ao navegador.
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const SENTIMENTOS_VALIDOS = [
  'Bem',
  'Confuso(a)',
  'Triste',
  'Ansioso(a)',
  'Com raiva',
  'Precisando de apoio',
  'Esperançoso(a)',
  'Outro',
];

export default async function handler(req, res) {
  // -------- Envio público de uma nova mensagem --------
  if (req.method === 'POST') {
    const { sentimento, mensagem } = req.body || {};

    const sentimentoSeguro = SENTIMENTOS_VALIDOS.includes(sentimento) ? sentimento : null;
    const mensagemSegura =
      typeof mensagem === 'string' && mensagem.trim().length > 0
        ? mensagem.trim().slice(0, 1000)
        : null;

    if (!sentimentoSeguro && !mensagemSegura) {
      return res.status(400).json({ error: 'Nada para enviar' });
    }

    // Importante: nenhum dado pessoal é aceito ou armazenado (sem nome, IP,
    // localização, e-mail etc.) — só sentimento + texto + data automática.
    const { error } = await supabase
      .from('mensagens')
      .insert({ sentimento: sentimentoSeguro, mensagem: mensagemSegura });

    if (error) {
      console.error('Erro ao salvar mensagem:', error.message);
      return res.status(500).json({ error: 'Não foi possível salvar agora' });
    }

    return res.status(201).json({ ok: true });
  }

  // -------- Leitura (somente admin autenticado) --------
  if (req.method === 'GET') {
    if (!isAdminRequest(req)) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const { data, error } = await supabase
      .from('mensagens')
      .select('id, sentimento, mensagem, criado_em')
      .order('criado_em', { ascending: false });

    if (error) {
      console.error('Erro ao buscar mensagens:', error.message);
      return res.status(500).json({ error: 'Não foi possível carregar as mensagens' });
    }

    return res.status(200).json({ mensagens: data });
  }

  // -------- Exclusão de uma mensagem (somente admin) --------
  if (req.method === 'DELETE') {
    if (!isAdminRequest(req)) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const id = req.query?.id;
    if (!id) {
      return res.status(400).json({ error: 'ID não informado' });
    }

    const { error } = await supabase.from('mensagens').delete().eq('id', id);
    if (error) {
      console.error('Erro ao excluir mensagem:', error.message);
      return res.status(500).json({ error: 'Não foi possível excluir' });
    }

    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Método não permitido' });
}

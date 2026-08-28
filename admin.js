/* =========================================================
   Painel Administrativo — Setembro Amarelo
   ========================================================= */

const loginBox = document.getElementById('loginBox');
const panel = document.getElementById('panel');
const passwordInput = document.getElementById('passwordInput');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');

const messagesBody = document.getElementById('messagesBody');
const countLabel = document.getElementById('countLabel');
const emptyState = document.getElementById('emptyState');
const refreshBtn = document.getElementById('refreshBtn');
const exportBtn = document.getElementById('exportBtn');
const logoutBtn = document.getElementById('logoutBtn');

let currentMessages = [];

function showPanel() {
  loginBox.hidden = true;
  panel.hidden = false;
}

function showLogin() {
  panel.hidden = true;
  loginBox.hidden = false;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderMessages() {
  messagesBody.innerHTML = '';
  countLabel.textContent =
    currentMessages.length === 1 ? '1 mensagem' : `${currentMessages.length} mensagens`;
  emptyState.hidden = currentMessages.length !== 0;

  currentMessages.forEach((m) => {
    const tr = document.createElement('tr');
    const data = new Date(m.criado_em).toLocaleString('pt-BR');

    tr.innerHTML = `
      <td>${data}</td>
      <td>${m.sentimento ? escapeHtml(m.sentimento) : '—'}</td>
      <td>${m.mensagem ? escapeHtml(m.mensagem) : '<em>(sem texto)</em>'}</td>
      <td><button class="row-delete" data-id="${m.id}">Excluir</button></td>
    `;
    messagesBody.appendChild(tr);
  });

  messagesBody.querySelectorAll('.row-delete').forEach((btn) => {
    btn.addEventListener('click', () => deleteMessage(btn.dataset.id));
  });
}

async function tryLoadMessages() {
  countLabel.textContent = 'Carregando…';
  try {
    const res = await fetch('/api/mensagens', { credentials: 'include' });
    if (res.status === 401) {
      showLogin();
      return false;
    }
    const data = await res.json();
    currentMessages = data.mensagens || [];
    renderMessages();
    showPanel();
    return true;
  } catch {
    countLabel.textContent = 'Erro ao carregar mensagens.';
    return false;
  }
}

async function deleteMessage(id) {
  const confirmado = window.confirm('Excluir esta mensagem permanentemente? Essa ação não pode ser desfeita.');
  if (!confirmado) return;

  const res = await fetch(`/api/mensagens?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (res.ok) {
    currentMessages = currentMessages.filter((m) => m.id !== id);
    renderMessages();
  } else {
    alert('Não foi possível excluir a mensagem agora.');
  }
}

loginBtn.addEventListener('click', async () => {
  loginError.hidden = true;
  const senha = passwordInput.value.trim();
  if (!senha) return;

  loginBtn.disabled = true;
  try {
    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ senha }),
    });

    if (res.ok) {
      passwordInput.value = '';
      await tryLoadMessages();
    } else {
      loginError.textContent = 'Senha incorreta. Tente novamente.';
      loginError.hidden = false;
    }
  } catch {
    loginError.textContent = 'Erro de conexão. Tente novamente.';
    loginError.hidden = false;
  } finally {
    loginBtn.disabled = false;
  }
});

passwordInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') loginBtn.click();
});

refreshBtn.addEventListener('click', tryLoadMessages);

logoutBtn.addEventListener('click', async () => {
  await fetch('/api/admin-logout', { method: 'POST', credentials: 'include' });
  currentMessages = [];
  showLogin();
});

exportBtn.addEventListener('click', () => {
  if (!currentMessages.length) {
    alert('Não há mensagens para exportar.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const marginX = 44;
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = doc.internal.pageSize.getWidth() - marginX * 2;
  let y = 56;

  doc.setFont(undefined, 'bold');
  doc.setFontSize(16);
  doc.text('Setembro Amarelo — Mensagens para o universo', marginX, y);
  y += 20;

  doc.setFont(undefined, 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(110, 102, 86);
  doc.text(
    `Exportado em ${new Date().toLocaleString('pt-BR')} · ${currentMessages.length} mensagem(ns) · documento confidencial`,
    marginX,
    y
  );
  doc.setTextColor(20, 20, 20);
  y += 30;

  currentMessages.forEach((m, index) => {
    const data = new Date(m.criado_em).toLocaleString('pt-BR');
    const sentimento = m.sentimento || '—';
    const titulo = `#${index + 1} · ${data} · Sentimento: ${sentimento}`;

    if (y > pageHeight - 90) {
      doc.addPage();
      y = 56;
    }

    doc.setFont(undefined, 'bold');
    doc.setFontSize(11);
    doc.text(titulo, marginX, y);
    y += 16;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(10.5);
    const texto = m.mensagem || '(sem texto)';
    const linhas = doc.splitTextToSize(texto, maxWidth);

    linhas.forEach((linha) => {
      if (y > pageHeight - 60) {
        doc.addPage();
        y = 56;
      }
      doc.text(linha, marginX, y);
      y += 14;
    });

    y += 20;
  });

  doc.save(`setembro-amarelo-mensagens-${Date.now()}.pdf`);
});

// Ao abrir a página, tenta usar uma sessão já válida (cookie ainda ativo).
tryLoadMessages();

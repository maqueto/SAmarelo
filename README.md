<div align="center">

# 🎗️ Setembro Amarelo

### Um espaço acolhedor sobre saúde mental e valorização da vida

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](#)
[![No Dependencies](https://img.shields.io/badge/depend%C3%AAncias-nenhuma-4F9C8D?style=flat)](#)
[![License](https://img.shields.io/badge/licen%C3%A7a-MIT-FFC93C?style=flat)](#-licença)

**[Ver demo](#-como-executar) · [Reportar problema](../../issues) · [Créditos](#-créditos)**

</div>

---

> 🕊️ *"Você não precisa passar por tudo sozinho."*

Site estático desenvolvido para divulgar a campanha **Setembro Amarelo**, dedicada à prevenção do suicídio e à valorização da vida. Construído com **HTML, CSS e JavaScript puros** — sem frameworks, sem build, sem dependências — para ser leve, acessível e fácil de manter.

<br>

## 📑 Sumário

- [Sobre o projeto](#-sobre-o-projeto)
- [Demonstração](#-funcionalidades)
- [Tecnologias](#️-tecnologias)
- [Estrutura de pastas](#-estrutura-de-pastas)
- [Como executar](#-como-executar)
- [Identidade visual](#-identidade-visual)
- [Privacidade](#-privacidade)
- [Acessibilidade](#-acessibilidade)
- [Roadmap](#-roadmap)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)
- [Precisa de apoio agora?](#-precisa-de-apoio-agora)
- [Créditos](#-créditos)

<br>

## 💛 Sobre o projeto

Este site tem o objetivo de apresentar o Setembro Amarelo de forma **humana, informativa e acolhedora**, sem imagens perturbadoras ou linguagem que minimize o sofrimento. Ele explica a causa, orienta sobre como ajudar quem está passando por dificuldades emocionais e incentiva a busca por apoio profissional e de pessoas de confiança.

Foi criado originalmente como **projeto educativo**, em colaboração com estudantes do ensino técnico, unindo desenvolvimento front-end a uma causa de conscientização social.

<br>

## ✨ Funcionalidades

| Seção | O que faz |
|---|---|
| **Hero** | Abertura com mensagem principal e fundo animado de partículas suaves (canvas) |
| **O que é o Setembro Amarelo** | Explica origem, objetivo e importância da campanha em cards |
| **Como posso ajudar?** | Cards interativos — toque para revelar orientações práticas |
| **Quando procurar ajuda** | Rede de apoio (família, amigos, profissionais) + destaque para o **CVV — 188** |
| **Mensagem para o universo** | Espaço simbólico para escrever sentimentos, com seleção de humor e animação de envio — nada é salvo |
| **Você não está sozinho** | CTA que expande orientações de apoio imediato |
| **Mitos e verdades** | Acordeão interativo desfazendo crenças comuns sobre saúde mental |
| **Frases de acolhimento** | Carrossel de mensagens positivas |

Todas as interações — menu mobile, rolagem suave, revelação ao rolar a página, acordeão, cards e a animação da mensagem — são feitas em **JavaScript puro**, sem bibliotecas.

<br>

## 🛠️ Tecnologias

**Front-end**
- **HTML5** — estrutura semântica e acessível
- **CSS3** — design responsivo, variáveis de tema e animações
- **JavaScript (Vanilla)** — toda a interatividade, incluindo `IntersectionObserver` e `<canvas>`

**Back-end (painel administrativo)**
- **Vercel Functions** (serverless, Node.js) — API para salvar/ler/excluir mensagens
- **Supabase (Postgres)** — banco de dados gratuito para armazenar as mensagens de forma anônima
- **jsonwebtoken** — sessão de login do admin via cookie assinado
- **jsPDF** (via CDN) — exportação das mensagens para PDF direto no navegador

Sem React, Vue, Angular ou jQuery — o front-end continua 100% Vanilla.

<br>

## 📁 Estrutura de pastas

```
setembro-amarelo/
│
├── index.html            # estrutura e conteúdo do site
├── style.css             # identidade visual, layout e animações
├── script.js             # interações e lógica da página (envia mensagens à API)
│
├── admin.html            # painel administrativo (protegido por senha)
├── admin.css             # estilo do painel
├── admin.js              # login, listagem, exclusão e exportação em PDF
│
├── api/                  # funções serverless (Vercel)
│   ├── _auth.js          # helper de sessão/JWT do admin
│   ├── mensagens.js      # POST (público) · GET/DELETE (admin) das mensagens
│   ├── admin-login.js    # verifica a senha e cria o cookie de sessão
│   └── admin-logout.js   # encerra a sessão do admin
│
├── supabase-setup.sql    # script para criar a tabela no Supabase
├── package.json          # dependências do back-end (@supabase/supabase-js, jsonwebtoken)
├── .env.example          # modelo das variáveis de ambiente necessárias
├── README.md             # este arquivo
└── assets/               # pasta reservada para imagens/ícones adicionais
```

<br>

## ▶️ Como executar

Não há build, instalação ou servidor necessário.

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/setembro-amarelo.git

# 2. Entre na pasta
cd setembro-amarelo

# 3. Abra o index.html no navegador
```

Ou simplesmente dê duplo clique em `index.html`. Funciona 100% offline, em celulares, tablets, notebooks e desktops.

<br>

## 🎨 Identidade visual

| Token | Valor | Uso |
|---|---|---|
| `--color-primary` | `#FFC93C` | Cor principal — amarelo acolhedor |
| `--color-primary-dark` | `#E7A400` | Hover e contraste sobre amarelo |
| `--color-support` | `#4F9C8D` | Ações de apoio/ajuda (verde-azulado suave) |
| `--color-bg` | `#FFFDF6` | Fundo principal |
| `--color-bg-alt` | `#FFF6DC` | Fundo alternado das seções |
| `--font-display` | `Fraunces` | Títulos — serifada e calorosa |
| `--font-body` | `Inter` | Texto corrido — legibilidade |
| `--font-utility` | `Quicksand` | Botões e rótulos |

Cantos arredondados, sombras suaves e animações discretas reforçam a proposta de acolhimento visual da campanha.

<br>

## 🔒 Privacidade

A seção **"Mensagem para o universo"** foi projetada com privacidade em primeiro lugar:

- ❌ Não coleta nome, telefone, endereço, escola ou localização
- ❌ Nenhuma mensagem é salva, enviada a um servidor ou publicada
- ✅ Aviso explícito para não compartilhar dados pessoais
- ✅ Tratada como forma **simbólica** de expressão — nunca como substituto de apoio profissional

<br>

## ♿ Acessibilidade

- HTML semântico (`header`, `main`, `section`, `footer`, `nav`)
- Link de "pular para o conteúdo" para navegação por teclado
- Contraste de cores cuidado entre texto e fundo
- Foco visível (`:focus-visible`) em todos os elementos interativos
- Atributos `aria-expanded`, `aria-label` e `aria-hidden` usados corretamente
- Suporte a `prefers-reduced-motion`

<br>

## 🗄️ Banco de dados e painel administrativo

As mensagens da seção **"Mensagem para o universo"** são salvas de forma **anônima** (sem nome, e-mail, telefone ou localização) em um banco Postgres gratuito no [Supabase](https://supabase.com), e podem ser lidas e exportadas em PDF através do painel `/admin.html`.

### 1. Criar o banco no Supabase

1. Crie uma conta gratuita em [supabase.com](https://supabase.com) e um novo projeto
2. Vá em **SQL Editor** → **New query**, cole o conteúdo de [`supabase-setup.sql`](./supabase-setup.sql) e clique em **Run**
3. Vá em **Settings → API** e copie:
   - `Project URL` → será sua `SUPABASE_URL`
   - `service_role` key (não a `anon`!) → será sua `SUPABASE_SERVICE_ROLE_KEY`

### 2. Configurar as variáveis de ambiente

Copie `.env.example` para `.env.local` (uso local) e preencha:

```env
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_PASSWORD=escolha-uma-senha-forte
JWT_SECRET=gere-uma-string-aleatoria-longa
```

> Gere o `JWT_SECRET` com `openssl rand -hex 32` (ou qualquer gerador de senha longo).

No **Vercel**: vá em **Project → Settings → Environment Variables** e adicione as 4 variáveis acima em produção. Depois, faça um novo deploy (ou `Redeploy`) para que elas entrem em vigor.

### 3. Instalar as dependências do back-end

```bash
npm install
```

A Vercel detecta a pasta `api/` automaticamente e publica cada arquivo como uma função serverless — não é preciso configurar nada além disso.

### 4. Acessar o painel

Depois do deploy, acesse:

```
https://seu-projeto.vercel.app/admin.html
```

Faça login com a senha definida em `ADMIN_PASSWORD`. No painel você pode:

- Ver todas as mensagens recebidas (data, sentimento e texto)
- Excluir mensagens individualmente
- Exportar tudo em um PDF com o botão **Exportar PDF**

> 🔗 O link do painel não aparece em nenhum lugar do site público — só quem tiver a URL e a senha consegue acessar.

### ⚠️ Um cuidado importante

Este painel **não é um canal de atendimento em tempo real** — ninguém é notificado na hora em que uma mensagem chega. Se o objetivo é oferecer apoio de verdade, continue reforçando o **CVV (188)** como canal principal em toda a campanha, e trate o conteúdo lido no painel com responsabilidade e sigilo (é conteúdo emocionalmente sensível de pessoas anônimas).

<br>

## 🗺️ Roadmap

- [ ] Adicionar modo escuro opcional
- [ ] Traduzir o conteúdo para inglês e espanhol
- [ ] Adicionar ilustrações originais em `assets/`
- [ ] Publicar via GitHub Pages

Sugestões são bem-vindas via [issues](../../issues).

<br>

## 🤝 Contribuindo

Contribuições são bem-vindas, especialmente de quem quer somar à causa:

1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/minha-ideia`)
3. Commit suas mudanças (`git commit -m 'Adiciona minha ideia'`)
4. Push para a branch (`git push origin feature/minha-ideia`)
5. Abra um Pull Request

Ao contribuir, mantenha o tom acolhedor e responsável do conteúdo — evite linguagem que minimize o sofrimento ou romantize crises emocionais.

<br>

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

<br>

## 🆘 Precisa de apoio agora?

**CVV — Centro de Valorização da Vida**
📞 Ligue **188** — gratuito e sigiloso, 24 horas por dia, todos os dias.
💬 Também disponível por chat e e-mail em [cvv.org.br](https://www.cvv.org.br)

Em caso de perigo imediato, procure um adulto responsável, um serviço de saúde ou a emergência mais próxima.

<br>

## 👥 Créditos

Desenvolvido por **Victor Allan**, em colaboração com os alunos do **2º ano do Mediotec Serra Talhada**.

Projeto educativo de conscientização e valorização da vida. 💛

<br>

<div align="center">

*Setembro Amarelo — Valorizar a vida também é saber pedir ajuda.*

</div>

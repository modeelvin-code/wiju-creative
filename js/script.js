/* =========================================================
   WIJU CREATOR — comportamento do menu mobile
   ========================================================= */

(function () {
  'use strict';

  const btn  = document.getElementById('menu-btn');
  const menu = document.getElementById('menu');

  if (!btn || !menu) return; // segurança: se algum elemento não existir, não quebra o site

  function fecharMenu() {
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Abrir menu');
    menu.classList.remove('aberto');
  }

  function abrirMenu() {
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Fechar menu');
    menu.classList.add('aberto');
  }

  // Alternar ao clicar no botão hambúrguer
  btn.addEventListener('click', () => {
    const aberto = btn.getAttribute('aria-expanded') === 'true';
    aberto ? fecharMenu() : abrirMenu();
  });

  // Fecha ao clicar em um link do menu
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', fecharMenu);
  });

  // Fecha com tecla Esc e devolve o foco ao botão
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('aberto')) {
      fecharMenu();
      btn.focus();
    }
  });

  // Fecha ao clicar fora do header
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('aberto') && !e.target.closest('nav')) {
      fecharMenu();
    }
  });

  // Reseta ao voltar para o desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) fecharMenu();
  });

    // ==========================================
  // Envio do Formulário de Contato (AJAX)
  // ==========================================
  const form = document.getElementById('form-contato');
  const btnEnviar = document.getElementById('btn-enviar');
  const resultado = document.getElementById('form-resultado');

  if (form && btnEnviar && resultado) {
    form.addEventListener('submit', function(e) {
      e.preventDefault(); // Impede recarregar a página

      // Estado de carregamento
      const textoOriginal = btnEnviar.textContent;
      btnEnviar.textContent = 'Enviando...';
      btnEnviar.disabled = true;
      resultado.className = 'form-resultado';
      resultado.textContent = '';

      // Prepara os dados
      const formData = new FormData(form);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(async (response) => {
        let json = await response.json();
        if (response.status === 200) {
          // Sucesso
          resultado.textContent = 'Mensagem enviada com sucesso! Retornarei em breve.';
          resultado.classList.add('sucesso');
          form.reset(); // Limpa os campos
        } else {
          // Erro retornado pela API
          console.error(json);
          resultado.textContent = 'Ops, algo deu errado. Tente novamente ou use o WhatsApp.';
          resultado.classList.add('erro');
        }
      })
      .catch(error => {
        console.error(error);
        resultado.textContent = 'Erro de conexão. Verifique sua internet.';
        resultado.classList.add('erro');
      })
      .finally(() => {
        // Restaura o botão
        btnEnviar.textContent = textoOriginal;
        btnEnviar.disabled = false;
      });
    });
  }

    // ==========================================
  // Alternador de Tema (Claro / Escuro / Auto)
  // ==========================================
  const themeBtn = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  // Função para aplicar o tema
  function aplicarTema(tema) {
    if (tema === 'auto') {
      // Verifica a preferência do sistema (relógio do celular/PC)
      const prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      /* 
       * ALTERNATIVA POR RELÓGIO FIXO: Se quiser ignorar o sistema e forçar 
       * escuro após as 18h e claro após as 6h, descomente as linhas abaixo:
       * const hora = new Date().getHours();
       * const prefereEscuro = (hora >= 18 || hora < 6);
       */
       
      html.setAttribute('data-theme', prefereEscuro ? 'dark' : 'light');
      localStorage.setItem('wiju-tema', 'auto');
      themeBtn.title = "Tema automático (sistema)";
    } else {
      html.setAttribute('data-theme', tema);
      localStorage.setItem('wiju-tema', tema);
      themeBtn.title = tema === 'dark' ? "Mudar para tema claro" : "Mudar para tema automático";
    }
    
    // Atualiza os ícones (Sol, Lua, Auto)
    const icones = themeBtn.querySelectorAll('svg');
    icones.forEach(svg => svg.style.display = 'none');
    
    if (tema === 'light') {
      themeBtn.querySelector('.icone-sol').style.display = 'block';
    } else if (tema === 'dark') {
      themeBtn.querySelector('.icone-lua').style.display = 'block';
    } else {
      themeBtn.querySelector('.icone-auto').style.display = 'block';
    }
  }

  // Inicializa o botão com o estado atual
  const temaAtual = localStorage.getItem('wiju-tema') || 'auto';
  aplicarTema(temaAtual);

  // Clique no botão: Cicla entre Auto -> Claro -> Escuro -> Auto...
  themeBtn.addEventListener('click', () => {
    const atual = localStorage.getItem('wiju-tema') || 'auto';
    let proximo = 'auto';
    
    if (atual === 'auto') proximo = 'light';
    else if (atual === 'light') proximo = 'dark';
    
    aplicarTema(proximo);
  });

  // Ouve mudanças no tema do sistema (caso o usuário mude o celular para escuro no meio do dia)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (localStorage.getItem('wiju-tema') === 'auto') {
      aplicarTema('auto');
    }
  });

    // ==========================================
  // Lightbox do Portfólio
  // ==========================================
  const projetos = document.querySelectorAll('.projeto');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const btnFechar = document.querySelector('.lightbox-fechar');

  if (lightbox && lightboxImg && btnFechar) {
    // Abre o lightbox ao clicar em um projeto
    projetos.forEach(projeto => {
      projeto.addEventListener('click', () => {
        const imgOriginal = projeto.querySelector('img');
        if (imgOriginal) {
          lightboxImg.src = imgOriginal.src;
          lightboxImg.alt = imgOriginal.alt;
          lightbox.classList.add('ativo');
          lightbox.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden'; // Trava o scroll do fundo
        }
      });
    });

    // Função para fechar
    function fecharLightbox() {
      lightbox.classList.remove('ativo');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Libera o scroll
      
      // Limpa a imagem depois da animação para não piscar
      setTimeout(() => { lightboxImg.src = ''; }, 300);
    }

    // Fecha ao clicar no botão X
    btnFechar.addEventListener('click', fecharLightbox);

    // Fecha ao clicar no fundo escuro (fora da imagem)
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) fecharLightbox();
    });

    // Fecha ao apertar ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('ativo')) {
        fecharLightbox();
      }
    });
  }
})();
/* =========================================================
   WIJU CREATOR — comportamento
   ========================================================= */

(function () {
  'use strict';

  // ==========================================
  // Menu Mobile
  // ==========================================
  const btn  = document.getElementById('menu-btn');
  const menu = document.getElementById('menu');

  if (btn && menu) {
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

    btn.addEventListener('click', () => {
      const aberto = btn.getAttribute('aria-expanded') === 'true';
      aberto ? fecharMenu() : abrirMenu();
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', fecharMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('aberto')) {
        fecharMenu();
        btn.focus();
      }
    });

    document.addEventListener('click', (e) => {
      if (menu.classList.contains('aberto') && !e.target.closest('nav')) {
        fecharMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) fecharMenu();
    });
  }

  // ==========================================
  // Envio do Formulário de Contato (AJAX)
  // ==========================================
  const form = document.getElementById('form-contato');
  const btnEnviar = document.getElementById('btn-enviar');
  const resultado = document.getElementById('form-resultado');

  if (form && btnEnviar && resultado) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const textoOriginal = btnEnviar.textContent;
      btnEnviar.textContent = 'Enviando...';
      btnEnviar.disabled = true;
      resultado.className = 'form-resultado';
      resultado.textContent = '';

      const formData = new FormData(form);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(async (response) => {
        let json = await response.json();
        if (response.status === 200) {
          resultado.textContent = 'Mensagem enviada com sucesso! Retornarei em breve.';
          resultado.classList.add('sucesso');
          form.reset();
        } else {
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
  
  function aplicarTema(tema) {
    if (tema === 'auto') {
      const prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.setAttribute('data-theme', prefereEscuro ? 'dark' : 'light');
      localStorage.setItem('wiju-tema', 'auto');
      if (themeBtn) themeBtn.title = "Tema automático (sistema)";
    } else {
      html.setAttribute('data-theme', tema);
      localStorage.setItem('wiju-tema', tema);
      if (themeBtn) themeBtn.title = tema === 'dark' ? "Mudar para tema claro" : "Mudar para tema automático";
    }
    
    if (themeBtn) {
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
  }

  if (themeBtn) {
    const temaAtual = localStorage.getItem('wiju-tema') || 'auto';
    aplicarTema(temaAtual);

    themeBtn.addEventListener('click', () => {
      const atual = localStorage.getItem('wiju-tema') || 'auto';
      let proximo = 'auto';
      
      if (atual === 'auto') proximo = 'light';
      else if (atual === 'light') proximo = 'dark';
      
      aplicarTema(proximo);
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (localStorage.getItem('wiju-tema') === 'auto') {
        aplicarTema('auto');
      }
    });
  }

  // ==========================================
  // Lightbox do Portfólio
  // ==========================================
  const projetos = document.querySelectorAll('.projeto');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const btnFechar = document.querySelector('.lightbox-fechar');

  if (lightbox && lightboxImg && btnFechar) {
    projetos.forEach(projeto => {
      projeto.addEventListener('click', () => {
        const imgOriginal = projeto.querySelector('img');
        if (imgOriginal) {
          lightboxImg.src = imgOriginal.src;
          lightboxImg.alt = imgOriginal.alt;
          lightbox.classList.add('ativo');
          lightbox.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    function fecharLightbox() {
      lightbox.classList.remove('ativo');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(() => { lightboxImg.src = ''; }, 300);
    }

    btnFechar.addEventListener('click', fecharLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) fecharLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('ativo')) {
        fecharLightbox();
      }
    });
  }

  // ==========================================
  // Animação de Scroll (Reveal)
  // ==========================================
  const elementosRevelar = document.querySelectorAll('.revelar');
  
  if (elementosRevelar.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('ativo');
          observer.unobserve(entry.target); // Anima apenas uma vez
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    });

    elementosRevelar.forEach(el => observer.observe(el));
  } else {
    // Fallback para navegadores antigos
    elementosRevelar.forEach(el => el.classList.add('ativo'));
  }

})();
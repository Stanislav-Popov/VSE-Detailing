/** @format */

class CustomFooter extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: "open" })
        this.shadowRoot.innerHTML = `
      <style>
        footer {
          background: #1a202c;
          color: white;
          padding: 2.5rem 0;
          text-align: center;
          font-size: 0.9rem;
        }
        
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .footer-links {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .footer-links a {
          color: #a0aec0;
          text-decoration: none;
          transition: color 0.3s;
        }
        
        .footer-links a:hover {
          color: white;
        }
        
        .social-links {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .social-links a {
          color: white;
          background: #2d3748;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s, transform 0.3s;
        }
        
        .social-links a:hover {
          background: #3b82f6;
          transform: translateY(-3px);
        }
        
        .copyright {
          color: #a0aec0;
          margin-top: 1rem;
        }
        
        @media (max-width: 768px) {
          .footer-links {
            flex-direction: column;
            gap: 0.75rem;
          }
        }
      </style>
      
      <footer>
        <div class="footer-content">
          <div class="footer-links">
            <a href="#about">О компании</a>
            <a href="#before-after">Наши работы</a>
            <a href="#contact">Контакты</a>
            <a href="#">Политика конфиденциальности</a>
          </div>
          
          <div class="social-links">
            <a href="#" aria-label="Instagram"><i data-feather="instagram"></i></a>
            <a href="#" aria-label="VKontakte"><i data-feather="message-square"></i></a>
            <a href="#" aria-label="WhatsApp"><i data-feather="phone"></i></a>
          </div>
          
          <p class="copyright">&copy; ${new Date().getFullYear()} GMA Detailing. Все права защищены.</p>
        </div>
      </footer>
      
      <script>
        feather.replace();
      </script>
    `
    }
}

customElements.define("custom-footer", CustomFooter)

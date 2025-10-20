/** @format */

class CustomNavbar extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: "open" })
        this.shadowRoot.innerHTML = `
      <style>
        nav {
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }
        
        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          color: #3b82f6;
          text-decoration: none;
          display: flex;
          align-items: center;
        }
        
        .logo i {
          margin-right: 0.5rem;
        }
        
        .nav-links {
          display: flex;
          gap: 2rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .nav-links a {
          color: #333;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
          position: relative;
        }
        
        .nav-links a:hover {
          color: #3b82f6;
        }
        
        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #3b82f6;
          transition: width 0.3s;
        }
        
        .nav-links a:hover::after {
          width: 100%;
        }
        
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .nav-links {
            display: none;
            flex-direction: column;
            position: absolute;
            top: 70px;
            left: 0;
            right: 0;
            background: white;
            padding: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          
          .nav-links.show {
            display: flex;
          }
          
          .mobile-menu-btn {
            display: block;
          }
        }
      </style>
      
      <nav>
        <a href="#" class="logo">
          <i data-feather="car"></i>
          GMA Detailing
        </a>
        
        <button class="mobile-menu-btn" aria-label="Toggle menu">
          <i data-feather="menu"></i>
        </button>
        
        <ul class="nav-links">
          <li><a href="#about">О нас</a></li>
          <li><a href="#before-after">Результаты</a></li>
          <li><a href="#gallery">Галерея</a></li>
          <li><a href="#contact">Контакты</a></li>
          <li><a href="tel:+7(XXX)XXX-XX-XX" class="btn-primary">Записаться</a></li>
        </ul>
      </nav>
      
      <script>
        feather.replace();
        
        document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
          const navLinks = document.querySelector('.nav-links');
          navLinks.classList.toggle('show');
          
          const icon = this.querySelector('i');
          if (navLinks.classList.contains('show')) {
            icon.setAttribute('data-feather', 'x');
          } else {
            icon.setAttribute('data-feather', 'menu');
          }
          feather.replace();
        });
      </script>
    `
    }
}

customElements.define("custom-navbar", CustomNavbar)

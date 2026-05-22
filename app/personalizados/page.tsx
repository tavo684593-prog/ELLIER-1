const customProducts = [
  ["TERMOS", "Personalizados", "custom-tumbler"],
  ["ROPA", "Con tu estilo", "custom-hoodie"],
  ["TAZAS", "Para cada momento", "custom-mug"],
  ["ACCESORIOS", "Únicos como tú", "custom-tote"],
  ["BOTELLAS", "Hidratación con identidad", "custom-bottle"],
  ["REGALOS", "Que conectan", "custom-gift"]
];

const steps = [
  ["1", "ELIGE TU PRODUCTO", "Selecciona el artículo que más te guste."],
  ["2", "PERSONALIZA", "Agrega nombres, frases, iniciales o diseños."],
  ["3", "VISUALIZA", "Revisa cómo quedará tu diseño."],
  ["4", "RECIBE TU PEDIDO", "Hecho especialmente para ti."]
];

const ideas = [
  ["NOMBRES", "Tu nombre o el de quien más quieres.", "Aa"],
  ["FECHAS ESPECIALES", "Momentos que merecen ser recordados.", "▦"],
  ["FRASES", "Palabras que te inspiran y te representan.", "“”"],
  ["INICIALES", "Detalles minimalistas que dicen mucho.", "A|"],
  ["DISEÑOS EXCLUSIVOS", "Gráficos únicos creados para ti.", "E"]
];

const inspo = ["custom-mug", "custom-tote", "custom-tumbler", "custom-hoodie", "custom-bottle", "custom-mug"];

function Icon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    user: (
      <>
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    bag: (
      <>
        <path d="M6 8h12l-1 13H7L6 8Z" />
        <path d="M9 8a3 3 0 0 1 6 0" />
      </>
    ),
    pencil: <path d="M4 20h4L19 9l-4-4L4 16v4Z" />,
    eye: (
      <>
        <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    box: (
      <>
        <path d="M21 16V8l-9-5-9 5v8l9 5 9-5Z" />
        <path d="m3.5 8.5 8.5 5 8.5-5" />
      </>
    ),
    heart: <path d="M20.8 8.6c0 5.2-8.8 10.4-8.8 10.4S3.2 13.8 3.2 8.6A4.6 4.6 0 0 1 12 6a4.6 4.6 0 0 1 8.8 2.6Z" />,
    truck: (
      <>
        <path d="M3 7h11v10H3z" />
        <path d="M14 10h4l3 3v4h-7z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </>
    )
  };

  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

function Logo() {
  return (
    <a className="catalog-logo" href="/" aria-label="ELLIÉR inicio">
      <span className="catalog-logo-mark">
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <path d="M10 25c8-1 15-7 16-15 5 6 5 15-1 19-5 4-12 1-15-4Z" />
          <path d="M26 10c4 0 6 2 7 6-3-2-6-2-9-1" />
          <path d="M14 25c5 3 12 3 17-3" />
        </svg>
      </span>
      <span>ELLIÉR</span>
    </a>
  );
}

export default function PersonalizadosPage() {
  return (
    <main className="custom-page">
      <header className="catalog-nav custom-nav">
        <Logo />
        <nav>
          <a href="/">INICIO</a>
          <a href="/coleccion">COLECCIÓN</a>
          <a className="active" href="/personalizados">PERSONALIZADOS</a>
          <a href="#">SOBRE ELLIÉR</a>
          <a href="#">CONTACTO</a>
        </nav>
        <div className="nav-icons">
          {["search", "user", "bag"].map((name) => (
            <a className="icon-btn" href="#" key={name} aria-label={name}>
              <Icon name={name} />
            </a>
          ))}
          <span className="cart-count">0</span>
        </div>
      </header>

      <section className="custom-hero">
        <div className="custom-hero-copy">
          <p>PERSONALIZADOS ELLIÉR</p>
          <h1>
            TU HISTORIA.
            <br />
            TU ESTILO.
            <br />
            TUYO.
          </h1>
          <span />
          <h2>
            Creamos piezas únicas con tu toque personal.
            <br />
            Nombres, frases, iniciales, fechas especiales
            <br />y mucho más.
          </h2>
          <a href="#personalizables">CREA EL TUYO <b>-&gt;</b></a>
        </div>

        <div className="custom-scene" aria-hidden="true">
          <div className="hero-item custom-bottle left"><em>ANDRÉS</em></div>
          <div className="hero-item custom-mug center"><em>Mariana</em></div>
          <div className="hero-item custom-tumbler tall"><em>Sofía</em></div>
          <div className="hero-item custom-bottle right"><em>Valentina</em></div>
          <div className="hero-item custom-hoodie folded-custom"><em>Tú puedes.</em></div>
          <div className="custom-flower" />
        </div>
      </section>

      <section className="how">
        <h2>ASÍ FUNCIONA</h2>
        <div className="how-grid">
          {steps.map(([number, title, text], index) => (
            <div className="how-card" key={title}>
              <span>{number}</span>
              <Icon name={index === 1 ? "pencil" : index === 2 ? "eye" : index === 3 ? "box" : "bag"} />
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="custom-products" id="personalizables">
        <h2>PRODUCTOS PERSONALIZABLES</h2>
        <div className="custom-product-grid">
          {customProducts.map(([title, subtitle, type]) => (
            <a className="custom-card" href="#" key={title}>
              <div className={`custom-product ${type}`} />
              <h3>{title}</h3>
              <p>{subtitle}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="ideas">
        <h2>TÚ LO IMAGINAS, NOSOTROS LO HACEMOS REALIDAD</h2>
        <div className="ideas-grid">
          {ideas.map(([title, text, mark]) => (
            <div className="idea" key={title}>
              <strong>{mark}</strong>
              <span>
                <b>{title}</b>
                {text}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="inspiration">
        <h2>INSPÍRATE</h2>
        <div className="inspo-row">
          <button aria-label="Anterior">‹</button>
          {inspo.map((type, index) => (
            <div className="inspo-card" key={`${type}-${index}`}>
              <div className={`custom-product ${type}`} />
            </div>
          ))}
          <button aria-label="Siguiente">›</button>
        </div>
      </section>

      <section className="custom-benefits">
        {[
          ["heart", "HECHO PARA TI", "Cada pieza es única y hecha especialmente."],
          ["box", "CALIDAD PREMIUM", "Materiales seleccionados para durar."],
          ["user", "ATENCIÓN PERSONAL", "Estamos contigo en cada paso del proceso."],
          ["truck", "ENVÍOS SEGUROS", "Tu pedido llega seguro y a tiempo."]
        ].map(([icon, title, text]) => (
          <div key={title}>
            <Icon name={icon} />
            <span>
              <b>{title}</b>
              {text}
            </span>
          </div>
        ))}
      </section>

      <footer className="catalog-footer">
        <Logo />
        <div>
          <h4>NAVEGACIÓN</h4>
          <a href="/">Inicio</a>
          <a href="/coleccion">Colección</a>
          <a href="/personalizados">Personalizados</a>
          <a href="#">Sobre ELLIÉR</a>
          <a href="#">Contacto</a>
        </div>
        <div>
          <h4>AYUDA</h4>
          <a href="#">Preguntas frecuentes</a>
          <a href="#">Envíos y entregas</a>
          <a href="#">Cambios y devoluciones</a>
          <a href="#">Términos y condiciones</a>
        </div>
        <form>
          <h4>SÍGUENOS</h4>
          <p>ÚNETE A ELLIÉR</p>
          <span>Sé parte de nuestra comunidad y recibe novedades y promociones exclusivas.</span>
          <label>
            <input type="email" placeholder="Tu correo electrónico" />
            <button type="submit">-&gt;</button>
          </label>
        </form>
        <small>© 2026 ELLIÉR. Todos los derechos reservados.</small>
      </footer>
    </main>
  );
}

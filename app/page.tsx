const navLinks = [
  ["INICIO", "/"],
  ["COLECCIÓN", "/coleccion"],
  ["PERSONALIZADOS", "/personalizados"],
  ["SOBRE ELLIÉR", "#"],
  ["CONTACTO", "#"]
];

const categories = [
  ["TERMOS", "Personalizados", "tumbler"],
  ["ROPA", "Cómoda y atemporal", "hoodie-card"],
  ["TAZAS", "Para cada historia", "mug"],
  ["ACCESORIOS", "Detalles que suman", "cap"],
  ["REGALOS", "Que conectan", "gift-card"]
];

const features = [
  ["ENVÍO GRATIS", "En compras + $999 MXN", "truck"],
  ["PAGOS SEGUROS", "100% protegidos", "shield"],
  ["HECHO PARA DURAR", "Calidad premium", "box"],
  ["ATENCIÓN PERSONAL", "Estamos para ti", "heart"]
];

function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
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
    truck: (
      <>
        <path d="M3 7h11v10H3z" />
        <path d="M14 10h4l3 3v4h-7z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </>
    ),
    shield: <path d="M12 3 5 6v6c0 4.4 3 7.7 7 9 4-1.3 7-4.6 7-9V6l-7-3Z" />,
    box: (
      <>
        <path d="M21 16V8l-9-5-9 5v8l9 5 9-5Z" />
        <path d="m3.5 8.5 8.5 5 8.5-5" />
      </>
    ),
    heart: <path d="M20.8 8.6c0 5.2-8.8 10.4-8.8 10.4S3.2 13.8 3.2 8.6A4.6 4.6 0 0 1 12 6a4.6 4.6 0 0 1 8.8 2.6Z" />
  };

  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function Logo() {
  return (
    <a className="logo" href="/" aria-label="ELLIÉR inicio">
      <span className="logo-mark">
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <path d="M10 25c8-1 15-7 16-15 5 6 5 15-1 19-5 4-12 1-15-4Z" />
          <path d="M26 10c4 0 6 2 7 6-3-2-6-2-9-1" />
          <path d="M14 25c5 3 12 3 17-3" />
        </svg>
      </span>
      <span className="logo-word">ELLIÉR</span>
    </a>
  );
}

export default function Home() {
  return (
    <main className="page">
      <header className="top">
        <div className="announcement">ENVÍO GRATIS EN COMPRAS + $999 MXN</div>
        <nav className="navbar">
          <div className="nav-inner">
            <Logo />
            <div className="nav-links">
              {navLinks.map(([label, href]) => (
                <a href={href} key={label}>
                  {label}
                </a>
              ))}
            </div>
            <div className="nav-icons">
              {["search", "user", "bag"].map((name) => (
                <a className="icon-btn" href="#" key={name} aria-label={name}>
                  <Icon name={name} />
                </a>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="ambient" />
        <div className="hero-stage">
          <div className="hero-text">
            <p className="eyebrow">COLECCIÓN ELLIÉR</p>
            <h1>
              NO ES LO QUE VISTES,
              <br />
              SINO LO QUE REPRESENTAS.
            </h1>
            <div className="hero-rule" />
            <p>Cada pieza es un reflejo de lo que has vivido, lo que superaste y lo que decides ser.</p>
            <a className="luxe-button outline" href="/coleccion">
              VER COLECCIÓN <span>-&gt;</span>
            </a>
          </div>
          <div className="scene">
            <div className="window" />
            <div className="hoodie">
              <span className="sleeve left" />
              <span className="sleeve right" />
              <span className="pocket" />
            </div>
            <div className="hero-tumbler" />
            <div className="polaroid" />
            <div className="hero-gift" />
            <div className="folded" />
            <div className="quote">
              <p>
                You said
                <br />
                forever,
                <br />
                now I drive
                <br />
                alone past
                <br />
                your street.
              </p>
              <span>
                GLIMPSE OF US
                <br />
                JOJI
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        {features.map(([title, subtitle, icon]) => (
          <div className="feature" key={title}>
            <Icon name={icon} />
            <span>
              {title}
              <small>{subtitle}</small>
            </span>
          </div>
        ))}
      </section>

      <section className="collection" id="coleccion">
        <h2>ELLIÉR PARA CADA MOMENTO</h2>
        <div className="cards">
          {categories.map(([title, subtitle, type]) => (
            <a href="/coleccion" className="card" key={title}>
              <div className={`product ${type}`} />
              <strong>{title}</strong>
              <span>{subtitle}</span>
            </a>
          ))}
        </div>
        <a className="luxe-button" href="/coleccion">
          VER COLECCIÓN COMPLETA <span>-&gt;</span>
        </a>
      </section>

      <section className="philosophy">
        <span className="small-mark">ELLIÉR</span>
        <h2>DISEÑOS QUE HABLAN POR TI. RECUERDOS QUE TE ACOMPAÑAN.</h2>
        <p>Hecha para ti, pensada para durar.</p>
      </section>

      <footer className="footer">
        <Logo />
        <div className="footer-links">
          {navLinks.map(([label, href]) => (
            <a href={href} key={label}>
              {label}
            </a>
          ))}
        </div>
        <form className="newsletter">
          <label htmlFor="email">ÚNETE A ELLIÉR</label>
          <div>
            <input id="email" type="email" placeholder="Tu correo electrónico" />
            <button type="submit">-&gt;</button>
          </div>
        </form>
        <p className="copyright">© 2026 ELLIÉR. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}

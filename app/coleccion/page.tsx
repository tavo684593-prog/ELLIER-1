const products = [
  ["HOODIE ELLIÉR OVERSIZE", "$899 MXN", "catalog-hoodie"],
  ["PLAYERA ELLIÉR SIGNATURE", "$499 MXN", "catalog-shirt"],
  ["JOGGER ELLIÉR ESSENTIAL", "$799 MXN", "catalog-jogger"],
  ["GORRA ELLIÉR CLASSIC", "$399 MXN", "catalog-cap"],
  ["SUDADERA ELLIÉR MINIMAL", "$699 MXN", "catalog-sweatshirt"],
  ["PLAYERA OVERSIZE SILENCIO", "$549 MXN", "catalog-shirt-back"],
  ["SHORT ELLIÉR PERFORMANCE", "$599 MXN", "catalog-short"],
  ["TOTE BAG ELLIÉR UTILITY", "$349 MXN", "catalog-tote"]
];

const tabs = ["TODOS", "HOODIES", "PLAYERAS", "JOGGERS", "ACCESORIOS", "SETS"];

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
    filter: (
      <>
        <path d="M4 7h16" />
        <path d="M7 12h10" />
        <path d="M10 17h4" />
      </>
    ),
    leaf: <path d="M19 3C10 4 5 9 5 17c6 0 12-5 14-14Z" />,
    layers: (
      <>
        <path d="m12 3 8 4-8 4-8-4 8-4Z" />
        <path d="m4 12 8 4 8-4" />
        <path d="m4 17 8 4 8-4" />
      </>
    ),
    feather: <path d="M20 4C12 4 6 10 5 19c7-1 13-7 15-15Z" />,
    infinity: <path d="M8.5 8.5C5.5 8.5 3 11 3 14s2.5 5.5 5.5 5.5c4 0 7-11 11-11 3 0 5.5 2.5 5.5 5.5s-2.5 5.5-5.5 5.5c-4 0-7-11-11-11Z" />
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

export default function CollectionPage() {
  return (
    <main className="catalog-page">
      <header className="catalog-nav">
        <Logo />
        <nav>
          <a href="/">INICIO</a>
          <a className="active" href="/coleccion">COLECCIÓN</a>
          <a href="/personalizados">PERSONALIZADOS</a>
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

      <section className="catalog-hero">
        <div className="fabric-bg" />
        <div className="woven-patch">
          <span>ELLIÉR</span>
        </div>
        <div className="catalog-hero-copy">
          <p>COLECCIÓN ELLIÉR</p>
          <h1>
            NO ES LO QUE
            <br />
            VISTES, SI NO LO
            <br />
            QUE REPRESENTAS.
          </h1>
          <span className="catalog-rule" />
          <h2>
            Cada pieza cuenta una historia.
            <br />
            Cada detalle tiene un propósito.
            <br />
            Esta es nuestra esencia.
          </h2>
          <a href="#productos">EXPLORAR COLECCIÓN <span>-&gt;</span></a>
        </div>
      </section>

      <section className="catalog-shell" id="productos">
        <div className="catalog-toolbar">
          <div className="catalog-tabs">
            {tabs.map((tab, index) => (
              <button className={index === 0 ? "active" : ""} key={tab}>
                {tab}
              </button>
            ))}
          </div>
          <button className="filter-button">
            FILTRAR <Icon name="filter" />
          </button>
        </div>

        <div className="catalog-grid">
          {products.map(([name, price, type]) => (
            <article className="catalog-card" key={name}>
              <div className={`catalog-product ${type}`} />
              <div className="catalog-card-info">
                <h3>{name}</h3>
                <p>{price}</p>
              </div>
              <button aria-label={`Agregar ${name}`}>+</button>
            </article>
          ))}
        </div>
      </section>

      <section className="catalog-values">
        {[
          ["leaf", "DISEÑO CON PROPÓSITO", "Cada pieza está creada para inspirar autenticidad y confianza."],
          ["layers", "CALIDAD QUE TRASCIENDE", "Materiales premium, confección impecable y atención al detalle."],
          ["feather", "IDENTIDAD QUE SE SIENTE", "Más que ropa, es una forma de expresar lo que llevas dentro."],
          ["infinity", "EDICIONES LIMITADAS", "Colecciones exclusivas en cantidades limitadas. Hechas para durar."]
        ].map(([icon, title, text]) => (
          <div className="value-card" key={title}>
            <Icon name={icon} />
            <h3>{title}</h3>
            <p>{text}</p>
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
            <input type="email" placeholder="Tu correo" />
            <button type="submit">-&gt;</button>
          </label>
        </form>
        <small>© 2026 ELLIÉR. Todos los derechos reservados.</small>
      </footer>
    </main>
  );
}

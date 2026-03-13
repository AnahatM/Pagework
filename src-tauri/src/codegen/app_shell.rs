/// App shell generator
/// Generates App.tsx, main.tsx, and index.html.

use crate::manifest::schema::SiteSettings;

/// Generate App.tsx content.
pub fn generate_app_tsx() -> String {
    r#"import Layout from "@components/core/Layout";
import LoadingFallback from "@components/core/LoadingFallback";
import { routes } from "@routes/RoutesConfiguration";
import type { JSX } from "react";
import { Suspense, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

function ScrollToTop(): null {
  const { pathname } = useLocation();
  useEffect(() => {
    const id = setTimeout(() => window.scrollTo(0, 0), 100);
    return () => clearTimeout(id);
  }, [pathname]);
  return null;
}

export default function App(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const redirectedPath = new URLSearchParams(location.search).get("redirectTo");

  useEffect(() => {
    if (redirectedPath && redirectedPath.startsWith("/")) {
      navigate(redirectedPath, { replace: true });
    }
  }, [redirectedPath, navigate]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          {routes.map((route, index) => (
            <Route
              key={`route-${index}-${route.path}`}
              path={route.path}
              element={<Suspense fallback={<LoadingFallback />}>{route.element}</Suspense>}
            />
          ))}
        </Route>
      </Routes>
    </>
  );
}
"#.to_string()
}

/// Generate main.tsx content.
pub fn generate_main_tsx() -> String {
    r#"import App from "@/App";
import "@/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const basePath = import.meta.env.BASE_URL || "/";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={basePath}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
"#.to_string()
}

/// Generate index.html content.
pub fn generate_index_html(settings: &SiteSettings) -> String {
    let title = escape_html(&settings.site_title);
    let favicon = if settings.favicon_path.is_empty() {
        "assets/graphics/logo.png".to_string()
    } else {
        settings.favicon_path.clone()
    };

    format!(
        r#"<!doctype html>
<html lang="en" data-theme="light">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="{}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
"#,
        favicon, title
    )
}

fn escape_html(s: &str) -> String {
    s.replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
}

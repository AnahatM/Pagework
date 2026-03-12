import { useProjectStore } from "@stores/projectStore";
import { WelcomeScreen } from "@components/welcome/WelcomeScreen";
import { AppShell } from "@components/layout/AppShell";

function App() {
  const manifest = useProjectStore((s) => s.manifest);

  if (!manifest) {
    return <WelcomeScreen />;
  }

  return <AppShell />;
}

export default App;

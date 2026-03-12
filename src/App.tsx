import { AppShell } from "@components/layout/AppShell";
import { NewProjectModal } from "@components/modals/NewProjectModal";
import { WelcomeScreen } from "@components/welcome/WelcomeScreen";
import { useProjectStore } from "@stores/projectStore";
import { useUIStore } from "@stores/uiStore";

function ModalRouter() {
  const activeModal = useUIStore((s) => s.activeModal);

  switch (activeModal) {
    case "new-project":
      return <NewProjectModal />;
    default:
      return null;
  }
}

function App() {
  const manifest = useProjectStore((s) => s.manifest);

  return (
    <>
      {manifest ? <AppShell /> : <WelcomeScreen />}
      <ModalRouter />
    </>
  );
}

export default App;

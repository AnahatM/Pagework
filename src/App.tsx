import { AppShell } from "@components/layout/AppShell";
import { NewProjectModal } from "@components/modals/NewProjectModal";
import { PublishModal } from "@components/modals/PublishModal";
import { SetupGuideModal } from "@components/modals/SetupGuideModal";
import { WelcomeScreen } from "@components/welcome/WelcomeScreen";
import { useProjectStore } from "@stores/projectStore";
import { useUIStore } from "@stores/uiStore";

function ModalRouter() {
  const activeModal = useUIStore((s) => s.activeModal);

  switch (activeModal) {
    case "new-project":
      return <NewProjectModal />;
    case "publish":
      return <PublishModal />;
    case "setup-guide":
      return <SetupGuideModal />;
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

import NewTabPage from './components/NewTab';
import { SettingsProvider } from './hooks/settingsContext';

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <NewTabPage />
    </SettingsProvider>
  );
};

export default App;

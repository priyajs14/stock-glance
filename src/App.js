import { EasybaseProvider } from 'easybase-react';
import ebconfig from './ebconfig';
import Container from './container/container';

function App() {
  return (
    <EasybaseProvider ebconfig={ebconfig}>
      <Container />
    </EasybaseProvider>
  );
}

export default App;
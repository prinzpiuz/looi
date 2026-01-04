import './assets/css/main.css';
import './assets/css/grid_layout.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <StrictMode>
        <App />
    </StrictMode>,
);

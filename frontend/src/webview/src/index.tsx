// index.tsx (エントリーポイント)

import { createRoot } from 'react-dom/client';
import AppRoutes from './AppRoutes';

const root = createRoot(document.getElementById('app')!);
root.render(<AppRoutes />);

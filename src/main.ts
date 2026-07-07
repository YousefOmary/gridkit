/** Entry point: load styles, find the root element, start the app. */

import './ui/style.css';
import { startApp } from './ui/app';

const root = document.getElementById('app');
if (!root) throw new Error('#app root element missing in index.html');
void startApp(root);

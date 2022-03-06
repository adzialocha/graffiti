import ReactDOM from 'react-dom';

import App from '~/components/App';

const rootElem = document.createElement('div');
document.body.appendChild(rootElem);
ReactDOM.render(<App />, rootElem);

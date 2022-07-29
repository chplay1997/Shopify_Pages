import ReactDOM from 'react-dom';

import App from './App';
import GlobalStyles from './components/GlobalStyles';

ReactDOM.render(
    <GlobalStyles>
        <App />
    </GlobalStyles>,
    document.getElementById('app'),
);

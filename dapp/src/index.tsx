import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { MetamaskStateProvider } from "use-metamask";
import App from './App';
import { Provider } from 'react-redux';
import { store } from './app/store'
import * as serviceWorker from './serviceWorker';
import {
    BrowserRouter
} from "react-router-dom";
import {ChakraProvider} from '@chakra-ui/react';
import theme from "./components/theme";
import { QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from 'react-query/devtools';


console.log(theme)

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
      <ChakraProvider theme={theme}>
          <Provider store={store}>
        <MetamaskStateProvider>
            <QueryClientProvider client={queryClient} contextSharing={true}>
      <App />


                <ReactQueryDevtools />
            </QueryClientProvider>
    </MetamaskStateProvider>
    </Provider>
    </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,

  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// DashboardProducts more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();

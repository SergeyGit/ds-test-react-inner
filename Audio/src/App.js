import React from 'react';
// import { render } from 'react-snapshot';
import {Route, Switch} from 'react-router-dom';
import Layout from './hoc/Layout/Layout'


import './index.scss'
import Home from './components/Home/Home'
import Form from "./components/Form/Form"
import Footer from "./components/Footer/Footer"
import Timer from "./components/Timer/Timer"
// import Payment from "./components/Payment/Payment"
import Cancel from "./components/Cancel/Cancel"
// const {Route} = loadable(() => import('react-router-dom'));
// const {Switch} = loadable(() => import('react-router-dom'));





function App() {
let domain = window.location.hostname.replace(/^(www\.)?(.+)$/i, '$2');

return (
      <Layout>
          <Switch>
              <Route
                  path={domain === 'audio.doc.online' ?  '/' : '/audio'}
                  exact
                  render={(props) => (
                      <Home
                          {...props}
                          domainName={domain}
                          key={'Home'}
                      />
                  )}
              />

              <Route
                  path={domain === 'audio.doc.online' ?  '/doctor/:id' : '/audio/doctor/:id'}
                  render={(props) => (
                      <Form
                          {...props}
                          domainName={domain}
                          key={'Form'}
                      />
                  )}
              />
              <Route
                  // path={domain === 'audio.doc.online' ?  '/timer' : '/audio/timer'}
                  path={'/audio/timer'}
                  component={Timer}
              />
              {/*<Route*/}
              {/*    path={'/payment/:token'}*/}
              {/*    exact*/}
              {/*    component={Payment}*/}
              {/*/>*/}
              {/*<Route*/}
              {/*    path={'/audio/payment'}*/}
              {/*    exact*/}
              {/*    component={Payment}*/}
              {/*/>*/}
              <Route
                  path={domain === 'audio.doc.online' ?  '/cancel' : '/audio/cancel'}
                  exact
                  render={(props) => (
                      <Cancel
                          {...props}
                          domainName={domain}
                          key={'Cancel'}
                      />
                  )}
              />
          </Switch>

          <Footer
              domainName={domain}
          />


      </Layout>

  );
}

export default App;

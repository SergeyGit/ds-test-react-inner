import React from 'react';
// import { render } from 'react-snapshot';
import {Route, Switch} from 'react-router-dom';
import Layout from './hoc/Layout/Layout'


import './index.scss'
import Home from './components/Home/Home'
import Single from './components/Single/Single'
import Checkout from "./components/Checkout/Checkout";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import NoMatch from "./components/NoMatch/NoMatch";
// import ThankyouPage from "./components/ThankyouPage/ThankyouPage";



function App() {
  return (
      <Layout>
          <Switch>
              <Route
                  path={'/promotions/:city/:alias'}
                  exact
                  render={(props) => (
                      <>
                          <Header
                              city={props.match.params.city === 'checkout' ? null : props.match.params.city}
                          />
                          {
                              props.match.params.alias === 'all' ?
                                  <Home
                                      {...props}
                                      key={props.match.params.city}
                                  />
                                  : props.match.params.city === 'checkout' ?
                                  <Checkout
                                      {...props}
                                      key={props.match.params.alias + "checkout"}
                                  />
                                  :
                                  <Single
                                      {...props}
                                      key={props.match.params.alias}
                                  />
                          }
                          <Footer checkout={props.match.params.city === 'checkout'} />
                      </>
                      // :
                      // <Checkout
                      //     {...props}
                      //     key={props.match.params.alias}
                      // />
                  )}
              />
              <Route
                  path={'/ua/promotions/:city/:alias'}
                  exact
                  render={(props) => (
                      <>
                          <Header
                              uaProp={true}
                              city={props.match.params.city === 'checkout' ? null : props.match.params.city}
                          />
                          {
                              props.match.params.alias === 'all' ?
                                  <Home
                                      {...props}
                                      key={props.match.params.city}
                                      uaProp={true}
                                  />
                                  : props.match.params.city === 'checkout' ?
                                  <Checkout
                                      {...props}
                                      key={props.match.params.alias + "checkout"}
                                      uaProp={true}
                                  />
                                  :
                                  <Single
                                      {...props}
                                      key={props.match.params.alias}
                                      uaProp={true}
                                  />
                          }
                                <Footer checkout={props.match.params.city === 'checkout'} uaProp={true}/>
                     </>

                      // :
                      // <Checkout
                      //     {...props}
                      //     key={props.match.params.alias}
                      // />
                  )}
              />
              <Route
                  path={'/promotions/:city/all/:specialty'}
                  exact
                  // component={Home}
                  render={(props) => (
                      <>
                          <Header
                              city={props.match.params.city}
                          />
                          <Home
                              {...props}
                              key={props.match.params.specialty}
                          />
                          <Footer/>
                      </>


                  )}
              />
              <Route
                  path={'/ua/promotions/:city/all/:specialty'}
                  exact
                  // component={Home}
                  render={(props) => (
                      <>
                          <Header
                              uaProp={true}
                              city={props.match.params.city}
                          />
                          <Home
                              {...props}
                              key={props.match.params.specialty}
                              uaProp={true}
                          />
                          <Footer uaProp={true}/>
                      </>

                  )}
              />
              <Route status={404}
                     render={() => (
                         <>
                             <Header/>
                             <NoMatch/>

                         </>
                     )}
              />
              {/*<Route*/}
              {/*    path={'/promotions/checkout?alias=:alias'}*/}
              {/*    exact*/}
              {/*    // component={Single}*/}
              {/*    render={(props) => (*/}
              {/*        */}
              {/*    )}/>*/}
              {/*/>*/}
              {/*<Route*/}
              {/*    path={'/thankyou'}*/}
              {/*    exact*/}
              {/*    component={ThankyouPage}*/}
              {/*/>*/}
          </Switch>
      </Layout>

  );
}

export default App;

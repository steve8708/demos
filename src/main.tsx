// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import routes from 'virtual:generated-pages-react';
import './styles/base.scss';
import './styles/weather.scss';
import * as FakeServer from './fake-server';
// @ts-expect-error Global FakeServer assignment
window.FakeServer = Object.assign({}, FakeServer);

function App() {
  return <Suspense fallback={<div>Loading...</div>}>{useRoutes(routes)}</Suspense>;
}

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';

import { WidgetDataType } from '../interfaces';

export function BaseStaticWidget({ config }: { config: WidgetDataType }) {
  const Wrapper = config.provider ?? React.Fragment;
  return (
    <div className="weather-static-widget" style={{ minHeight: config.staticMinHeight, height: '100%' }}>
      <Wrapper>
        <Container
          header={<config.header />}
          fitHeight={true}
          footer={config.footer && <config.footer />}
          disableContentPaddings={config.disableContentPaddings}
        >
          <config.content />
        </Container>
      </Wrapper>
    </div>
  );
}

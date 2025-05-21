// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';

import { WeatherWidgetDataType } from '../interfaces';

import * as styles from './styles.module.scss';

export function BaseWeatherWidget({ config }: { config: WeatherWidgetDataType }) {
  const Wrapper = config.provider ?? React.Fragment;
  return (
    <div className={styles.weatherWidget} style={{ minHeight: config.staticMinHeight }}>
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

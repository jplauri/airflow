/*!
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { renderHook } from '@testing-library/react-hooks';
import useTreeData from './useTreeData';

/* global describe, test, expect */

global.autoRefreshInterval = 5;

const treeData = {
  groups: {},
  dag_runs: [
    {
      dag_id: 'example_python_operator',
      run_id: 'manual__2021-11-08T21:14:17.170046+00:00',
      start_date: null,
      end_date: null,
      state: 'queued',
      execution_date: '2021-11-08T21:14:17.170046+00:00',
      data_interval_start: '2021-11-08T21:14:17.170046+00:00',
      data_interval_end: '2021-11-08T21:14:17.170046+00:00',
      run_type: 'manual',
    },
  ],
};

describe('Test useTreeData hook', () => {
  test('data is valid camelcase json', () => {
    global.treeData = JSON.stringify(treeData);

    const { result } = renderHook(() => useTreeData());
    const { data, isRefreshOn, onToggleRefresh } = result.current;

    expect(typeof data === 'object').toBe(true);
    expect(data.dagRuns).toBeDefined();
    expect(data.dag_runs).toBeUndefined();
    expect(isRefreshOn).toBe(true);
    expect(typeof onToggleRefresh).toBe('function');
  });

  test('data with an unfinished state should have refresh on by default', () => {
    global.treeData = JSON.stringify(treeData);

    const { result } = renderHook(() => useTreeData());
    const { isRefreshOn } = result.current;

    expect(isRefreshOn).toBe(true);
  });

  test('data with a finished state should have refresh off by default', () => {
    global.treeData = JSON.stringify({
      groups: {},
      dag_runs: [{ ...treeData.dag_runs[0], state: 'failed' }],
    });

    const { result } = renderHook(() => useTreeData());
    const { isRefreshOn } = result.current;

    expect(isRefreshOn).toBe(false);
  });

  test('Can handle no treeData', () => {
    global.treeData = null;

    const { result } = renderHook(() => useTreeData());
    const { data, isRefreshOn } = result.current;

    expect(data.dagRuns).toStrictEqual([]);
    expect(data.groups).toStrictEqual({});
    expect(isRefreshOn).toBe(false);
  });

  test('Can handle empty treeData object', () => {
    global.treeData = {};

    const { result } = renderHook(() => useTreeData());
    const { data, isRefreshOn } = result.current;

    expect(data.dagRuns).toStrictEqual([]);
    expect(data.groups).toStrictEqual({});
    expect(isRefreshOn).toBe(false);
  });
});

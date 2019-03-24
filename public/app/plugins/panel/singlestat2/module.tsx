import { ReactPanelPlugin, getStatsCalculators } from '@grafana/ui';
import { SingleStatOptions, defaults, SingleStatBaseOptions } from './types';
import { SingleStatPanel } from './SingleStatPanel';
import cloneDeep from 'lodash/cloneDeep';
import { SingleStatEditor } from './SingleStatEditor';

const optionsToKeep = ['valueOptions', 'stat', 'maxValue', 'maxValue', 'thresholds', 'valueMappings'];

export const singleStatBaseOptionsCheck = (
  options: Partial<SingleStatBaseOptions>,
  prevPluginId: string,
  prevOptions?: any
) => {
  if (prevOptions) {
    optionsToKeep.forEach(v => {
      if (prevOptions.hasOwnProperty(v)) {
        options[v] = cloneDeep(prevOptions.display);
      }
    });
  }
  return options;
};

export const singleStatMigrationCheck = (exiting: any, oldVersion?: string) => {
  const options = exiting as Partial<SingleStatOptions>;
  if (options.valueOptions) {
    // 6.1 renamed some stats, This makes sure they are up to date
    // avg -> mean, current -> last, total -> sum

    const { valueOptions } = options;
    if (valueOptions && valueOptions.stat) {
      valueOptions.stat = getStatsCalculators([valueOptions.stat]).map(s => s.id)[0];
    }
  }
  return options;
};

export const reactPanel = new ReactPanelPlugin<SingleStatOptions>(SingleStatPanel)
  .setDefaults(defaults)
  .setEditor(SingleStatEditor)
  .setPanelChangeHandler(singleStatMigrationCheck)
  .setMigrationHandler(singleStatMigrationCheck);

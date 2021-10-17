import { getModule, React } from '@webpack';
import { UPlugin } from '@classes';
import { SettingsErrorBoundary } from './components/settings';
import { debounce } from 'lodash';

const status = getModule(['updateRemoteSettings']);
const settings = Astra.settings.get('AFK-on-exit');

let prevStatus;

export default class dndOnClose extends UPlugin {
  start() : void {
    document.addEventListener('visibilitychange', _.debounce(this.cumIntoClient, 3000), false);
    this.__uSettingsTabs = {
      sections: [
        {
          section: 'AFK on Exit',
          label: 'AFK on Exit Settings',
          element: (): React.ReactElement<SettingsErrorBoundary> => <SettingsErrorBoundary />
        }
      ]
    };
  }

  cumIntoClient() : void {
    if (document.visibilityState === 'hidden' && prevStatus !== 'hidden') {
      prevStatus = 'hidden';
      status.updateRemoteSettings({ status: settings.get('closingStatus', 'idle').value });
      console.log('Changing status...');
    } else if (document.visibilityState === 'visible' && prevStatus === 'hidden') {
      prevStatus = 'visible';
      status.updateRemoteSettings({ status: settings.get('openingStatus', 'online').value });
      console.log('Changing status...');
    }
  }
  
  stop() : void {
    document.removeEventListener("visibilitychange", this.cumIntoClient, false);
    this.__uSettingsTabs = {};
  }
}

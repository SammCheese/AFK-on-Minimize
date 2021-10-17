import { getModule, React } from '@webpack';
import { UPlugin } from '@classes';
import { SettingsErrorBoundary } from './components/settings';
import { debounce } from 'lodash';

const status = getModule(['updateRemoteSettings']);
const dStatus = getModule(['getStatus']);
const currentUser = getModule(['getCurrentUser']).getCurrentUser().id;
const settings = Astra.settings.get('AFK-on-exit');

let prevStatus;
let prevDStatus;
let check = false;

export default class dndOnClose extends UPlugin {
  start() : void {
    this.cumIntoClient = this.cumIntoClient.bind(this);
    this.throttledCum = debounce(this.cumIntoClient, 3000);

    document.addEventListener('visibilitychange', this.throttledCum, false);
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
    const restoreStatus = settings.get('restoreStatus', true);
    console.log('Something has changed');

    if (restoreStatus && document.visibilityState === 'hidden' && check === false) {
      prevDStatus = dStatus.getStatus(currentUser);
    }
    if (document.visibilityState === 'hidden' && prevStatus !== 'hidden') {
      prevStatus = 'hidden';
      check = true;
      status.updateRemoteSettings({ status: settings.get('closingStatus', 'idle').value });
      console.log('Changing status...');
    } else if (document.visibilityState === 'visible' && prevStatus === 'hidden') {
      prevStatus = 'visible';
      check = false;
      status.updateRemoteSettings({ status: `${restoreStatus ? prevDStatus : settings.get('openingStatus', 'online').value}` });
      console.log('Changing status...');
    }
  }
  
  stop() : void {
    document.removeEventListener('visibilitychange', this.throttledCum, false);
    this.__uSettingsTabs = {};
  }
}

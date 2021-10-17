import { IPCEvents } from '@src/ipc/constants';
import { ipcRenderer } from 'electron';

import { getModule } from '@webpack';
import { UPlugin } from '@classes';

const status = getModule(['updateRemoteSettings']);

let prevStatus;

export default class dndOnClose extends UPlugin {
  start() : void {
    document.addEventListener('visibilitychange', this.cumIntoClient, false);
  }

  cumIntoClient() : void {
    if (document.visibilityState === 'hidden' && prevStatus !== 'hidden') {
      prevStatus = 'hidden';
      status.updateRemoteSettings({ status: 'idle' });
      console.log('Changing status...');
    } else if (document.visibilityState === 'visible' && prevStatus === 'hidden') {
      prevStatus = 'visible';
      status.updateRemoteSettings({ status: 'online' });
      console.log('Changing status...');
    }
  }
  
  stop() : void {
    document.removeEventListener("visibilitychange", this.cumIntoClient, false);
  }
}

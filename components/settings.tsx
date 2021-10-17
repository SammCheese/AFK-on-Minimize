/* eslint-disable react/display-name */ // Pls shut the fuck up
import { ErrorBoundary } from '@components';
import { makeLazy, wrapSettings } from '@util';
import { DNGetter, React } from '@webpack';

const statusOptions = [
  {
    name: 'Online',
    id: 'online'
  },
  {
    name: 'Idle',
    id: 'idle'
  },
  {
    name: 'Do not Disturb',
    id: 'dnd'
  },
  {
    name: 'Invisible',
    id: 'invisible'
  }
];

const settings = Astra.settings.get('AFK-on-exit');

const SettingsView = makeLazy({
  promise: () => {

    const { FormSection, FormItem, Markdown, FormDivider, SwitchItem, SelectTempWrapper } = DNGetter;
    
    
    const SettingsView = React.memo(({} : { openingStatus : string, closingStatus : string, restoreStatus : boolean}) : React.ReactElement<FormSection> => (
      <div>
        <FormSection title='AFK on Exit' tag='h1'>
          <FormItem>
            <Markdown>
              Customize your Status on given Events here
            </Markdown>
          </FormItem>
        </FormSection>
        <FormDivider />
        <br/>
        <div>
          <SwitchItem
            onChange={React.useCallback((value: boolean): void => settings.set('restoreStatus', value), [])}
            value={settings.get('restoreStatus', true)}
          >
            Restore Status after opening Discord
          </SwitchItem>
          <br/>
          <FormItem>
            <Markdown>
              Status to be set when Opening Discord (Disable Restore Status):
            </Markdown>
          </FormItem>
          <SelectTempWrapper
            onChange={React.useCallback((value: string): void => settings.set('openingStatus', value), [])}
            options={statusOptions.map(status => ({
              label: status.name,
              value: status.id
            }))}
            value={settings.get('openingStatus', 'online').value}
            disabled={settings.get('restoreStatus', true)}
          >
            Status to be set when Opening Discord (Disable Restore Status)
          </SelectTempWrapper>
          <br/>
          <FormItem>
            <Markdown>
              Status to be set when Closing Discord
            </Markdown>
          </FormItem>
          <SelectTempWrapper
            onChange={React.useCallback((value: string): void => settings.set('closingStatus', value), [])}
            options={statusOptions.map(status => ({
              label: status.name,
              value: status.id
            }))}
            value={settings.get('closingStatus', 'idle').value}
            
          >
            Status to be set when closing Discord
          </SelectTempWrapper>
        </div>
      </div>
    ));
    return Promise.resolve(wrapSettings(settings, SettingsView));
  }
});

export class SettingsErrorBoundary extends ErrorBoundary {
  constructor(props: { label: string}) {
    props.label = 'AFK on Exit Setting Panel';
    super(props);
  }
  
  renderChildren(): React.ReactElement<typeof SettingsView> {
    return <SettingsView />;
  }
}

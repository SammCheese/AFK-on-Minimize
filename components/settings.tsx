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


const SettingsView = makeLazy({
  promise: () => {

    const settings = Astra.settings.get('AFK-on-exit');
    const { FormSection, FormItem, Markdown, FormDivider } = DNGetter;
    const { SelectInput } = require('powercord/components/settings');

    const SettingsView = React.memo(({} : { openingStatus : string, closingStatus : string}) : React.ReactElement<typeof FormSection> => (
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
            <SelectInput
              onChange={React.useCallback((value: string): void => settings.set('openingStatus', value), [])}
              options={statusOptions.map(status => ({
                label: status.name,
                value: status.id,
              }))}
              value={settings.get('openingStatus', 'online').value}
              
            >
              Status to be set when Opening Discord
          </SelectInput>
          <SelectInput
              onChange={React.useCallback((value: string): void => settings.set('closingStatus', value), [])}
              options={statusOptions.map(status => ({
                label: status.name,
                value: status.id,
              }))}
              value={settings.get('closingStatus', 'idle').value}
              
            >
              Status to be set when closing Discord
          </SelectInput>
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
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import * as Icons from 'modules/Icons-All';

Icons.sort((a, b) => a.name > b.name).forEach((ICN) => {
  storiesOf('Icons', module).add(ICN.name, () => (
    <ICN
      onClick={action('clicked!')}
      size={40}
      style={{ color: 'var(--rv-color)' }}
    />
  ));
});

/*
const MainItem = Icons[0];
const SecondItem = Icons[1];

export default {
    title: "Icons",
    component: MainItem,
    //subcomponents: { SecondItem },
    argTypes: {
    backgroundColor: { control: 'color' },
    },
};

const Template = (args) => <MainItem {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  primary: true,
  label: 'Button',
};
*/

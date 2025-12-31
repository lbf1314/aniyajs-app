import defaultSettings from 'config/defaultSettings';
import type { DefaultSettings } from 'config/defaultSettings';
import type { CreateSliceOptions } from '@aniyajs/plugin-tooltik';

const updateColorWeak: (colorWeak: boolean) => void = (colorWeak) => {
  const root = document.getElementById('root');
  if (root) {
    root.className = colorWeak ? 'colorWeak' : '';
  }
};

const settingModel: CreateSliceOptions<DefaultSettings> = {
  name: "settings",
  initialState: defaultSettings,
  reducers: {
    changeSetting: (state = defaultSettings, { payload }) => { 
      const { colorWeak, contentWidth } = payload;

      if (state.contentWidth !== contentWidth && window.dispatchEvent) {
        window.dispatchEvent(new Event('resize'));
      }

      updateColorWeak(!!colorWeak);

      let _state = state || {};
      _state = Object.assign(_state, {
        ...payload,
      })
    },
  },
}

export default settingModel;

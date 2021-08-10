import config from './rollup.config';
import {uglify} from "rollup-plugin-uglify";

export default config.map(item => {
  item.plugins.push(uglify({
    compress: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
    }
  }));
  return item;
});
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src'],
  format: 'esm',
  minify: true,
  dts: true,
  platform: 'browser',
});

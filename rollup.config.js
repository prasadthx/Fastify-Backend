import replace from '@rollup/plugin-replace';

export default {
  input: './admin/admin.js',
  output: {
    dir: 'output',
    format: 'es'
  },
  plugins: [
    replace({
        preventAssignment: true,
    })
  ]
};
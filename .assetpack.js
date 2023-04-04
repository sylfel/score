import { compressPng } from '@assetpack/plugin-compress'
import { pixiManifest } from '@assetpack/plugin-manifest'

export default {
  entry: './raw-assets',
  output: './public/assets/',
  ignore: ['**/*.kra*'],
  cache: false,
  plugins: {
    compressPng: compressPng(),
    manifest: pixiManifest({
      output: './public/assets/assets-manifest.json',
    }),
  },
}

import { compressPng } from '@assetpack/plugin-compress'
import { pixiManifest } from '@assetpack/plugin-manifest'
import { pixiTexturePacker } from '@assetpack/plugin-texture-packer'

export default {
  entry: './raw-assets',
  output: './public/assets/',
  ignore: ['**/*.kra*'],
  cache: false,
  plugins: {
    compressPng: compressPng(),
    texture: pixiTexturePacker({
      texturePacker: {
        removeFileExtension: true,
      },
    }),
    manifest: pixiManifest({
      output: './public/assets/assets-manifest.json',
    }),
  },
}

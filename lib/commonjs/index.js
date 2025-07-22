"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mediaPickerConverter = exports.mediaPicker = exports.mediaConvert = exports.mediaCompress = void 0;
var _reactNative = require("react-native");
var _utils = require("./utils.js");
const LINKING_ERROR = `The package 'react-native-media-picker-converter' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ""
}) + "- You rebuilt the app after installing the package\n" + "- You are not using Expo Go\n";
const MediaPickerConverter = _reactNative.NativeModules.MediaPickerConverter ? _reactNative.NativeModules.MediaPickerConverter : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
const mediaCompress = async ({
  source,
  format,
  maxSize
}) => {
  try {
    const originalImages = Array.isArray(source) ? source : [source];
    const compressImage = async img => {
      const path = (0, _utils.getPath)(img);
      const compressFormat = (0, _utils.getCompressFormat)(format);
      for (const quality of _utils.compressParameters) {
        const compressed = await MediaPickerConverter.convertImage(path, compressFormat, quality);
        if (compressed.fileSize && compressed.fileSize / 1024 <= maxSize) {
          return compressed;
        }
      }
      console.warn(`Image at path ${path} cannot be compressed to less than ${maxSize} KB.`);
      return null;
    };
    const results = await Promise.all(originalImages.map(compressImage));
    return results.filter(result => result !== null);
  } catch (error) {
    throw new Error(`Compression failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};
exports.mediaCompress = mediaCompress;
const mediaConvert = async ({
  source,
  format = "jpeg",
  quality = 1
}) => {
  try {
    const originalImages = Array.isArray(source) ? source : [source];
    const conversionPromises = originalImages.map(img => {
      const path = (0, _utils.getPath)(img);
      return MediaPickerConverter.convertImage(path, format, quality);
    });
    return await Promise.all(conversionPromises);
  } catch (error) {
    throw new Error(`Compression failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};
exports.mediaConvert = mediaConvert;
const mediaPicker = ({
  options,
  cameraOptions,
  libraryOptions,
  errorMessage,
  selectModal
}) => {
  const selectionLimit = 1;
  const mediaOptions = {
    mediaType: "photo",
    ...options
  };
  const title = selectModal?.title || "Open";
  const subtitle = selectModal?.subtitle || "";
  const camera = selectModal?.camera || "Camera";
  const library = selectModal?.library || "Gallery";
  const cancel = selectModal?.cancel || "Cancel";
  const onCancel = selectModal?.onCancel;
  return new Promise(resolve => {
    _reactNative.Alert.alert(title, subtitle, [{
      text: cancel,
      style: "cancel",
      onPress: () => onCancel?.()
    }, {
      text: camera,
      onPress: async () => {
        const images = await (0, _utils.selectImages)("camera", {
          ...mediaOptions,
          ...cameraOptions
        }, errorMessage);
        resolve(images);
      }
    }, {
      text: library,
      onPress: async () => {
        const images = await (0, _utils.selectImages)("library", {
          ...mediaOptions,
          selectionLimit,
          ...libraryOptions
        }, errorMessage);
        resolve(images);
      }
    }]);
  });
};
exports.mediaPicker = mediaPicker;
const mediaPickerConverter = async ({
  pickerOptions,
  converterOptions
}) => {
  const selectedImages = await mediaPicker({
    ...pickerOptions
  });
  if (!selectedImages) return;
  if (converterOptions?.maxSize) {
    return await mediaCompress({
      source: selectedImages,
      format: converterOptions?.format,
      maxSize: converterOptions?.maxSize
    });
  } else {
    return await mediaConvert({
      source: selectedImages,
      quality: converterOptions?.quality || 1,
      format: converterOptions?.format || "jpg"
    });
  }
};
exports.mediaPickerConverter = mediaPickerConverter;
//# sourceMappingURL=index.js.map
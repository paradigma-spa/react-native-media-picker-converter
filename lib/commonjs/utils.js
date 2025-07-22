"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectImages = exports.saveToGallery = exports.getPath = exports.getCompressFormat = exports.compressParameters = void 0;
var _reactNative = require("react-native");
var _reactNativeImagePicker = require("react-native-image-picker");
var _reactNativeFileAccess = require("react-native-file-access");
const saveToGallery = async response => {
  const images = response?.assets;
  if (!images || !images.length) return response;
  try {
    const savedAssets = await Promise.all(images.map(async image => {
      const originalPath = image.uri;
      if (originalPath && originalPath.startsWith("file://")) {
        const fileName = image.fileName || `image_${Date.now()}.jpg`;
        const destinationPath = `${_reactNativeFileAccess.Dirs.DocumentDir}/${fileName}`;
        await _reactNativeFileAccess.FileSystem.cp(originalPath, destinationPath);
        return {
          ...image,
          originalPath: destinationPath
        };
      }
      return image;
    }));
    return {
      ...response,
      assets: savedAssets
    };
  } catch (e) {
    console.error(e);
  }
  return response;
};
exports.saveToGallery = saveToGallery;
const selectImages = async (origin, options, errorMessage) => {
  let response;
  try {
    if (origin === "camera") {
      const cameraResponse = await (0, _reactNativeImagePicker.launchCamera)(options);
      if (typeof cameraResponse === "string") console.warn(cameraResponse);
      response = await saveToGallery(cameraResponse);
    } else {
      response = await (0, _reactNativeImagePicker.launchImageLibrary)(options);
    }
    if (response.assets && response.assets.length > 0) {
      return response.assets;
    }
  } catch (error) {
    console.error(error);
    if (errorMessage) {
      _reactNative.Alert.alert(errorMessage);
    }
  }
  return;
};
exports.selectImages = selectImages;
const getPath = img => {
  return (img.uri || img.url)?.replace("file://", "");
};
exports.getPath = getPath;
const compressParameters = exports.compressParameters = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3];
const getCompressFormat = format => {
  return !format || format === "png" ? "jpg" : format;
};
exports.getCompressFormat = getCompressFormat;
//# sourceMappingURL=utils.js.map
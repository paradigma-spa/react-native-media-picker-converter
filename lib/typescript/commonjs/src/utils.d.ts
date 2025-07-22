import { type ImagePickerResponse, type OptionsCommon, type PhotoQuality } from "react-native-image-picker";
import type { Format, Media } from "./types";
export declare const saveToGallery: (response: ImagePickerResponse) => Promise<ImagePickerResponse>;
export declare const selectImages: (origin: "camera" | "library", options: OptionsCommon, errorMessage?: string) => Promise<import("react-native-image-picker").Asset[] | undefined>;
export declare const getPath: (img: Media) => string | undefined;
export declare const compressParameters: PhotoQuality[];
export declare const getCompressFormat: (format?: Format) => "jpg" | "jpeg" | "webp";
//# sourceMappingURL=utils.d.ts.map
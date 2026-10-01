import { Image as RNImage, type ImageProps as RNImageProps, type ImageStyle, type StyleProp } from "react-native";
import { type ImageAspect, type ImageFit } from "@/core";
import { useTheme } from "../theme";

export interface ImageProps extends Omit<RNImageProps, "style" | "accessibilityLabel"> {
  /** Alternative text for screen readers. Pass `""` for a decorative image. */
  alt: string;
  aspect?: ImageAspect;
  fit?: ImageFit;
  rounded?: boolean;
  style?: StyleProp<ImageStyle>;
}

const aspectRatio: Record<ImageAspect, number | undefined> = { auto: undefined, square: 1, video: 16 / 9, portrait: 3 / 4 };

export function Image({ alt, aspect = "auto", fit = "cover", rounded = false, style, ...props }: ImageProps) {
  const { tokens } = useTheme();
  return (
    <RNImage
      accessible={alt !== ""}
      accessibilityLabel={alt || undefined}
      resizeMode={fit}
      style={[
        {
          backgroundColor: tokens.muted,
          aspectRatio: aspectRatio[aspect],
          alignSelf: aspect === "auto" ? undefined : "stretch",
          borderRadius: rounded ? tokens.radiusCard : 0,
        },
        style,
      ]}
      {...props}
    />
  );
}

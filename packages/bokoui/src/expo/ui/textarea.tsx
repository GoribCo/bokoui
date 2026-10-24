import { Input, type InputProps } from "./input";
import { sizes } from "../internal/shared";

export interface TextareaProps extends Omit<InputProps, "startAdornment" | "endAdornment" | "multiline"> {
  /** Visible lines. Default 3. */
  rows?: number;
}

export function Textarea({ rows = 3, size = "md", style, containerStyle, ...props }: TextareaProps) {
  const font = sizes[size].font;
  const lineHeight = font * 1.4;
  return (
    <Input
      multiline
      textAlignVertical="top"
      size={size}
      containerStyle={[{ alignItems: "flex-start", paddingVertical: 8 }, containerStyle]}
      style={[{ minHeight: rows * lineHeight, lineHeight }, style]}
      {...props}
    />
  );
}

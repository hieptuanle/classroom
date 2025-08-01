import type { TextProps } from "./theme-types";

import { Text } from "./themed";

export function MonoText(props: TextProps) {
  const { style, ...textProps } = props;
  return <Text {...textProps} style={[style, { fontFamily: "SpaceMono" }]} />;
}

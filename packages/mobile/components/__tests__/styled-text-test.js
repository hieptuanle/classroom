import { render } from "@testing-library/react-native";

import { MonoText } from "../styled-text";

it("renders correctly", () => {
  const { getByText } = render(<MonoText>Snapshot test!</MonoText>);

  // Test that the text is rendered
  expect(getByText("Snapshot test!")).toBeTruthy();
});

it("matches snapshot", () => {
  const tree = render(<MonoText>Snapshot test!</MonoText>).toJSON();
  expect(tree).toMatchSnapshot();
});

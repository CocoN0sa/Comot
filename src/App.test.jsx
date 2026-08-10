import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders COMOT", () => {
  render(<App />);
  expect(screen.getByText(/COMOT/i)).toBeInTheDocument();
});

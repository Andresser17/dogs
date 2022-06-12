import { render, screen } from "@testing-library/react";
import Homepage from "../Homepage";

describe("Homepage", () => {
  test("render menu links", () => {
    render(<Homepage />);
    const home = screen.getByText(/home/i);
    const search = screen.getByText(/search/i);
    const create = screen.getByText(/create/i);

    expect(home.href).toContain("#home");
    expect(search.href).toContain("#search");
    expect(create.href).toContain("#create");
  });
});

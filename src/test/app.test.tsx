import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import App from "@/App";
import { conflicts, type Booking } from "@/lib/store";

describe("App", () => {
  it("renders the home page with the hero heading", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Rwanda is waiting/i)).toBeInTheDocument();
  });

  it("shows the 404 page for unknown routes", () => {
    render(
      <MemoryRouter initialEntries={["/does-not-exist"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });

  it("allows non-overlapping same-day vehicle reservations", () => {
    const booking = {
      vehicle_id: "rav4",
      status: "paid",
      start_date: "2026-10-14",
      end_date: "2026-10-14",
      pickup_time: "09:00",
      return_time: "12:00",
    } as Booking;
    expect(conflicts([booking], "rav4", "2026-10-14", "2026-10-14", "13:00", "17:00")).toHaveLength(
      0,
    );
    expect(conflicts([booking], "rav4", "2026-10-14", "2026-10-14", "11:00", "14:00")).toHaveLength(
      1,
    );
  });
});

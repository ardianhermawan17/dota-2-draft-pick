import { fireEvent, render, screen } from "@testing-library/react";
import type { ImgHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";
import { createMockHero } from "@shared/components/template/__mocks__/heroes.mock";
import { HeroItem } from "./hero-item";

vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

describe("HeroItem", () => {
  it("renders hero image with correct src", () => {
    const hero = { ...createMockHero(10, "strength"), slug: "axe" };
    render(<HeroItem hero={hero} />);

    const image = screen.getByTestId("hero-item-image") as HTMLImageElement;
    expect(image.getAttribute("src")).toContain("/images/heroes/axe-full.png");
  });

  it("renders slotNumber badge when provided", () => {
    render(<HeroItem hero={createMockHero(1, "strength")} slotNumber={3} />);
    expect(screen.getByTestId("hero-item-slot").textContent).toBe("3");
  });

  it("does not render slotNumber when undefined", () => {
    render(<HeroItem hero={createMockHero(1, "strength")} />);
    expect(screen.queryByTestId("hero-item-slot")).toBeNull();
  });

  it("applies grayscale filter when status is banned", () => {
    render(<HeroItem hero={createMockHero(1, "strength")} status="banned" />);

    const image = screen.getByTestId("hero-item-image");
    expect(image.className).toContain("grayscale");
  });

  it("renders X icon when status is banned", () => {
    render(<HeroItem hero={createMockHero(1, "strength")} status="banned" />);
    expect(screen.getByTestId("hero-item-banned-icon")).toBeTruthy();
  });

  it("applies opacity when status is picked", () => {
    render(<HeroItem hero={createMockHero(1, "strength")} status="picked" />);

    const image = screen.getByTestId("hero-item-image");
    expect(image.className).toContain("opacity-70");
  });

  it("does not render X icon when status is picked", () => {
    render(<HeroItem hero={createMockHero(1, "strength")} status="picked" />);
    expect(screen.queryByTestId("hero-item-banned-icon")).toBeNull();
  });

  it("calls onClick with heroId when clicked", () => {
    const onClick = vi.fn();
    const hero = createMockHero(44, "agility");
    render(<HeroItem hero={hero} onClick={onClick} />);

    fireEvent.click(screen.getByTestId("hero-item"));
    expect(onClick).toHaveBeenCalledWith(44);
  });

  it("renders fallback image on image load error", () => {
    render(<HeroItem hero={{ ...createMockHero(55, "intelligence"), slug: "missing" }} />);

    const image = screen.getByTestId("hero-item-image") as HTMLImageElement;
    fireEvent.error(image);

    expect(image.getAttribute("src")).toContain("data:image/svg+xml");
  });
});

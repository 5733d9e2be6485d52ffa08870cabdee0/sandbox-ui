import { useResourceDelayedStatus } from "@app/components/SEStatusLabel/useResourceDelayedStatus";
import {
  ResourceStatus,
  ResourceStatusDelayed,
} from "@app/components/ResourceStatusLabel/types";
import { renderHook } from "@testing-library/react-hooks";
import { act } from "@testing-library/react";

describe("useResourceDelayedStatus", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should display the warning message after N minutes", () => {
    const createdAt = new Date();
    const { result } = renderHook(() =>
      useResourceDelayedStatus(ResourceStatus.CREATING, createdAt)
    );

    expect(result.current).toEqual(undefined);

    act(() => {
      jest.advanceTimersByTime(1000 * 60 * 5);
    });

    expect(result.current).toEqual(ResourceStatusDelayed.WARNING);

    act(() => {
      jest.advanceTimersByTime(1000 * 60 * 5);
    });

    expect(result.current).toEqual(ResourceStatusDelayed.ERROR);
  });
});

import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initial value is always `false` on both server and the client's first
  // (hydration) render — this MUST match exactly, since the server has no
  // `window` to know the real viewport. The real value is set afterwards
  // inside useEffect, which only runs post-hydration, so updating state
  // there causes a normal follow-up re-render instead of a hydration
  // mismatch. (A previous version read `window.innerWidth` directly in the
  // useState initializer, which runs during hydration too and produced a
  // different value than the server's `false` -> hydration error.)
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Set the correct value right after mount (this was missing in the
    // original version, which only listened for future "change" events).
    onChange()

    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}

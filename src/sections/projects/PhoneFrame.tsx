import type { ReactNode } from 'react'

type PhoneFrameProps = {
  children: ReactNode
  className?: string
  /** id of the screen, so carousel controls can point at it with aria-controls. */
  screenId?: string
  live?: 'off' | 'polite'
}

/** A CSS-built phone: metal rim, thin black bezel, side keys, punch-hole camera and a glass glare. */
export function PhoneFrame({ children, className = '', screenId, live }: PhoneFrameProps) {
  return (
    <div className={`proj-phone ${className}`}>
      <div className="proj-phone-bezel">
        <div className="proj-phone-screen" id={screenId} aria-live={live}>
          {children}
          <span className="proj-phone-cam" aria-hidden="true" />
          <span className="proj-phone-glare" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

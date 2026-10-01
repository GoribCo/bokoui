/** Optional parts of the shell; flip a flag to show or hide them. */
export const features = {
  /** Header font picker (FR-12.3). Off by default: fonts normally follow the design style. */
  fontSwitcher: false,
  /** Design-style picker in the display settings drawer. */
  styleSwitcher: true,
  /** Extra header button with the same controls in a dropdown, to compare with the drawer. */
  displaySettingsMenu: true,
} as const;

/*
 * Class strings several recipes repeat. Every one is a complete literal: Tailwind reads classes from the built
 * source and cannot see names assembled at runtime (see the recipes test). Not exported from the package.
 */

/** Disabled controls: not-allowed cursor and the style's dimmed opacity. */
export const disabledClass = "disabled:cursor-not-allowed disabled:opacity-(--bokoui-disabled-opacity)";

/** A filled tone surface (solid alert, badge, tag, completed step). */
export const toneSolidClass = "border-(--tone-border) bg-(--tone) text-(--tone-fg)";

/** Invalid state: the border takes the (danger) tone. */
export const invalidBorderClass = "aria-invalid:border-(--tone)";

/** Inline icons sized like text. */
export const inlineSvgClass = "[&_svg]:size-4 [&_svg]:shrink-0";

/** Hidden visually (kept for screen readers) inside a collapsed sidebar rail. */
export const collapsedSrOnlyClass = "group-data-[collapsed]/sidebar:sr-only";

/** Width changes animate, except with reduced motion. */
export const widthTransitionClass = "transition-[width] duration-(--bokoui-duration) ease-ui motion-reduce:transition-none";

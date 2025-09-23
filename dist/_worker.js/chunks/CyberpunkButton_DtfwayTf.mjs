globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, c as createComponent, m as maybeRenderHead, g as addAttribute, an as renderSlot, a as renderTemplate } from './astro/server_BDhFni3J.mjs';
/* empty css                           */

const $$Astro$1 = createAstro("https://mybonzo.com");
const $$GlassPanel = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$GlassPanel;
  const {
    title,
    variant = "default",
    padding = "md",
    className = ""
  } = Astro2.props;
  const variantClasses = {
    default: "glass-panel-default",
    highlight: "glass-panel-highlight",
    warning: "glass-panel-warning",
    success: "glass-panel-success"
  };
  const paddingClasses = {
    sm: "glass-panel-sm",
    md: "glass-panel-md",
    lg: "glass-panel-lg"
  };
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(`glass-panel ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`, "class")} data-astro-cid-5cyrmoy2> ${title && renderTemplate`<div class="glass-panel-header" data-astro-cid-5cyrmoy2> <h3 class="glass-panel-title" data-astro-cid-5cyrmoy2>${title}</h3> </div>`} <div class="glass-panel-content" data-astro-cid-5cyrmoy2> ${renderSlot($$result, $$slots["default"])} </div> </div> `;
}, "Q:/mybonzo/luc-de-zen-on/src/layouts/components/GlassPanel.astro", void 0);

const $$Astro = createAstro("https://mybonzo.com");
const $$CyberpunkButton = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CyberpunkButton;
  const {
    text,
    href,
    type = "button",
    variant = "primary",
    size = "md",
    icon,
    disabled = false,
    className = "",
    onclick
  } = Astro2.props;
  const baseClasses = "cyberpunk-btn";
  const variantClasses = {
    primary: "cyberpunk-btn-primary",
    secondary: "cyberpunk-btn-secondary",
    danger: "cyberpunk-btn-danger",
    success: "cyberpunk-btn-success",
    outline: "cyberpunk-btn-outline"
  };
  const sizeClasses = {
    sm: "cyberpunk-btn-sm",
    md: "cyberpunk-btn-md",
    lg: "cyberpunk-btn-lg"
  };
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  return renderTemplate`${href ? renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")}${addAttribute(buttonClasses, "class")} data-astro-cid-6ee5p5qg>${icon && renderTemplate`<span class="cyberpunk-btn-icon" data-astro-cid-6ee5p5qg>${icon}</span>`}<span data-astro-cid-6ee5p5qg>${text}</span></a>` : renderTemplate`<button${addAttribute(type, "type")}${addAttribute(buttonClasses, "class")}${addAttribute(disabled, "disabled")}${addAttribute(onclick, "onclick")} data-astro-cid-6ee5p5qg>${icon && renderTemplate`<span class="cyberpunk-btn-icon" data-astro-cid-6ee5p5qg>${icon}</span>`}<span data-astro-cid-6ee5p5qg>${text}</span></button>`}`;
}, "Q:/mybonzo/luc-de-zen-on/src/layouts/components/CyberpunkButton.astro", void 0);

export { $$GlassPanel as $, $$CyberpunkButton as a };

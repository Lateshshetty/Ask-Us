import { useState, useEffect, useRef, useCallback } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL;


const styles = `
@import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Oswald:wght@400;600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root {
  --paper:      #e8dfc8;
  --paper-dark: #d6c9a8;
  --paper-aged: #c4b48e;
  --paper-deep: #b8a880;
  --ink:        #1a1208;
  --ink-dim:    #4a3f2e;
  --ink-faint:  #8a7a60;
  --red:        #b8001f;
  --red-dark:   #7a0012;
  --blue-stamp: #1a3a6e;
  --green-stamp:#1a5e2a;
  --manila:     #d4b87a;
  --burn:       rgba(0,0,0,0.06);
  --desk:       #2a1f14;
}

html { scroll-behavior: smooth; }

body {
  background: var(--desk);
  color: var(--ink);
  font-family: 'Courier Prime', monospace;
  min-height: 100vh;
  overflow-x: hidden;
}

/* ── DESK TEXTURE BACKGROUND ── */
.desk-bg {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background:
    repeating-linear-gradient(
      105deg,
      transparent 0px, transparent 3px,
      rgba(255,220,150,0.015) 3px, rgba(255,220,150,0.015) 4px
    ),
    repeating-linear-gradient(
      80deg,
      transparent 0px, transparent 8px,
      rgba(0,0,0,0.04) 8px, rgba(0,0,0,0.04) 9px
    ),
    radial-gradient(ellipse 80% 60% at 50% 40%, #3a2a1a 0%, #1a1208 100%);
}

/* ── FLOATING PAPER FRAGMENTS ── */
.fragment-layer {
  position: fixed; inset: 0; z-index: 1; pointer-events: none; overflow: hidden;
}
.fragment {
  position: absolute;
  background: var(--paper);
  opacity: 0;
  animation: float-fragment var(--dur, 18s) var(--delay, 0s) infinite ease-in-out;
  box-shadow: 1px 2px 6px rgba(0,0,0,0.3);
}
.fragment::before {
  content: '';
  position: absolute; inset: 0;
  background: repeating-linear-gradient(
    transparent, transparent 10px,
    rgba(26,18,8,0.06) 10px, rgba(26,18,8,0.06) 11px
  );
}
@keyframes float-fragment {
  0%   { opacity: 0; transform: translateY(110vh) rotate(var(--rot0, -8deg)); }
  8%   { opacity: 0.18; }
  50%  { opacity: 0.12; transform: translateY(40vh) rotate(var(--rot1, 4deg)) translateX(var(--drift, 30px)); }
  92%  { opacity: 0.06; }
  100% { opacity: 0; transform: translateY(-10vh) rotate(var(--rot2, 12deg)) translateX(var(--drift2, -20px)); }
}

/* ── RED STRING DECO (corner) ── */
.string-deco {
  position: fixed; top: 0; right: 0;
  width: 240px; height: 240px;
  z-index: 1; pointer-events: none;
  overflow: hidden;
}
.string-deco svg { width: 100%; height: 100%; opacity: 0.18; }

/* ── APP SHELL ── */
.app {
  position: relative; z-index: 2;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px 100px;
}

/* ── PAPER SHEET BASE ── */
.sheet {
  background: var(--paper);
  position: relative;
  box-shadow:
    0 2px 0 var(--paper-dark),
    0 4px 0 #c0b090,
    0 6px 0 #b0a080,
    6px 10px 32px rgba(0,0,0,0.5),
    0 0 80px rgba(0,0,0,0.2);
  transition: box-shadow 0.3s;
}
.sheet:hover {
  box-shadow:
    0 2px 0 var(--paper-dark),
    0 4px 0 #c0b090,
    0 6px 0 #b0a080,
    8px 16px 40px rgba(0,0,0,0.6),
    0 0 100px rgba(0,0,0,0.25);
}

/* paper noise texture */
.sheet::before {
  content: '';
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  mix-blend-mode: multiply;
}

/* ── HEADER ── */
.header-sheet {
  padding: 36px 48px 28px;
  border-bottom: 3px double var(--ink);
  margin-bottom: 32px;
  animation: sheet-slide-in 0.7s cubic-bezier(0.22,1,0.36,1) both;
}
@keyframes sheet-slide-in {
  from { opacity: 0; transform: translateY(-18px) rotate(-0.5deg); }
  to   { opacity: 1; transform: translateY(0) rotate(0deg); }
}

.doc-top-bar {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 20px;
}
.agency-block { display: flex; flex-direction: column; gap: 2px; }
.agency-name {
  font-family: 'Oswald', sans-serif;
  font-size: 28px; font-weight: 700; letter-spacing: 6px;
  color: var(--ink); text-transform: uppercase; line-height: 1;
  position: relative;
}
/* glitch flicker on agency name */
.agency-name::after {
  content: attr(data-text);
  position: absolute; inset: 0;
  color: var(--red); opacity: 0;
  animation: name-glitch 8s 2s infinite;
  clip-path: inset(40% 0 50% 0);
}
@keyframes name-glitch {
  0%,94%,100% { opacity: 0; transform: none; }
  95% { opacity: 0.6; transform: translateX(-3px); }
  96% { opacity: 0; transform: translateX(3px); }
  97% { opacity: 0.4; transform: translateX(-1px); }
  98% { opacity: 0; }
}
.agency-sub {
  font-family: 'Courier Prime', monospace;
  font-size: 10px; letter-spacing: 3px;
  color: var(--ink-dim); text-transform: uppercase;
}
.header-stamps { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }

/* ── STAMPS ── */
.stamp {
  font-family: 'Oswald', sans-serif;
  font-weight: 700; letter-spacing: 4px; text-transform: uppercase;
  border: 3px solid currentColor;
  display: inline-block; line-height: 1;
  transform: rotate(var(--rot, -2deg));
  position: relative; user-select: none;
  transition: transform 0.2s, opacity 0.2s;
}
.stamp:hover { transform: rotate(calc(var(--rot, -2deg) * 0.3)) scale(1.04); opacity: 1 !important; }
.stamp::before {
  content: '';
  position: absolute; inset: 2px;
  border: 1px solid currentColor; opacity: 0.4;
}
/* ink bleed effect */
.stamp::after {
  content: '';
  position: absolute; inset: -2px;
  background: currentColor;
  opacity: 0;
  filter: blur(6px);
  transition: opacity 0.3s;
  z-index: -1;
}
.stamp:hover::after { opacity: 0.08; }

.stamp-classified { color: var(--red); font-size: 18px; padding: 5px 14px; --rot: -3deg; opacity: 0.88; }
.stamp-top-secret { color: var(--red); font-size: 13px; padding: 4px 10px; --rot: 1.5deg; opacity: 0.75; }
.stamp-eyes-only  { color: var(--blue-stamp); font-size: 10px; padding: 3px 9px; --rot: -1deg; opacity: 0.70; }
.stamp-approved   { color: var(--green-stamp); font-size: 11px; padding: 4px 10px; --rot: 3deg; opacity: 0.80; }

/* stamp ink-splatter animation (plays once on mount) */
.stamp-appear {
  animation: stamp-splat 0.35s cubic-bezier(0.22,1,0.36,1) both;
}
@keyframes stamp-splat {
  0%   { opacity: 0; transform: rotate(calc(var(--rot,-2deg) - 15deg)) scale(1.4); filter: blur(2px); }
  60%  { opacity: 1; transform: rotate(calc(var(--rot,-2deg) + 2deg)) scale(0.96); filter: blur(0); }
  100% { transform: rotate(var(--rot,-2deg)) scale(1); }
}

.header-rule { border: none; border-top: 2px solid var(--ink); margin: 0; }

/* ── META TABLE ── */
.meta-table {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 0; border: 1px solid var(--ink-dim); margin-top: 16px;
}
.meta-cell { padding: 7px 12px; border-right: 1px solid var(--ink-dim); }
.meta-cell:last-child { border-right: none; }
.meta-key {
  font-family: 'Courier Prime', monospace; font-size: 8px;
  letter-spacing: 2px; color: var(--ink-dim); text-transform: uppercase; margin-bottom: 3px;
}
.meta-val { font-family: 'Special Elite', cursive; font-size: 12px; color: var(--ink); }
/* live clock pulse */
.meta-val.live { animation: val-pulse 1s ease infinite alternate; }
@keyframes val-pulse { from { opacity: 1; } to { opacity: 0.6; } }

/* ── CREW ROW ── */
.crew-row {
  display: flex; align-items: center; gap: 12px;
  margin-top: 16px; padding-top: 16px;
  border-top: 1px dashed var(--ink-faint);
  justify-content: space-between;
}
.operative-block { display: flex; align-items: center; gap: 10px; }
.operative-photo {
  width: 42px; height: 42px;
  border: 2px solid var(--ink);
  filter: sepia(0.7) contrast(1.15);
  object-fit: cover;
  transition: filter 0.3s;
}
.operative-photo:hover { filter: sepia(0) contrast(1); }
.operative-label { display: flex; flex-direction: column; gap: 2px; }
.operative-key { font-size: 8px; letter-spacing: 2px; color: var(--ink-dim); text-transform: uppercase; }
.operative-name { font-family: 'Special Elite', cursive; font-size: 14px; color: var(--ink); }

/* ── BUTTONS ── */
.btn {
  font-family: 'Oswald', sans-serif; font-size: 11px; font-weight: 600;
  letter-spacing: 3px; text-transform: uppercase;
  padding: 8px 20px; border: 2px solid var(--ink);
  background: var(--ink); color: var(--paper);
  cursor: pointer; transition: all 0.15s; position: relative; overflow: hidden;
}
.btn::after {
  content: '';
  position: absolute; inset: 0;
  background: var(--paper); transform: translateX(-101%);
  transition: transform 0.2s ease;
  z-index: 0;
}
.btn:hover::after { transform: translateX(0); }
.btn span { position: relative; z-index: 1; }
.btn:hover { color: var(--ink); }
.btn:disabled { opacity: 0.35; cursor: not-allowed; }
.btn:disabled::after { display: none; }

.btn-red { border-color: var(--red); background: var(--red); }
.btn-red:hover { color: var(--red); }
.btn-red::after { background: var(--paper); }

.btn-file { font-size: 12px; padding: 10px 32px; letter-spacing: 4px; }

/* ── INTEL INPUT ── */
.intel-sheet {
  margin-bottom: 28px; padding: 36px 48px;
  animation: sheet-slide-in 0.7s 0.15s cubic-bezier(0.22,1,0.36,1) both;
}
.field-label {
  font-family: 'Courier Prime', monospace; font-size: 9px;
  letter-spacing: 4px; color: var(--ink-dim); text-transform: uppercase;
  margin-bottom: 8px; display: flex; align-items: center; gap: 8px;
}
.field-label::before { content: '▪'; color: var(--red); }

.typewriter-field {
  width: 100%; background: transparent;
  border: none; border-bottom: 2px solid var(--ink); outline: none;
  color: var(--ink); font-family: 'Special Elite', cursive;
  font-size: 18px; line-height: 2; padding: 8px 0;
  resize: none; min-height: 120px; caret-color: var(--red); letter-spacing: 1px;
  transition: border-color 0.2s;
}
.typewriter-field:focus { border-color: var(--red); }
.typewriter-field::placeholder { color: var(--ink-faint); font-style: italic; font-size: 16px; }
.typewriter-field:disabled { opacity: 0.45; }

.lined-paper { position: relative; }
.lined-paper::before {
  content: '';
  position: absolute; left: 0; right: 0; top: 0; bottom: 0; pointer-events: none;
  background-image: repeating-linear-gradient(
    transparent, transparent 41px,
    rgba(26,18,8,0.08) 41px, rgba(26,18,8,0.08) 42px
  );
}

.file-footer {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 20px; padding-top: 16px; border-top: 1px dashed var(--ink-faint);
}
.char-count { font-family: 'Courier Prime', monospace; font-size: 10px; letter-spacing: 2px; color: var(--ink-faint); }

/* ── PROCESSING TICKER ── */
.processing-ticker {
  margin-bottom: 24px; padding: 10px 0;
  overflow: hidden; border-top: 1px solid var(--ink-faint); border-bottom: 1px solid var(--ink-faint);
  position: relative;
}
.ticker-track {
  display: flex; gap: 48px;
  white-space: nowrap;
  animation: ticker-scroll 12s linear infinite;
}
.ticker-item {
  font-family: 'Courier Prime', monospace; font-size: 9px;
  letter-spacing: 3px; color: var(--ink-dim); text-transform: uppercase;
  flex-shrink: 0;
}
.ticker-item.red { color: var(--red); font-weight: 700; }
@keyframes ticker-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* ── FIRST INTERCEPT BANNER ── */
.intercept-banner {
  margin-bottom: 24px; padding: 12px 28px;
  background: var(--paper-dark);
  border: 2px solid var(--red);
  display: flex; align-items: center; gap: 16px;
  animation: banner-reveal 0.4s cubic-bezier(0.22,1,0.36,1);
  position: relative; overflow: hidden;
}
.intercept-banner::before { content: '★'; color: var(--red); font-size: 18px; flex-shrink: 0; }
/* sweep highlight */
.intercept-banner::after {
  content: '';
  position: absolute; inset: 0; transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(184,0,31,0.08), transparent);
  animation: banner-sweep 2s 0.4s ease forwards;
}
@keyframes banner-sweep {
  to { transform: translateX(100%); }
}
@keyframes banner-reveal {
  from { opacity: 0; transform: translateY(-8px) scaleY(0.8); }
  to   { opacity: 1; transform: none; }
}
.intercept-label { font-family: 'Courier Prime', monospace; font-size: 10px; letter-spacing: 3px; color: var(--ink-dim); text-transform: uppercase; }
.intercept-name  { font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 16px; letter-spacing: 4px; color: var(--red); text-transform: uppercase; }
.intercept-seal  {
  margin-left: auto; font-family: 'Oswald', sans-serif; font-size: 10px; letter-spacing: 3px;
  padding: 4px 14px; border: 2px solid var(--red); color: var(--red); font-weight: 700; flex-shrink: 0;
  animation: seal-pulse 1.5s ease infinite alternate;
}
@keyframes seal-pulse { from { box-shadow: 0 0 0 rgba(184,0,31,0); } to { box-shadow: 0 0 12px rgba(184,0,31,0.35); } }

/* ── REPORT GRID ── */
.report-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
}
@media (max-width: 860px) {
  .report-grid { grid-template-columns: 1fr; }
  .meta-table { grid-template-columns: repeat(2,1fr); }
  .meta-cell:nth-child(2) { border-right: none; }
  .meta-cell:nth-child(3) { border-top: 1px solid var(--ink-dim); }
  .header-sheet, .intel-sheet { padding: 24px 20px; }
  .agency-name { font-size: 20px; letter-spacing: 3px; }
}
@media (max-width: 480px) {
  .app { padding: 0 12px 60px; }
  .crew-row { flex-direction: column; align-items: flex-start; gap: 12px; }
  .meta-table { grid-template-columns: 1fr 1fr; }
}

/* ── REPORT CARD ── */
.report {
  background: var(--paper); position: relative;
  box-shadow: 2px 2px 0 var(--paper-dark), 4px 4px 0 var(--paper-aged), 6px 8px 20px rgba(0,0,0,0.35);
  /* unfold animation: starts closed, opens down */
  transform-origin: top center;
  animation: card-unfold 0.6s var(--card-delay, 0s) cubic-bezier(0.22,1,0.36,1) both;
  overflow: hidden;
}
@keyframes card-unfold {
  0%   { opacity: 0; transform: rotateX(-40deg) scaleY(0.4) translateY(-20px); clip-path: inset(0 0 70% 0); }
  60%  { clip-path: inset(0 0 0% 0); }
  100% { opacity: 1; transform: none; clip-path: inset(0 0 0 0); }
}
.report:hover {
  transform: translateY(-4px) rotate(0.4deg);
  box-shadow: 2px 2px 0 var(--paper-dark), 4px 4px 0 var(--paper-aged), 10px 18px 32px rgba(0,0,0,0.5);
}
.report::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  mix-blend-mode: multiply;
}
/* staple */
.report::after {
  content: ''; position: absolute; top: 14px; left: 50%; transform: translateX(-50%);
  width: 22px; height: 4px; border: 1.5px solid #888; border-radius: 1px;
  background: #ccc; box-shadow: 0 1px 2px rgba(0,0,0,0.3); z-index: 10;
}

.report-stamp-area { position: absolute; top: 22px; right: 18px; z-index: 5; pointer-events: none; }
.report-header { padding: 28px 22px 14px; border-bottom: 2px solid var(--ink); position: relative; }
.report-doc-num { font-family: 'Courier Prime', monospace; font-size: 9px; letter-spacing: 2px; color: var(--ink-dim); margin-bottom: 6px; text-transform: uppercase; }
.report-source  { font-family: 'Oswald', sans-serif; font-weight: 600; font-size: 13px; letter-spacing: 4px; text-transform: uppercase; color: var(--ink); }
.report-rank-badge {
  position: absolute; bottom: 12px; right: 18px;
  font-family: 'Courier Prime', monospace; font-size: 9px; letter-spacing: 1px;
  color: var(--ink-dim); background: var(--paper-dark); padding: 2px 8px; border: 1px solid var(--ink-dim);
}
.report-body { padding: 18px 22px; min-height: 190px; position: relative; }
.report-field-key {
  font-family: 'Courier Prime', monospace; font-size: 8px; letter-spacing: 3px;
  color: var(--ink-dim); text-transform: uppercase; margin-bottom: 10px;
  display: flex; align-items: center; gap: 6px;
}
.report-field-key::after { content: ''; flex: 1; height: 1px; background: var(--ink-faint); opacity: 0.5; }

/* typewriter text reveal */
.report-text {
  font-family: 'Special Elite', cursive; font-size: 13px;
  line-height: 1.85; color: var(--ink); white-space: pre-wrap; word-break: break-word;
}
.report-text.typing::after {
  content: '▌';
  color: var(--red);
  animation: cursor-blink 0.7s steps(1) infinite;
}

/* redaction bars (shimmer while loading) */
.redact-line {
  height: 12px; background: var(--ink); margin-bottom: 8px; border-radius: 0;
  animation: redact-shimmer 1.4s ease infinite;
}
.redact-line:nth-child(2) { width: 85%; animation-delay: 0.15s; }
.redact-line:nth-child(3) { width: 92%; animation-delay: 0.3s; }
.redact-line:nth-child(4) { width: 70%; animation-delay: 0.45s; }
@keyframes redact-shimmer {
  0%,100% { opacity: 0.8; }
  50%      { opacity: 0.4; }
}

.report-awaiting {
  font-family: 'Courier Prime', monospace; font-size: 10px; letter-spacing: 2px;
  color: var(--ink-faint); text-transform: uppercase;
  display: flex; align-items: center; justify-content: center;
  height: 140px; border: 1px dashed var(--ink-faint);
  flex-direction: column; gap: 8px;
}
.report-transmitting {
  font-family: 'Courier Prime', monospace; font-size: 10px;
  letter-spacing: 3px; color: var(--ink-dim); text-transform: uppercase;
  display: flex; flex-direction: column; gap: 10px;
}

.typing-cursor {
  display: inline-block; width: 8px; height: 14px;
  background: var(--ink); animation: cursor-blink 0.8s steps(1) infinite;
  vertical-align: middle; margin-left: 4px;
}
@keyframes cursor-blink { 0%,100%{opacity:1} 50%{opacity:0} }

.report-footer {
  padding: 12px 22px; border-top: 1px dashed var(--ink-faint);
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(0,0,0,0.03);
}
.report-footer-text { font-family: 'Courier Prime', monospace; font-size: 8px; letter-spacing: 2px; color: var(--ink-faint); text-transform: uppercase; }

/* ── CLASSIFICATION SIDEBAR ── */
.class-sidebar {
  writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg);
  position: absolute; left: 0; top: 0; bottom: 0; width: 18px;
  background: var(--ink);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Oswald', sans-serif; font-size: 8px; font-weight: 700;
  letter-spacing: 3px; color: var(--paper); text-transform: uppercase; z-index: 6;
}
.report-inner { margin-left: 18px; }

/* fold lines */
.fold-h { position: absolute; left: 0; right: 0; height: 1px; background: rgba(0,0,0,0.05); pointer-events: none; }

/* ── COPY BUTTON on reports ── */
.copy-stamp {
  position: absolute; bottom: 14px; right: 18px;
  font-family: 'Oswald', sans-serif; font-size: 8px; letter-spacing: 2px;
  padding: 3px 9px; border: 1.5px solid var(--ink-faint); color: var(--ink-faint);
  background: transparent; cursor: pointer; text-transform: uppercase;
  transition: all 0.15s; z-index: 20;
}
.copy-stamp:hover { border-color: var(--ink); color: var(--ink); background: rgba(26,18,8,0.05); }
.copy-stamp.copied { border-color: var(--green-stamp); color: var(--green-stamp); }

/* ── SCAN LINE OVERLAY (on cards while loading) ── */
.scan-overlay {
  position: absolute; inset: 0; z-index: 8; pointer-events: none;
  background: repeating-linear-gradient(
    transparent 0px, transparent 3px,
    rgba(26,18,8,0.03) 3px, rgba(26,18,8,0.03) 4px
  );
  animation: scan-move 3s linear infinite;
  opacity: 0.5;
}
@keyframes scan-move {
  from { background-position: 0 0; }
  to   { background-position: 0 20px; }
}

/* ── LOGIN PAGE ── */
.login-page {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 100vh; gap: 24px; text-align: center; padding: 40px 20px;
}
.login-dossier {
  background: var(--paper); padding: 52px 56px; max-width: 520px; width: 100%;
  position: relative;
  box-shadow: 4px 4px 0 var(--paper-dark), 8px 8px 0 var(--paper-aged), 14px 20px 50px rgba(0,0,0,0.7);
  transform: rotate(-0.5deg);
  animation: dossier-drop 0.8s cubic-bezier(0.22,1,0.36,1) both;
}
@keyframes dossier-drop {
  from { opacity: 0; transform: rotate(-0.5deg) translateY(-40px) scale(0.96); }
  to   { opacity: 1; transform: rotate(-0.5deg) translateY(0) scale(1); }
}
.login-dossier::after {
  content: ''; position: absolute; top: 14px; left: 50%; transform: translateX(-50%);
  width: 26px; height: 5px; border: 1.5px solid #999; border-radius: 1px;
  background: #d0d0d0; box-shadow: 0 1px 3px rgba(0,0,0,0.25);
}
.login-stamp-cluster {
  position: absolute; top: 28px; right: 28px;
  display: flex; flex-direction: column; gap: 6px; align-items: flex-end;
}
.login-seal {
  width: 80px; height: 80px; border: 3px solid var(--ink); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Oswald', sans-serif; font-size: 7px; letter-spacing: 2px;
  color: var(--ink); text-transform: uppercase; text-align: center; line-height: 1.4;
  padding: 10px; margin: 0 auto 20px; position: relative;
  animation: seal-spin-slow 20s linear infinite;
}
@keyframes seal-spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.login-seal::before {
  content: ''; position: absolute; inset: 4px; border: 1px solid var(--ink); border-radius: 50%; opacity: 0.5;
  animation: seal-spin-slow 20s linear infinite reverse;
}
/* inner text counter-rotates so it stays readable */
.login-seal-text { animation: seal-spin-slow 20s linear infinite reverse; display: block; }

.login-agency { font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 32px; letter-spacing: 8px; color: var(--ink); text-transform: uppercase; line-height: 1; margin-bottom: 6px; }
.login-tagline { font-family: 'Courier Prime', monospace; font-size: 10px; letter-spacing: 3px; color: var(--ink-dim); text-transform: uppercase; margin-bottom: 24px; }
.login-rule { border: none; border-top: 2px solid var(--ink); margin-bottom: 20px; }
.login-desc { font-family: 'Special Elite', cursive; font-size: 14px; line-height: 1.8; color: var(--ink-dim); margin-bottom: 28px; text-align: left; }
.login-desc .field-num { font-family: 'Courier Prime', monospace; font-size: 10px; color: var(--ink-faint); }

/* ── BOOTING ── */
.booting {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 100vh; gap: 18px;
}
.boot-sheet { background: var(--paper); padding: 32px 40px; text-align: center; box-shadow: 4px 6px 20px rgba(0,0,0,0.5); }
.boot-text { font-family: 'Special Elite', cursive; font-size: 16px; letter-spacing: 4px; color: var(--ink); text-transform: uppercase; }
.boot-bar { width: 260px; height: 3px; background: var(--paper-aged); margin: 16px auto 0; overflow: hidden; }
.boot-bar-fill { height: 100%; background: var(--ink); animation: boot-progress 1.8s ease forwards; }
@keyframes boot-progress { from { width: 0%; } to { width: 100%; } }

/* ── MISC ── */
.stamp-appear { animation: stamp-splat 0.35s cubic-bezier(0.22,1,0.36,1) both; }
`;

/* ─── FLOATING PAPER FRAGMENTS ─── */
const FragmentLayer = () => {
  const fragments = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${10 + i * 11}%`,
    width: `${60 + Math.sin(i) * 40}px`,
    height: `${40 + Math.cos(i) * 25}px`,
    dur: `${16 + i * 2.5}s`,
    delay: `${-i * 3}s`,
    rot0: `${-10 + i * 3}deg`,
    rot1: `${5 - i * 2}deg`,
    rot2: `${15 + i}deg`,
    drift: `${-30 + i * 8}px`,
    drift2: `${20 - i * 5}px`,
  }));
  return (
      <div className="fragment-layer">
        {fragments.map(f => (
            <div key={f.id} className="fragment" style={{
              left: f.left, width: f.width, height: f.height,
              '--dur': f.dur, '--delay': f.delay,
              '--rot0': f.rot0, '--rot1': f.rot1, '--rot2': f.rot2,
              '--drift': f.drift, '--drift2': f.drift2,
            }} />
        ))}
      </div>
  );
};

/* ─── RED STRING DECO ─── */
const StringDeco = () => (
    <div className="string-deco">
      <svg viewBox="0 0 240 240" fill="none">
        <path d="M240 0 Q180 60 120 80 Q60 100 0 240" stroke="#b8001f" strokeWidth="1.5"/>
        <path d="M240 20 Q170 80 100 100 Q40 115 0 240" stroke="#b8001f" strokeWidth="0.8"/>
        <circle cx="175" cy="62" r="5" fill="#b8001f"/>
        <circle cx="105" cy="96" r="3" fill="#b8001f"/>
      </svg>
    </div>
);

/* ─── STAMP ─── */
const Stamp = ({ text, variant = "classified", rotate = -2, delay = 0 }) => {
  const styleMap = {
    classified: { color: "#b8001f", fontSize: 18, padding: "5px 14px", border: "3px solid #b8001f" },
    "top-secret": { color: "#b8001f", fontSize: 13, padding: "4px 10px", border: "2px solid #b8001f" },
    "eyes-only": { color: "#1a3a6e", fontSize: 10, padding: "3px 9px", border: "2px solid #1a3a6e" },
    approved: { color: "#1a5e2a", fontSize: 11, padding: "4px 10px", border: "2px solid #1a5e2a" },
  };
  const s = styleMap[variant] || styleMap.classified;
  return (
      <div className={`stamp stamp-${variant} stamp-appear`} style={{
        ...s, '--rot': `${rotate}deg`,
        animationDelay: `${delay}s`,
      }}>
        {text}
      </div>
  );
};

/* ─── TYPEWRITER HOOK ─── */
function useTypewriter(text, active, speed = 18) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!active || !text) { setDisplayed(""); setDone(false); return; }
    setDisplayed(""); setDone(false);
    let i = 0;
    const tick = () => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i < text.length) ref.current = setTimeout(tick, speed);
      else setDone(true);
    };
    ref.current = setTimeout(tick, speed);
    return () => clearTimeout(ref.current);
  }, [text, active]);

  return { displayed, done };
}

/* ─── REPORT CARD ─── */
const ReportCard = ({ model, response, rank, isFirst, docDate }) => {
  const hasText = response && response !== "COMPILING" && response !== "";
  const isCompiling = response === "COMPILING";
  const isEmpty = !response;
  const [copied, setCopied] = useState(false);

  const { displayed, done } = useTypewriter(hasText ? response : "", hasText);

  const rankLabels = ["FIRST INTERCEPT", "SECOND", "THIRD"];

  const copyText = () => {
    if (!hasText) return;
    navigator.clipboard.writeText(response).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
      <div className="report" style={{ '--card-delay': `${rank * 0.08}s` }}>
        {(isCompiling) && <div className="scan-overlay" />}

        <div className="class-sidebar">{model.classification}</div>
        <div className="report-inner">
          <div className="fold-h" style={{ top: "45%" }} />

          <div className="report-stamp-area">
            {isFirst
                ? <Stamp text="PRIORITY" variant="classified" rotate={-4} delay={0.3} />
                : rank === 1
                    ? <Stamp text="REVIEWED" variant="approved" rotate={3} delay={0.3} />
                    : rank >= 0
                        ? <Stamp text="FILED" variant="eyes-only" rotate={-2} delay={0.3} />
                        : null
            }
          </div>

          <div className="report-header">
            <div className="report-doc-num">{model.docId} · REF: MM-7741</div>
            <div className="report-source">{model.name}</div>
            {rank >= 0 && <div className="report-rank-badge">{rankLabels[rank] || `#${rank + 1}`}</div>}
          </div>

          <div className="report-body">
            <div className="report-field-key">ANALYTICAL FINDINGS</div>

            {isEmpty && (
                <div className="report-awaiting">
                  <span>AWAITING TRANSMISSION</span>
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <span style={{ display: "inline-block", background: "var(--ink)", height: 12, width: 80 }} />
                    <span style={{ display: "inline-block", background: "var(--ink)", height: 12, width: 40 }} />
                  </div>
                </div>
            )}

            {isCompiling && (
                <div className="report-transmitting">
                  <div>COMPILING INTELLIGENCE REPORT<span className="typing-cursor" /></div>
                  <div className="redact-line" />
                  <div className="redact-line" />
                  <div className="redact-line" />
                  <div className="redact-line" />
                </div>
            )}

            {hasText && (
                <div className={`report-text${!done ? " typing" : ""}`}>
                  {displayed}
                </div>
            )}

            {hasText && (
                <button className={`copy-stamp${copied ? " copied" : ""}`} onClick={copyText}>
                  {copied ? "STAMPED ✓" : "COPY"}
                </button>
            )}
          </div>

          <div className="report-footer">
            <div className="report-footer-text">STATION 7 · {docDate}</div>
            <div className="report-footer-text">{model.classification}</div>
          </div>
        </div>
      </div>
  );
};

/* ─── LIVE CLOCK ─── */
function useClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const i = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  return t;
}

/* ─── PROCESSING TICKER ─── */
const Ticker = () => {
  const items = [
    { text: "TRANSMITTING QUERY", red: false },
    { text: "SIGNAL LOCKED", red: true },
    { text: "GEMINI NODE ACTIVE", red: false },
    { text: "GROQ PROCESSING", red: false },
    { text: "OLLAMA LOCAL UNIT ONLINE", red: false },
    { text: "ENCRYPTION ACTIVE", red: true },
    { text: "STATION 7 SECURED", red: false },
    { text: "CLEARANCE LEVEL ALPHA", red: true },
    // duplicate for seamless loop
    { text: "TRANSMITTING QUERY", red: false },
    { text: "SIGNAL LOCKED", red: true },
    { text: "GEMINI NODE ACTIVE", red: false },
    { text: "GROQ PROCESSING", red: false },
    { text: "OLLAMA LOCAL UNIT ONLINE", red: false },
    { text: "ENCRYPTION ACTIVE", red: true },
    { text: "STATION 7 SECURED", red: false },
    { text: "CLEARANCE LEVEL ALPHA", red: true },
  ];
  return (
      <div className="processing-ticker">
        <div className="ticker-track">
          {items.map((item, i) => (
              <span key={i} className={`ticker-item${item.red ? " red" : ""}`}>
            {item.red ? "◆" : "·"} {item.text}
          </span>
          ))}
        </div>
      </div>
  );
};

/* ─── MAIN APP ─── */
export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [responses, setResponses] = useState({ groq: "", gemini: "", ollama: "" });
  const [responseOrder, setResponseOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const clock = useClock();

  const docDate = clock.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "2-digit" }).toUpperCase();
  const docTime = clock.toLocaleTimeString("en-US", { hour12: false });

  const models = [
    { id: "groq",   name: "GROQ · LLAMA 3",  docId: "DOC-7741-A", classification: "TOP SECRET" },
    { id: "gemini", name: "GEMINI · FLASH",   docId: "DOC-7741-B", classification: "TOP SECRET" },
    { id: "ollama", name: "OLLAMA · LOCAL",   docId: "DOC-7741-C", classification: "CLASSIFIED" },
  ];

  useEffect(() => {
    fetch(`${BACKEND}/api/me`, { credentials: "include" })
        .then(r => { if (r.status === 401) throw new Error(); return r.json(); })
        .then(d => setUser(d))
        .catch(() => setUser(null))
        .finally(() => setCheckingAuth(false));
  }, []);

  const login  = () => { window.location.href = `${BACKEND}/oauth2/authorization/google`; };
  const logout = async () => {
    await fetch(`${BACKEND}/logout`, { method: "POST", credentials: "include" });
    setUser(null); window.location.reload();
  };

  const callModel = async (model) => {
    try {
      const enc = encodeURIComponent(prompt.trim().replace(/[\r\n]+/g, " "));
      const res = await fetch(`${BACKEND}/api/${model}/${enc}`, { credentials: "include" });
      if (res.status === 401) { setUser(null); return "SESSION EXPIRED"; }
      if (!res.ok) return `ERROR ${res.status}`;
      return await res.text();
    } catch (e) { return `ERROR: ${e.message}`; }
  };

  const runModels = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponseOrder([]);
    setResponses({ groq: "COMPILING", gemini: "COMPILING", ollama: "COMPILING" });
    const promises = models.map(m =>
        callModel(m.id).then(res => {
          setResponses(p => ({ ...p, [m.id]: res }));
          setResponseOrder(p => [...p, m.id]);
        })
    );
    await Promise.all(promises);
    setLoading(false);
  };

  /* ── BOOT SCREEN ── */
  if (checkingAuth) return (
      <>
        <style>{styles}</style>
        <div className="desk-bg" />
        <div className="booting">
          <div className="boot-sheet">
            <div style={{ marginBottom: 14 }}><Stamp text="CLASSIFIED" variant="classified" rotate={-1} /></div>
            <div className="boot-text">VERIFYING CLEARANCE<span className="typing-cursor" /></div>
            <div className="boot-bar"><div className="boot-bar-fill" /></div>
          </div>
        </div>
      </>
  );

  /* ── LOGIN ── */
  if (!user) return (
      <>
        <style>{styles}</style>
        <div className="desk-bg" />
        <FragmentLayer />
        <StringDeco />
        <div className="login-page">
          <div className="login-dossier">
            <div className="login-stamp-cluster">
              <Stamp text="CLASSIFIED" variant="classified" rotate={-3} delay={0.5} />
              <Stamp text="EYES ONLY" variant="eyes-only" rotate={2} delay={0.7} />
            </div>

            <div className="login-seal">
              <span className="login-seal-text">MULTI-MODEL<br/>INTELLIGENCE<br/>DIVISION</span>
            </div>

            <div className="login-agency">ASK · US</div>
            <div className="login-tagline">Intelligence Analysis Platform · Est. 1963</div>
            <hr className="login-rule" />

            <div className="login-desc">
              <span className="field-num">FORM MM-7 / ACCESS REQUEST</span><br /><br />
              This terminal provides simultaneous access to three
              classified analytical systems. All queries are logged
              and retained per Executive Order 12958.<br /><br />
              <span className="field-num">OPERATIVE AUTHENTICATION REQUIRED.</span>
            </div>

            <button className="btn btn-file" onClick={login}>
              <span>AUTHENTICATE OPERATIVE</span>
            </button>
          </div>
        </div>
      </>
  );

  const firstId = responseOrder[0];
  const firstModel = models.find(m => m.id === firstId);

  return (
      <>
        <style>{styles}</style>
        <div className="desk-bg" />
        <FragmentLayer />
        <StringDeco />

        <div className="app">
          {/* ── HEADER ── */}
          <div className="sheet header-sheet">
            <div className="fold-h" style={{ top: "33%" }} />
            <div className="fold-h" style={{ top: "66%" }} />

            <div className="doc-top-bar">
              <div className="agency-block">
                <div className="agency-name" data-text="ASK · US">ASK · US</div>
                <div className="agency-sub">Multi-Model Intelligence Division · Station 7</div>
              </div>
              <div className="header-stamps">
                <Stamp text="TOP SECRET" variant="top-secret" rotate={-2} delay={0.3} />
                <Stamp text="CLASSIFIED" variant="classified" rotate={1.5} delay={0.5} />
                <Stamp text="EYES ONLY" variant="eyes-only" rotate={-1} delay={0.7} />
              </div>
            </div>

            <hr className="header-rule" />

            <div className="meta-table">
              <div className="meta-cell">
                <div className="meta-key">DATE</div>
                <div className="meta-val">{docDate}</div>
              </div>
              <div className="meta-cell">
                <div className="meta-key">TIME (ZULU)</div>
                <div className="meta-val live">{docTime}</div>
              </div>
              <div className="meta-cell">
                <div className="meta-key">CASE FILE</div>
                <div className="meta-val">CASE-{clock.getFullYear()}-7741</div>
              </div>
              <div className="meta-cell">
                <div className="meta-key">CLEARANCE</div>
                <div className="meta-val" style={{ color: "#b8001f", fontWeight: "bold" }}>LEVEL ALPHA</div>
              </div>
            </div>

            <div className="crew-row">
              <div className="operative-block">
                {user.picture && (
                    <img className="operative-photo" src={user.picture} alt={user.name} referrerPolicy="no-referrer" />
                )}
                <div className="operative-label">
                  <div className="operative-key">OPERATIVE ON DUTY</div>
                  <div className="operative-name">{user.name}</div>
                </div>
              </div>
              <button className="btn btn-red" onClick={logout}><span>TERMINATE SESSION</span></button>
            </div>
          </div>

          {/* ── TICKER (always visible) ── */}
          <Ticker />

          {/* ── INTEL INPUT ── */}
          <div className="sheet intel-sheet">
            <div className="fold-h" style={{ top: "50%" }} />
            <div style={{ position: "absolute", top: 18, right: 20 }}>
              <Stamp text="FILED INTELLIGENCE" variant="top-secret" rotate={1} delay={0.2} />
            </div>
            <div className="field-label" style={{ marginTop: 12 }}>INTELLIGENCE BRIEF · QUERY INPUT</div>
            <div className="lined-paper">
            <textarea
                className="typewriter-field"
                placeholder="Type your intelligence brief here. All three analytical systems will process simultaneously..."
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                disabled={loading}
                rows={5}
            />
            </div>
            <div className="file-footer">
              <div className="char-count">{prompt.length} characters filed</div>
              <button className="btn btn-file" onClick={runModels} disabled={loading || !prompt.trim()}>
                <span>{loading ? "PROCESSING..." : "FILE INTELLIGENCE"}</span>
              </button>
            </div>
          </div>

          {/* ── FIRST INTERCEPT BANNER ── */}
          {responseOrder.length > 0 && firstModel && (
              <div className="intercept-banner">
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div className="intercept-label">FIRST INTERCEPT RECEIVED</div>
                  <div className="intercept-name">{firstModel.name}</div>
                </div>
                <div className="intercept-seal">PRIORITY</div>
              </div>
          )}

          {/* ── REPORTS ── */}
          <div className="report-grid">
            {models.map((model) => {
              const rank = responseOrder.indexOf(model.id);
              const isFirst = responseOrder[0] === model.id;
              return (
                  <ReportCard
                      key={model.id}
                      model={model}
                      response={responses[model.id]}
                      rank={rank}
                      isFirst={isFirst}
                      docDate={docDate}
                  />
              );
            })}
          </div>
        </div>
      </>
  );
}
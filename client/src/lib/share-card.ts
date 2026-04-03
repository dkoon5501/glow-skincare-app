/**
 * Generate shareable image cards for social media (Instagram/TikTok stories, Twitter, etc.)
 * Uses Canvas API — no external dependencies.
 */

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1920; // 9:16 for stories
const TEAL = "#0d9488";
const TEAL_LIGHT = "#ccfbf1";
const DARK = "#1a1a1a";
const MUTED = "#6b7280";
const BG = "#fafaf8";
const WHITE = "#ffffff";

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawLogo(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  const scale = size / 32;
  // Outer ring
  ctx.beginPath();
  ctx.arc(cx, cy, 13.5 * scale, 0, Math.PI * 2);
  ctx.strokeStyle = TEAL;
  ctx.lineWidth = 3 * scale;
  ctx.stroke();
  // Middle ring
  ctx.beginPath();
  ctx.arc(cx, cy, 8.5 * scale, 0, Math.PI * 2);
  ctx.strokeStyle = TEAL;
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 2.5 * scale;
  ctx.stroke();
  ctx.globalAlpha = 1;
  // Inner circle
  ctx.beginPath();
  ctx.arc(cx, cy, 3.5 * scale, 0, Math.PI * 2);
  ctx.fillStyle = TEAL;
  ctx.fill();
}

function drawScoreRing(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, radius: number, score: number, strokeWidth: number
) {
  const color = score >= 8 ? TEAL : score >= 6 ? TEAL : score >= 4 ? "#d97706" : "#dc2626";
  // Background ring
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = strokeWidth;
  ctx.stroke();
  // Score arc
  const progress = (score / 10) * Math.PI * 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + progress);
  ctx.strokeStyle = color;
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.lineCap = "butt";
  // Score text
  ctx.fillStyle = color;
  ctx.font = `bold ${radius * 0.9}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${score}`, cx, cy);
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// ─── Quiz Results Card ───

export interface QuizCardData {
  baumannCode: string;
  skinType: string;
  sensitivity: string;
  primaryConcern: string;
  amProducts: { name: string; brand: string; category: string }[];
  pmProducts: { name: string; brand: string; category: string }[];
}

export function generateQuizCard(data: QuizCardData): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = CARD_WIDTH;
    canvas.height = CARD_HEIGHT;
    const ctx = canvas.getContext("2d")!;

    // Background
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

    // Top gradient accent
    const grad = ctx.createLinearGradient(0, 0, CARD_WIDTH, 300);
    grad.addColorStop(0, "#fef3ec");
    grad.addColorStop(1, "#f0fdfa");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CARD_WIDTH, 350);

    // Logo + brand
    drawLogo(ctx, 120, 100, 60);
    ctx.fillStyle = TEAL;
    ctx.font = "bold 48px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Glow", 170, 115);

    // "My Skin Type" header
    ctx.fillStyle = DARK;
    ctx.font = "bold 64px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("My Skin Type", CARD_WIDTH / 2, 260);

    // Baumann code badge
    const codeWidth = ctx.measureText(data.baumannCode).width + 80;
    ctx.fillStyle = TEAL;
    roundRect(ctx, (CARD_WIDTH - codeWidth) / 2, 300, codeWidth, 80, 40);
    ctx.fill();
    ctx.fillStyle = WHITE;
    ctx.font = "bold 44px system-ui, -apple-system, sans-serif";
    ctx.fillText(data.baumannCode, CARD_WIDTH / 2, 348);

    // Skin profile details
    let y = 440;
    ctx.fillStyle = MUTED;
    ctx.font = "400 32px system-ui, -apple-system, sans-serif";
    ctx.fillText(`${data.skinType} · ${data.sensitivity}`, CARD_WIDTH / 2, y);
    y += 50;
    ctx.fillText(`Primary Concern: ${data.primaryConcern}`, CARD_WIDTH / 2, y);

    // Divider
    y += 60;
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, y);
    ctx.lineTo(CARD_WIDTH - 100, y);
    ctx.stroke();

    // AM Routine
    y += 50;
    ctx.fillStyle = TEAL;
    ctx.font = "bold 36px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("☀️  AM Routine", 100, y);
    y += 15;

    ctx.font = "400 28px system-ui, -apple-system, sans-serif";
    for (const p of data.amProducts.slice(0, 5)) {
      y += 48;
      ctx.fillStyle = DARK;
      ctx.fillText(`${p.brand} ${p.name}`, 130, y);
      // Category label
      const catLabel = p.category.charAt(0).toUpperCase() + p.category.slice(1);
      ctx.fillStyle = MUTED;
      ctx.font = "400 24px system-ui, -apple-system, sans-serif";
      ctx.fillText(catLabel, 130, y + 32);
      ctx.font = "400 28px system-ui, -apple-system, sans-serif";
      y += 30;
    }

    // PM Routine
    y += 40;
    ctx.fillStyle = TEAL;
    ctx.font = "bold 36px system-ui, -apple-system, sans-serif";
    ctx.fillText("🌙  PM Routine", 100, y);
    y += 15;

    ctx.font = "400 28px system-ui, -apple-system, sans-serif";
    for (const p of data.pmProducts.slice(0, 6)) {
      y += 48;
      ctx.fillStyle = DARK;
      ctx.fillText(`${p.brand} ${p.name}`, 130, y);
      const catLabel = p.category.charAt(0).toUpperCase() + p.category.slice(1);
      ctx.fillStyle = MUTED;
      ctx.font = "400 24px system-ui, -apple-system, sans-serif";
      ctx.fillText(catLabel, 130, y + 32);
      ctx.font = "400 28px system-ui, -apple-system, sans-serif";
      y += 30;
    }

    // Footer
    const footerY = CARD_HEIGHT - 140;
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, footerY);
    ctx.lineTo(CARD_WIDTH - 100, footerY);
    ctx.stroke();

    ctx.fillStyle = TEAL;
    ctx.font = "600 32px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("buildmyroutine.app", CARD_WIDTH / 2, footerY + 50);
    ctx.fillStyle = MUTED;
    ctx.font = "400 26px system-ui, -apple-system, sans-serif";
    ctx.fillText("Dermatologist-guided skincare, personalized to you", CARD_WIDTH / 2, footerY + 95);

    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}

// ─── Rate My Routine Card ───

export interface RateCardData {
  overallScore: number;
  baumannCode: string;
  ratings: {
    brand: string;
    name: string;
    category: string;
    score: number;
    verdict: "great" | "good" | "fair" | "poor";
  }[];
  missingSteps: number;
}

export function generateRateCard(data: RateCardData): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = CARD_WIDTH;
    canvas.height = CARD_HEIGHT;
    const ctx = canvas.getContext("2d")!;

    // Background
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

    // Top gradient
    const grad = ctx.createLinearGradient(0, 0, CARD_WIDTH, 300);
    grad.addColorStop(0, "#fef3ec");
    grad.addColorStop(1, "#f0fdfa");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CARD_WIDTH, 400);

    // Logo + brand
    drawLogo(ctx, 120, 100, 60);
    ctx.fillStyle = TEAL;
    ctx.font = "bold 48px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Glow", 170, 115);

    // "My Routine Score" header
    ctx.fillStyle = DARK;
    ctx.font = "bold 56px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("My Routine Score", CARD_WIDTH / 2, 230);

    // Baumann badge
    ctx.fillStyle = MUTED;
    ctx.font = "400 30px system-ui, -apple-system, sans-serif";
    ctx.fillText(`${data.baumannCode} Skin Type`, CARD_WIDTH / 2, 280);

    // Big score ring
    drawScoreRing(ctx, CARD_WIDTH / 2, 440, 100, data.overallScore, 14);

    // "/10" label
    ctx.fillStyle = MUTED;
    ctx.font = "400 28px system-ui, -apple-system, sans-serif";
    ctx.fillText("out of 10", CARD_WIDTH / 2, 560);

    // Score description
    ctx.fillStyle = DARK;
    ctx.font = "400 30px system-ui, -apple-system, sans-serif";
    const desc = data.overallScore >= 8
      ? "Great match for my skin type!"
      : data.overallScore >= 6
      ? "Solid routine with room to improve"
      : data.overallScore >= 4
      ? "Some products could be better matched"
      : "Time for a routine overhaul";
    ctx.fillText(desc, CARD_WIDTH / 2, 620);

    // Divider
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 670);
    ctx.lineTo(CARD_WIDTH - 100, 670);
    ctx.stroke();

    // Product ratings
    let y = 720;
    ctx.textAlign = "left";

    for (const r of data.ratings.slice(0, 8)) {
      // Product name
      ctx.fillStyle = DARK;
      ctx.font = "500 28px system-ui, -apple-system, sans-serif";
      const displayName = `${r.brand} ${r.name}`;
      const truncated = displayName.length > 35 ? displayName.slice(0, 32) + "..." : displayName;
      ctx.fillText(truncated, 100, y);

      // Category
      ctx.fillStyle = MUTED;
      ctx.font = "400 22px system-ui, -apple-system, sans-serif";
      ctx.fillText(r.category.charAt(0).toUpperCase() + r.category.slice(1), 100, y + 30);

      // Score badge on right
      const badgeColor = r.verdict === "great" ? TEAL
        : r.verdict === "good" ? "#0f766e"
        : r.verdict === "fair" ? "#d97706"
        : "#dc2626";
      const badgeLabel = r.verdict === "great" ? "Great"
        : r.verdict === "good" ? "Good"
        : r.verdict === "fair" ? "Fair"
        : "Poor";
      
      ctx.fillStyle = badgeColor;
      ctx.globalAlpha = 0.12;
      roundRect(ctx, CARD_WIDTH - 250, y - 20, 150, 55, 27);
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.fillStyle = badgeColor;
      ctx.font = "600 24px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${r.score}/10 ${badgeLabel}`, CARD_WIDTH - 175, y + 10);
      ctx.textAlign = "left";

      y += 90;
    }

    // Missing steps note
    if (data.missingSteps > 0) {
      y += 20;
      ctx.fillStyle = "#d97706";
      ctx.font = "400 26px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        `⚠️ ${data.missingSteps} missing step${data.missingSteps > 1 ? "s" : ""} detected`,
        CARD_WIDTH / 2, y
      );
    }

    // Footer
    const footerY = CARD_HEIGHT - 140;
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, footerY);
    ctx.lineTo(CARD_WIDTH - 100, footerY);
    ctx.stroke();

    ctx.fillStyle = TEAL;
    ctx.font = "600 32px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("buildmyroutine.app", CARD_WIDTH / 2, footerY + 50);
    ctx.fillStyle = MUTED;
    ctx.font = "400 26px system-ui, -apple-system, sans-serif";
    ctx.fillText("Rate your skincare routine — free at buildmyroutine.app", CARD_WIDTH / 2, footerY + 95);

    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}

// ─── Share helpers ───

export async function shareCardImage(blob: Blob, title: string): Promise<"shared" | "saved" | "failed"> {
  const file = new File([blob], "glow-results.png", { type: "image/png" });

  // Try native share (mobile — Instagram, TikTok, iMessage, etc.)
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        title,
        text: "Check out my skincare routine from Glow! buildmyroutine.app",
        files: [file],
      });
      return "shared";
    } catch {
      // User cancelled, fall through to download
    }
  }

  // Fallback: download the image
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "glow-results.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return "saved";
}

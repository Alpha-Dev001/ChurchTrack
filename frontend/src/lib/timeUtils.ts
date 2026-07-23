/** Parse times like "09:00 AM", "9:00AM", "08:00", "20:00" into minutes from midnight. */
export function parseTimeToMinutes(raw: string): number | null {
  const cleaned = raw.trim().replace(/\s+/g, ' ');
  if (!cleaned) return null;

  const ampm = cleaned.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    let hours = parseInt(ampm[1], 10);
    const minutes = parseInt(ampm[2], 10);
    const period = ampm[3].toUpperCase();
    if (period === 'AM') {
      if (hours === 12) hours = 0;
    } else if (hours !== 12) {
      hours += 12;
    }
    if (hours > 23 || minutes > 59) return null;
    return hours * 60 + minutes;
  }

  const h24 = cleaned.match(/^(\d{1,2}):(\d{2})$/);
  if (h24) {
    const hours = parseInt(h24[1], 10);
    const minutes = parseInt(h24[2], 10);
    if (hours > 23 || minutes > 59) return null;
    return hours * 60 + minutes;
  }

  return null;
}

/** Format minutes from midnight as "09:00 AM". */
export function formatMinutesToDisplay(totalMinutes: number): string {
  const clamped = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  let hours = Math.floor(clamped / 60);
  const minutes = clamped % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
}

/** Format as HTML time input value "HH:MM". */
export function formatMinutesToInput(totalMinutes: number): string {
  const clamped = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = Math.floor(clamped / 60);
  const minutes = clamped % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export interface WorkingHoursRange {
  openMinutes: number;
  closeMinutes: number;
  label: string;
}

/** Parse free-text working hours like "09:00 AM - 08:00 PM". Defaults 08:00–20:00. */
export function parseWorkingHours(workingHours?: string): WorkingHoursRange {
  const fallback: WorkingHoursRange = {
    openMinutes: 8 * 60,
    closeMinutes: 20 * 60,
    label: '08:00 AM - 08:00 PM',
  };

  if (!workingHours?.trim()) return fallback;

  const parts = workingHours.split(/\s*[-–—]\s*/);
  if (parts.length < 2) return { ...fallback, label: workingHours };

  const open = parseTimeToMinutes(parts[0]);
  const close = parseTimeToMinutes(parts[1]);
  if (open === null || close === null || close <= open) {
    return { ...fallback, label: workingHours };
  }

  return { openMinutes: open, closeMinutes: close, label: workingHours };
}

/** Build selectable times every `stepMinutes` within [open, close]. */
export function buildTimeOptions(
  openMinutes: number,
  closeMinutes: number,
  stepMinutes = 30,
  inclusiveEnd = true
): number[] {
  const options: number[] = [];
  const last = inclusiveEnd ? closeMinutes : closeMinutes - stepMinutes;
  for (let t = openMinutes; t <= last; t += stepMinutes) {
    options.push(t);
  }
  return options;
}

export function formatTimeSlot(startMinutes: number, endMinutes: number): string {
  return `${formatMinutesToDisplay(startMinutes)} - ${formatMinutesToDisplay(endMinutes)}`;
}

export function formatDurationLabel(startMinutes: number, endMinutes: number, lang = 'EN'): string {
  const hours = (endMinutes - startMinutes) / 60;
  const rounded = Math.round(hours * 10) / 10;
  const isWhole = Number.isInteger(rounded);

  if (lang === 'FR') {
    if (isWhole) return rounded === 1 ? '1 heure' : `${rounded} heures`;
    return `${rounded} heures`;
  }
  if (lang === 'RW') {
    if (isWhole) return rounded === 1 ? 'Isaha 1' : `Amasaha ${rounded}`;
    return `Amasaha ${rounded}`;
  }
  if (isWhole) return rounded === 1 ? '1 Hour' : `${rounded} Hours`;
  return `${rounded} Hours`;
}

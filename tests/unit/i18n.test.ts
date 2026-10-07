import { describe, expect, it } from 'vitest';
import { nb } from '../../src/lib/i18n/nb';

describe('Norwegian translations', () => {
	it('defines the På Jobb product identity', () => {
		expect(nb.app.name).toBe('På Jobb');
		expect(nb.app.tagline).toBe('Fra befaring til ferdig jobb.');
	});

	it('defines the offline sync states', () => {
		expect(nb.sync.local).toBe('Lagret på telefonen');
		expect(nb.sync.waiting).toBe('Venter på nett');
		expect(nb.sync.backedUp).toBe('Sikkerhetskopiert');
	});
});
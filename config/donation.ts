/**
 * config/donation.ts — Donation details (owner-editable).
 *
 * ⚠️ PLACEHOLDER VALUES. Replace with the mosque's real bank account and QRIS.
 *  - qrisImage: path under /public. A vector placeholder ships at
 *    public/images/qris.svg. Drop the real QRIS image into public/images/
 *    (PNG or SVG) and update the path below to swap it.
 *  - Never commit anything resembling live payment credentials beyond the plain
 *    account number the owner provides.
 */

export interface DonationConfig {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  /** Path to the QRIS image under /public. */
  qrisImage: string;
  /** Set false once real details are filled in to hide the "placeholder" notice. */
  isPlaceholder: boolean;
}

export const donationConfig: DonationConfig = {
  bankName: 'Bank Syariah Indonesia (BSI)',
  accountNumber: '1234567890',
  accountHolder: 'Yayasan Al-Hunafa',
  qrisImage: '/images/qris.svg',
  isPlaceholder: true,
};

import mongoose from 'mongoose';
const EntrySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  obd: { type: Number, default: 0 },
  safety: { type: Number, default: 0 },
  reinspection: { type: Number, default: 0 }, // always free, for record only
  wiper_qty: { type: Number, default: 0 },
  wiper_cash: { type: Number, default: 0 },
  wiper_card: { type: Number, default: 0 },
  oil_qty: { type: Number, default: 0 },
  oil_cash: { type: Number, default: 0 },
  oil_card: { type: Number, default: 0 },
  gascap_qty: { type: Number, default: 0 },
  gascap_cash: { type: Number, default: 0 },
  gascap_card: { type: Number, default: 0 },
  labor_total: { type: Number, default: 0 },
  notes: String
}, { timestamps: true });
export default mongoose.model('Entry', EntrySchema);

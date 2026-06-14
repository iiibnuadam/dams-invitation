import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInvitation extends Document {
  slug: string;
  hero: {
    heading: string;
    names: string;
    date: string;
    image: string;
    showArabicQuote?: boolean;
    quote: {
      arabic: string;
      translation: string;
      source: string;
    };
  };
  overlay: {
    backgroundImage?: string;
    coupleImage?: string;
  };
  mempelai: {
    pria: {
      namaLengkap: string;
      putraDari: string;
      fotoUrl: string;
      putraKe?: string;
      asal?: string;
    };
    wanita: {
      namaLengkap: string;
      putriDari: string;
      fotoUrl: string;
      putriKe?: string;
      asal?: string;
    };
  };
  acara: {
    title: string;
    tanggal: Date;
    tanggalEnd?: Date;
    jam?: string;
    showJam?: boolean;
    sampaiSelesai?: boolean;
    tempat: string;
    alamat?: string;
    maps: string;
    enabled: boolean;
    schedules?: {
      name: string;
      jam: string;
    }[];
  }[];
  weddingStory: {
    year: string;
    title: string;
    content: string;
    enabled: boolean;
  }[];
  paymentMethods: {
    bank?: string;
    number?: string;
    holder?: string;
    name?: string;
    address?: string;
    image?: string; // For QRIS
    type: "bank" | "address" | "qris";
    enabled: boolean;
    bgColor?: string;
    textColor?: string;
  }[];
  comments: {
    name: string;
    message: string;
    timestamp: Date;
    isVisible: boolean;
    isFavorite: boolean;
  }[];
  gallery: { url: string; focusY?: number; cols?: number; rows?: number }[];
  mediaLibrary: string[];
  isLocked: boolean;
  password?: string;
  showGalleryPopup?: boolean;
  musicUrl?: string;
  musicTracks?: { name: string; url: string }[];
}

const InvitationSchema: Schema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    hero: {
      heading: { type: String, required: true },
      names: { type: String, required: true },
      date: { type: String, required: true },
      image: { type: String },
      showArabicQuote: { type: Boolean, default: true },
      quote: {
        arabic: String,
        translation: String,
        source: String,
      },
    },
    overlay: {
      backgroundImage: { type: String },
      coupleImage: { type: String },
    },
    mempelai: {
      pria: {
        namaLengkap: String,
        putraDari: String,
        fotoUrl: String,
        putraKe: String,
        asal: String,
      },
      wanita: {
        namaLengkap: String,
        putriDari: String,
        fotoUrl: String,
        putriKe: String,
        asal: String,
      },
    },
    acara: [
      {
        title: { type: String, required: true },
        tanggal: { type: Date, required: true },
        tanggalEnd: { type: Date },
        jam: { type: String },
        showJam: { type: Boolean, default: true },
        sampaiSelesai: { type: Boolean, default: false },
        tempat: { type: String, required: true },
        alamat: { type: String },
        maps: { type: String, required: true },
        enabled: { type: Boolean, default: true },
        schedules: {
          type: [
            {
              name: String,
              jam: String,
            }
          ],
          default: []
        },
      },
    ],
    weddingStory: [
      {
        year: String,
        title: String,
        content: String,
        enabled: { type: Boolean, default: true },
      },
    ],
    paymentMethods: [
      {
        bank: String,
        number: String,
        holder: String,
        name: String,
        address: String,
        image: String,
        type: { type: String, enum: ["bank", "address", "qris"], required: true },
        enabled: { type: Boolean, default: true },
        bgColor: String,
        textColor: String,
      },
    ],
    comments: [
      {
        name: String,
        message: String,
        timestamp: { type: Date, default: Date.now },
        isVisible: { type: Boolean, default: true },
        isFavorite: { type: Boolean, default: false },
      },
    ],
    gallery: [
      {
        url: { type: String, required: true },
        focusY: { type: Number, default: 50 },
        cols: { type: Number, default: 1 },
        rows: { type: Number, default: 1 }
      }
    ],
    mediaLibrary: [String],
    isLocked: { type: Boolean, default: false },
    password: { type: String },
    showGalleryPopup: { type: Boolean, default: true },
    musicUrl: { type: String, default: "" },
    musicTracks: { type: [{ name: String, url: String }], default: [] },
  },
  { timestamps: true }
);

// Prevent Mongoose overwrite model error
if (mongoose.models.Invitation) {
  delete mongoose.models.Invitation;
}

const Invitation: Model<IInvitation> = mongoose.model<IInvitation>("Invitation", InvitationSchema);

export default Invitation;

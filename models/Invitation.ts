import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInvitation extends Document {
  slug: string;
  hero: {
    heading: string;
    names: string;
    date: string;
    image: string;
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
    };
    wanita: {
      namaLengkap: string;
      putriDari: string;
      fotoUrl: string;
    };
  };
  acara: {
    title: string;
    tanggal: Date;
    jam: string;
    tempat: string;
    maps: string;
    enabled: boolean;
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
  }[];
  comments: {
    name: string;
    message: string;
    timestamp: Date;
    isVisible: boolean;
    isFavorite: boolean;
  }[];
  gallery: string[];
  mediaLibrary: string[];
}

const InvitationSchema: Schema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    hero: {
      heading: { type: String, required: true },
      names: { type: String, required: true },
      date: { type: String, required: true },
      image: { type: String },
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
      },
      wanita: {
        namaLengkap: String,
        putriDari: String,
        fotoUrl: String,
      },
    },
    acara: [
      {
        title: { type: String, required: true },
        tanggal: { type: Date, required: true },
        jam: { type: String, required: true },
        tempat: { type: String, required: true },
        maps: { type: String, required: true },
        enabled: { type: Boolean, default: true },
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
    gallery: [String],
    mediaLibrary: [String],
  },
  { timestamps: true }
);

// Prevent Mongoose overwrite model error
if (mongoose.models.Invitation) {
  delete mongoose.models.Invitation;
}

const Invitation: Model<IInvitation> = mongoose.model<IInvitation>("Invitation", InvitationSchema);

export default Invitation;

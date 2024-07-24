import { type PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";

export const psiBlobUploadClient = async (name: string, data: string) => {
  const newBlob: PutBlobResult = await upload(name, data, {
    access: "public",
    handleUploadUrl: "/api/psiBlobUploadServer",
  });

  return newBlob.url;
};

export const serializeData = (data: any) => {
  return JSON.stringify(data, (key, value) => {
    if (typeof value === "bigint") {
      return value.toString() + "n";
    }
    if (Array.isArray(value)) {
      return value.map((item) => {
        if (typeof item === "bigint") {
          return item.toString() + "n";
        }
        return item;
      });
    }
    return value;
  });
};

export const deserializeData = (data: string) => {
  return JSON.parse(data, (key, value) => {
    if (typeof value === "string" && /^\d+n$/.test(value)) {
      return BigInt(value.slice(0, -1)); // Remove the 'n' at the end and convert to BigInt
    }
    if (Array.isArray(value)) {
      return value.map((item) => {
        if (typeof item === "string" && /^\d+bn$/.test(item)) {
          return BigInt(item.slice(0, -1)); // Remove the 'n' at the end and convert to BigInt
        }
        return item;
      });
    }
    return value;
  });
};

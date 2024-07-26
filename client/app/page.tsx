"use client";

import { ProfileModal } from "@/components/modals/ProfileModal";
import { Button } from "@/components/ui/Button";
import {
  HiringProfile,
  Profile,
  getHiringProfile,
  getProfile,
} from "@/lib/localStorage";
import init, {
  i_hiring_client_dec_share,
  i_hiring_client_encrypt,
} from "@/lib/pz/hiring/pz_web";
import { supabase } from "@/lib/realtime";
import {
  deserializeData,
  psiBlobUploadClient,
  serializeData,
} from "@/lib/upload";
import { sha256 } from "js-sha256";
import { useEffect, useState } from "react";

enum UserQueryState {
  NOT_USER,
  NOT_STARTED,
  USER_SENT_COLLECTIVE_SHARE,
  ADMIN_SENT_ENCRYPTED_DATA,
  USER_SENT_DECRYPTION_SHARE,
  ADMIN_SENT_DECRYPTION_SHARE,
  COMPLETE,
}

// Assuming the Rocket server endpoint for computation is POST /compute
async function computeOnServer(jc_0_fhe: any, jc_1_fhe: any, seed: bigint) {
  try {
    console.log(JSON.stringify({ jc_0_fhe, jc_1_fhe, seed }));
    const response = await fetch("http://localhost:8000/compute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jc_0_fhe, jc_1_fhe, seed }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch:", error);
  }
}

export default function Home() {
  const [profile, setProfile] = useState<Profile>({
    name: "Default",
    role: "User",
    room: "",
    key: "",
  });
  const [hiringProfile, setHiringProfile] = useState<HiringProfile | undefined>(
    undefined
  );

  const [color, setColor] = useState<string>("#000000");
  const [broadcastEvent, setBroadcastEvent] = useState<any>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getColor = (input: string): string => {
    let color = parseInt(sha256(profile.name + "0"), 16) % 254;
    const color_16_1 = color.toString(16);
    color = parseInt(sha256(profile.name + "1"), 16) % 254;
    const color_16_2 = color.toString(16);
    color = parseInt(sha256(profile.name + "2"), 16) % 254;
    const color_16_3 = color.toString(16);
    return "#" + color_16_1 + color_16_2 + color_16_3;
  };

  useEffect(() => {
    async function loadData() {
      await init();
      setProfile(getProfile());
      setHiringProfile(getHiringProfile());
    }

    loadData();
  }, []);

  // update profile picture and status if name changes
  useEffect(() => {
    setColor(getColor(profile.name));
  }, [profile]);

  // join new channel if room changes
  useEffect(() => {
    async function setupChannel() {
      if (profile.room !== "") {
        const channel = supabase.channel(profile.room, {
          config: {
            presence: { key: profile.name },
          },
        });

        channel
          .on("presence", { event: "sync" }, () => {})
          .on("broadcast", { event: "message" }, (event) => {
            setBroadcastEvent(event);
          })
          .subscribe(async (status) => {
            if (status === "SUBSCRIBED") {
              await channel.track({
                user: profile.name,
              });
            }
          });

        // send initial collective_key_share if user has set up hiringProfile
        if (profile.role === "User" && hiringProfile) {
          let user_key = deserializeData(profile.key);
          console.log(user_key);
          let collective_key_share = user_key.collective_key_share;
          const messageLink = await psiBlobUploadClient(
            "user_collective_share",
            serializeData(collective_key_share)
          );
          supabase.channel(profile.room).send({
            type: "broadcast",
            event: "message",
            payload: {
              state: UserQueryState.USER_SENT_COLLECTIVE_SHARE,
              from: profile.name,
              to: "admin",
              data: messageLink,
            },
          });
        }
      }
    }
    setupChannel();
  }, [profile.room]);

  useEffect(() => {
    async function handleBroadcastEvent() {
      if (!broadcastEvent || !hiringProfile) return;
      const { payload } = broadcastEvent;

      console.log(payload);

      if (profile.role === "Admin") {
        if (payload.state === UserQueryState.USER_SENT_COLLECTIVE_SHARE) {
          let admin_key = deserializeData(profile.key);
          let collective_key_share_0 = admin_key.collective_key_share;
          let collective_key_share_1 = deserializeData(
            await fetch(payload.data).then((res) => res.text())
          );

          console.time("admin_encryption");
          let jc_0_fhe = await i_hiring_client_encrypt(
            0,
            admin_key,
            [collective_key_share_0, collective_key_share_1],
            true,
            hiringProfile.recruiter,
            hiringProfile.salary / 10000,
            new Uint8Array(
              hiringProfile.criteria.map((criterion) => (criterion ? 1 : 0))
            )
          );
          console.timeEnd("admin_encryption");

          const messageLink = await psiBlobUploadClient(
            "admin_encrypted_data",
            serializeData({
              jc_0_fhe,
              collective_key_share_0,
            })
          );

          supabase.channel(profile.room).send({
            type: "broadcast",
            event: "message",
            payload: {
              state: UserQueryState.ADMIN_SENT_ENCRYPTED_DATA,
              from: profile.name,
              to: payload.from,
              data: messageLink,
            },
          });
        }
      } else {
        if (
          payload.state === UserQueryState.ADMIN_SENT_ENCRYPTED_DATA &&
          payload.to === profile.name
        ) {
          let admin_data = deserializeData(
            await fetch(payload.data).then((res) => res.text())
          );
          let jc_0_fhe = admin_data.jc_0_fhe;
          let collective_key_share_0 = admin_data.collective_key_share_0;
          let user_key = deserializeData(profile.key);
          let collective_key_share_1 = user_key.collective_key_share;
          let jc_1_fhe = i_hiring_client_encrypt(
            1,
            user_key,
            [collective_key_share_0, collective_key_share_1],
            false,
            hiringProfile.recruiter,
            hiringProfile.salary / 10000,
            new Uint8Array(
              hiringProfile.criteria.map((criterion) => (criterion ? 1 : 0))
            )
          );

          let res_fhe;
          while (true) {
            res_fhe = await computeOnServer(
              jc_0_fhe,
              jc_1_fhe,
              BigInt("0x" + sha256(profile.room)) & BigInt("0xFFFFFFFFFFFFFFFF")
            );
            if (
              !window.confirm(
                "Continue computation? Click OK to proceed or Cancel to stop."
              )
            ) {
              break;
            }
          }

          let res_fhe_share_1 = i_hiring_client_dec_share(user_key, res_fhe);

          const messageLink = await psiBlobUploadClient(
            "admin_encrypted_data",
            serializeData({
              res_fhe,
              res_fhe_share_1,
            })
          );

          supabase.channel(profile.room).send({
            type: "broadcast",
            event: "message",
            payload: {
              state: UserQueryState.USER_SENT_DECRYPTION_SHARE,
              from: profile.name,
              to: "admin",
              data: messageLink,
            },
          });
        } else if (
          payload.state === UserQueryState.ADMIN_SENT_DECRYPTION_SHARE
        ) {
        }
      }
    }

    handleBroadcastEvent();
  }, [broadcastEvent]);

  return (
    <>
      <ProfileModal
        profile={profile}
        setProfile={setProfile}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <div className="flex flex-col pt-4">
        <div className="flex gap-6 mb-6">
          <div>
            <div
              className={`relative overflow-hidden w-32 h-32`}
              style={{ backgroundColor: color }}
            ></div>
          </div>

          <div className="flex flex-col gap-4 justify-center">
            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl leading-6 tracking-[-0.2px] text-iron-950 font-bold">
                  {profile?.name}
                </h2>
              </div>
              {profile.room !== "" && (
                <h3 className="text-sm leading-5 text-iron-950">
                  <b>Room:</b> {profile?.room}
                </h3>
              )}
              <h3 className="text-sm leading-5 text-iron-950">
                <b>Role:</b> {profile?.role === "User" ? "User" : "Admin"}
              </h3>
            </div>
            <Button
              size="small"
              variant="primary"
              onClick={() => setIsModalOpen(true)}
            >
              Update profile
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

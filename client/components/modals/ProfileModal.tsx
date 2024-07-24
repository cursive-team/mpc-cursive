import { Profile, saveProfile } from "@/lib/localStorage";
import { Input } from "../ui/Input";
import { Modal } from "./Modal";
import { Dispatch, SetStateAction } from "react";
import { InputWrapper } from "../ui/InputWrapper";
import { Radio } from "../ui/Radio";
import { Button } from "../ui/Button";
import { i_hiring_client_setup, i_hiring_init } from "@/lib/pz/hiring/pz_web";
import { sha256 } from "js-sha256";
import { serializeData } from "@/lib/upload";

export function ProfileModal({
  isModalOpen,
  setIsModalOpen,
  profile,
  setProfile,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  profile: Profile;
  setProfile: Dispatch<SetStateAction<Profile>>;
}) {
  return (
    <Modal
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      onClose={() => setIsModalOpen(false)}
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl leading-6 tracking-[-0.2px] text-black font-bold">
              Update profile
            </h2>
          </div>
          <Input
            label="Name"
            placeholder="Enter name"
            className="col-span-3 w-full"
            name="name"
            value={profile.name}
            onChange={(change) =>
              setProfile((prev) => ({
                ...prev,
                name: change.target.value,
              }))
            }
          />
          <Input
            label="Room"
            placeholder="Enter room"
            className="col-span-3 w-full"
            name="room"
            value={profile.room}
            onChange={(change) =>
              setProfile((prev) => ({
                ...prev,
                room: change.target.value,
              }))
            }
          />
          <div className="flex flex-col gap-2 text-black">
            <InputWrapper label="Role">
              <Radio
                id="radioUser"
                label="User"
                value="User"
                checked={profile.role === "User"}
                onClick={() => {
                  setProfile((prev) => ({
                    ...prev,
                    role: "User",
                  }));
                }}
              />
              <Radio
                id="radioAdmin"
                label="Admin"
                value="Admin"
                checked={profile.role === "Admin"}
                onClick={() => {
                  setProfile((prev) => ({
                    ...prev,
                    role: "Admin",
                  }));
                }}
              />
            </InputWrapper>
          </div>
        </div>
        <Button
          variant="tertiary"
          onClick={() => {
            let newProfile = profile;
            if (profile.key === "") {
              i_hiring_init(
                BigInt("0x" + sha256(profile.room)) &
                  BigInt("0xFFFFFFFFFFFFFFFF")
              );
              let client_keys = i_hiring_client_setup();
              let client_keys_serialized = serializeData(client_keys);
              newProfile = {
                ...profile,
                key: client_keys_serialized,
              };
              setProfile(newProfile);
              1;
            }
            saveProfile(newProfile);
            setIsModalOpen(false);
          }}
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
}

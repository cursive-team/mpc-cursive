"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { InputWrapper } from "../ui/InputWrapper";
import { Radio } from "../ui/Radio";
import { Modal, ModalProps } from "./Modal";
import { HiringProfile, saveHiringProfile } from "@/lib/localStorage";
import { useRouter } from "next/navigation";

export default function RecruitingModal({
  isOpen,
  setIsOpen,
  children,
  closable = true, // show close button when active
  onClose, // run when modal close
  withBackButton = false, // show back button when active
}: ModalProps) {
  const router = useRouter();

  const [hiringProfile, setHiringProfile] = useState<HiringProfile>({
    recruiter: false,
    criteria: [false, false, false],
    salary: 0,
    encryption: "",
  });
  const [salaryError, setSalaryError] = useState<boolean>(false);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} onClose={onClose}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl leading-6 tracking-[-0.2px] text-black font-bold">
              💼 Recruiting query
            </h2>
            <h3 className="text-sm text-black">
              Find jobs or find recruits that match your criteria and salary
              needs.
            </h3>
          </div>
          <div className="flex flex-col gap-2 text-black">
            <InputWrapper label="Role">
              <Radio
                id="radioSearcher"
                label="Job searcher"
                checked={!hiringProfile.recruiter}
                onClick={() => {
                  setHiringProfile((prev) => ({
                    ...prev,
                    recruiter: false,
                  }));
                }}
              />
              <Radio
                id="radioRecruiter"
                label="Recruiter"
                checked={hiringProfile.recruiter}
                onClick={() => {
                  setHiringProfile((prev) => ({
                    ...prev,
                    recruiter: true,
                  }));
                }}
              />
            </InputWrapper>
          </div>
          <div className="flex flex-col gap-2 text-black">
            <InputWrapper
              label={
                hiringProfile.recruiter
                  ? "Criteria you need"
                  : "Criteria you match"
              }
              description={
                hiringProfile.recruiter
                  ? "You will only be matched with searchers who meet all your criteria."
                  : "You will only be matched with recruiters that you meet all criteria for."
              }
            >
              <Radio
                id="radioRust"
                label="Rust engineer"
                checked={hiringProfile.criteria[0]}
                onClick={() => {
                  console.log(hiringProfile.criteria);
                  setHiringProfile((prev) => ({
                    ...prev,
                    criteria: [
                      !prev.criteria[0],
                      prev.criteria[1],
                      prev.criteria[2],
                    ],
                  }));
                }}
              />
              <Radio
                id="radioCryptography"
                label="Cryptography background"
                checked={hiringProfile.criteria[1]}
                onClick={() => {
                  setHiringProfile((prev) => ({
                    ...prev,
                    criteria: [
                      prev.criteria[0],
                      !prev.criteria[1],
                      prev.criteria[2],
                    ],
                  }));
                }}
              />
              <Radio
                id="radioTEE"
                label="Dislikes TEEs"
                checked={hiringProfile.criteria[2]}
                onClick={() => {
                  setHiringProfile((prev) => ({
                    ...prev,
                    criteria: [
                      prev.criteria[0],
                      prev.criteria[1],
                      !prev.criteria[2],
                    ],
                  }));
                }}
              />
            </InputWrapper>
          </div>
          <Input
            label={
              hiringProfile.recruiter
                ? "Maximum salary offer"
                : "Minimum salary request"
            }
            description={
              hiringProfile.recruiter
                ? "Choose a upper bound on salary you would be willing to offer."
                : "Choose a lower bound on salary you would be happy with."
            }
            className="col-span-3 w-full"
            name="room"
            placeholder="Enter salary"
            value={hiringProfile.salary === 0 ? "" : hiringProfile.salary}
            onChange={(change) => {
              const isNumeric = !isNaN(parseInt(change.target.value));
              if (isNumeric) {
                setHiringProfile((prev) => ({
                  ...prev,
                  salary: parseInt(change.target.value),
                }));
              } else {
                setHiringProfile((prev) => ({
                  ...prev,
                  salary: 0,
                }));
              }
            }}
            error={
              salaryError
                ? "Salary must be between $0 and $2,500,000"
                : undefined
            }
          />
        </div>
        <Button
          variant="tertiary"
          onClick={() => {
            if (hiringProfile.salary < 0 || hiringProfile.salary > 2500000) {
              setSalaryError(true);
              return;
            }
            setSalaryError(false);
            saveHiringProfile(hiringProfile);
            router.push("/");
          }}
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
}

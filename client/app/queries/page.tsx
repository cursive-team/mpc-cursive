"use client";

import { Card } from "@/components/cards/Card";
import RecruitingModal from "@/components/modals/RecruitingModal";
import React, { useState } from "react";

type QuestCardProps = {
  title: string;
  description: string;
};

const QueryCard = ({ title, description }: QuestCardProps) => {
  return (
    <Card.Base className="flex flex-col gap-4 p-4 shadow-xl">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <Card.Title className="text-iron-950 text-sm font-bold">
              {title}
            </Card.Title>
            <span className="text-xs font-iron-600 font-sans">
              {description}
            </span>
          </div>
        </div>
      </div>
    </Card.Base>
  );
};

export default function SettingPage() {
  const [isRecruitingModalOpen, setIsRecruitingModalOpen] = useState(false);
  const [isHiringModalOpen, setIsHiringModalOpen] = useState(false);
  const [isMeetupModalOpen, setIsMeetupModalOpen] = useState(false);

  return (
    <>
      <RecruitingModal
        isOpen={isRecruitingModalOpen}
        setIsOpen={setIsRecruitingModalOpen}
      ></RecruitingModal>
      <div className="flex flex-col gap-4 pt-4">
        <span className="text-iron-600 font-sans text-xs">
          Discover connections with your social graph, using MPC for efficient &
          verifiable matches while maintaining your data privacy.
        </span>

        <div onClick={() => setIsRecruitingModalOpen(true)}>
          <QueryCard
            title={"💼 Recruiting"}
            description={
              "Find jobs or find recruits that match your criteria and salary needs."
            }
          />
        </div>
        <QueryCard
          title={"📓 Teaching"}
          description={
            "Find someone who can teach you something, and who you can teach something to in return."
          }
        />
        <QueryCard
          title={"📍 Meetups"}
          description={
            "Find friends or people to meet up with, based on your interests and location."
          }
        />
      </div>
    </>
  );
}

export const PILOT_NAME = "Kevin Mattison";

export interface IndemnitySection {
  heading?: string;
  paragraphs: string[];
}

export const INDEMNITY_SECTIONS: IndemnitySection[] = [
  {
    paragraphs: [
      "Indemnity and Release Form between the Passenger (including any person carried as a passenger on a tandem paragliding flight with the Pilot, whether for training, familiarisation, or leisure purposes) and the Pilot, Kevin Mattison — a licensed / student paragliding pilot training towards a tandem paragliding rating with the South African Hang Gliding and Paragliding Association (“SAHPA”).",
      "The flight contemplated by this Agreement is undertaken on a private, non-commercial basis for training and skills-development purposes and not for commercial gain or reward.",
    ],
  },
  {
    heading: "Background",
    paragraphs: [
      "1. The Pilot is undertaking flights (“the Flights”) in the course of training towards a tandem paragliding rating issued by SAHPA. No fee, reward, or other commercial consideration is charged to or payable by the Passenger for the Flights.",
      "2. The Passenger has voluntarily agreed to be carried on the Flights in the Pilot’s tandem paraglider.",
      "3. These terms apply regardless of whether the Passenger participates for recreational, leisure, or training purposes.",
    ],
  },
  {
    heading: "Undertakings and Warranties",
    paragraphs: [
      "4. I, the undersigned Passenger, hereby confirm and agree that:",
      "4.1 I am participating in the Flights voluntarily and I understand that the Pilot will take all reasonable safety precautions during the Flights.",
      "4.2 I understand that paragliding, including tandem paragliding undertaken for training purposes, has inherent risks and dangers, including serious injury or death, that no amount of care, caution, instruction, or expertise can eliminate, and that the Flights are conducted in an environment controlled by natural elements.",
      "4.3 I acknowledge that there are inherent risks involved which are unknown to me and/or unforeseeable, and that such risks and dangers are numerous and not limited to: equipment failure; changing and unpredictable weather conditions; collisions with other aircraft, paragliders, or obstacles; pilot error; and negligence of the Pilot, other participants, or third parties.",
      "4.4 I voluntarily and freely choose to incur any and all such risks and dangers described in clauses 4.2 and 4.3.",
      "4.5 I understand that the Pilot is training towards a tandem rating and that this flight is undertaken for training purposes and not on a commercial basis.",
      "4.6 I shall at all times comply with any reasonable instruction given by the Pilot in the interest of aviation safety and/or preventing harm to myself or others.",
      "4.7 I am solely responsible for my own personal belongings and effects whilst undertaking the Flights.",
      "4.8 No representation or promise has been made to me that I will suffer no injury or that the Flights are free of risk.",
    ],
  },
  {
    heading: "Medical Provisions",
    paragraphs: [
      "5. Paragliding is a strenuous physical activity. I warrant that I am mentally and physically fit and able to participate in the Flights, that I have not been instructed by a medical practitioner not to participate in flights of this nature, and that I do not suffer from any pre-existing medical condition which would jeopardise my health and/or safety during the Flights.",
      "6. I am aware that my personal insurance or medical aid may be void or voidable unless I notify the applicable insurer of my intention to participate in the Flights.",
      "7. I warrant that I have adequate private medical insurance in the event of an incident while on and/or travelling to the Flights, or I acknowledge that I hereby waive the necessity for such insurance.",
      "8. I authorise the Pilot, and anyone assisting the Pilot, to call for medical care for me or to arrange my transport to a medical facility or hospital if, in the opinion of such personnel, medical attention is needed. I agree that once such transport has been arranged, none of the aforementioned persons shall have any further responsibility for me.",
      "9. I agree to pay all costs associated with such medical care and related transportation provided for me, and I indemnify and hold harmless the Pilot from and against any costs incurred in that regard.",
    ],
  },
  {
    heading: "Exclusion of Liability",
    paragraphs: [
      "10. I, the undersigned Passenger, my heirs, executors, administrators or assigns, or my estate, hereby now and in the future unconditionally indemnify, hold harmless, and release the Pilot, Kevin Mattison, his heirs, executors, administrators and assigns, and any landowner on whose property the Flights depart, transit over, or arrive, from any and all liability, claims, actions, and causes of action whatsoever, arising out of any damage, loss, personal injury, bodily injury, death, or damage to my property and/or any other personal or financial injury or loss.",
      "11. The exclusion of liability in clause 10 applies while upon the premises or in or around the paraglider, harness, tow launch equipment, or any other vehicle used, whether stopped or in motion, and whether the loss, damage, or injury results from the negligence or gross negligence, active or passive, of the Pilot or any other person or entity referred to in clause 10.",
      "12. I further declare that if, as a result of my own negligence or wilful misconduct, anyone suffers personal injury, death, or financial loss, I hereby indemnify the Pilot for any damages he may suffer as a result of defending any action brought against him, or being held liable to any third party, in connection with my act or omission.",
    ],
  },
  {
    heading: "Governing Law",
    paragraphs: [
      "13. This Agreement is governed by and construed under the laws of the Republic of South Africa.",
      "14. Subject to the provisions of this Indemnity, the parties consent to the non-exclusive jurisdiction of the Magistrate’s Court in the Republic of South Africa in respect of any dispute arising from or in connection with this Agreement.",
    ],
  },
  {
    heading: "Acknowledgement",
    paragraphs: [
      "By signing this document, I acknowledge that I understand the scope, nature, and extent of the risks involved in the activity contemplated by this Agreement, and that I have read and understood the terms of this Indemnity and Release, fully understand its contents and implications, sign it of my own free will, and agree to be bound by the terms of same.",
      "In accordance with the Electronic Communications and Transactions Act No 25 of 2002, this indemnity may be signed electronically.",
    ],
  },
];

export const CONFIRMATIONS = [
  {
    key: "confirmed_adult" as const,
    label: "I confirm that I am older than 18.",
  },
  {
    key: "confirmed_risk" as const,
    label:
      "I understand that paragliding, including tandem paragliding undertaken for training purposes, has inherent risks and dangers, including serious injury or death, that no amount of care, caution, instruction, or expertise can eliminate.",
  },
  {
    key: "confirmed_insurance" as const,
    label:
      "I warrant that I have adequate private medical insurance in the event of an incident while on and/or travelling to the Flights.",
  },
  {
    key: "confirmed_signature" as const,
    label:
      "I have read and understood the terms of this Indemnity and Release, fully understand its contents and implications, sign it of my own free will, and agree to be bound by the terms of same.",
  },
];

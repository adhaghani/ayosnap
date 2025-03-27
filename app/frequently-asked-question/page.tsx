"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Text } from "@/components/ui/text";

const FAQS = [
  {
    question: "What is the return policy?",
    answer: "We return products within 30 days of purchase."
  },
  {
    question: "What is the return policy?",
    answer: "We return products within 30 days of purchase."
  },

  {
    question: "What is the return policy?",
    answer: "We return products within 30 days of purchase."
  },
  {
    question: "What is the return policy?",
    answer: "We return products within 30 days of purchase."
  },
  {
    question: "What is the return policy?",
    answer: "We return products within 30 days of purchase."
  },
  {
    question: "What is the return policy?",
    answer: "We return products within 30 days of purchase."
  },

  {
    question: "What is the return policy?",
    answer: "We return products within 30 days of purchase."
  },
  {
    question: "What is the return policy?",
    answer: "We return products within 30 days of purchase."
  },
  {
    question: "What is the return policy?",
    answer: "We return products within 30 days of purchase."
  }
];

const page = () => {
  return (
    <>
      <Text as="h1" className="font-bold text-center mt-20">
        Frequently Asked Questions
      </Text>
      <Text as="p" styleVariant="muted" className="text-center mt-3">
        List of questions you might asked for AyoSnap
      </Text>

      <Accordion
        type="single"
        className="mt-8 mb-10 max-w-xl mx-auto border p-4 rounded-lg"
      >
        {FAQS.map((faq, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger>
              <Text as="h3" className="font-semibold">
                {faq.question}
              </Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text as="p" className="text-lg">
                {faq.answer}
              </Text>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export default page;
